from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
from datetime import datetime
import uuid
from dateutil import parser

app = Flask(__name__)
CORS(app)

# Data file paths
DEVICES_FILE = 'devices.csv'
USERS_FILE = 'users.csv'
HISTORY_FILE = 'history.csv'

# Initialize CSV files if they don't exist
def initialize_csv_files():
    if not os.path.exists(DEVICES_FILE):
        devices_df = pd.DataFrame(columns=[
            'id', 'device_type', 'connectivity', 'serial_number', 'os_version',
            'assigned_user', 'status', 'usage_count', 'check_out_date',
            'created_at', 'last_updated'
        ])
        devices_df.to_csv(DEVICES_FILE, index=False)
    
    if not os.path.exists(USERS_FILE):
        users_df = pd.DataFrame(columns=[
            'id', 'name', 'email', 'department', 'role', 'status', 'join_date'
        ])
        users_df.to_csv(USERS_FILE, index=False)
    
    if not os.path.exists(HISTORY_FILE):
        history_df = pd.DataFrame(columns=[
            'id', 'device_id', 'user', 'action', 'timestamp'
        ])
        history_df.to_csv(HISTORY_FILE, index=False)

def generate_id():
    return str(uuid.uuid4())

def get_current_timestamp():
    return datetime.now().isoformat()

def add_history_record(device_id, user, action):
    try:
        history_df = pd.read_csv(HISTORY_FILE)
        new_record = {
            'id': generate_id(),
            'device_id': device_id,
            'user': user,
            'action': action,
            'timestamp': get_current_timestamp()
        }
        history_df = pd.concat([history_df, pd.DataFrame([new_record])], ignore_index=True)
        history_df.to_csv(HISTORY_FILE, index=False)
    except Exception as e:
        print(f"Error adding history record: {e}")

# Device endpoints
@app.route('/devices', methods=['GET'])
def get_devices():
    try:
        devices_df = pd.read_csv(DEVICES_FILE)
        # Replace NaN with None so JSON is valid
        devices_df = devices_df.fillna('')
        return jsonify(devices_df.to_dict('records'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/devices/<device_id>', methods=['GET'])
def get_device(device_id):
    try:
        devices_df = pd.read_csv(DEVICES_FILE)
        device = devices_df[devices_df['id'] == device_id]
        if device.empty:
            return jsonify({'error': 'Device not found'}), 404
        return jsonify(device.iloc[0].to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/devices/search', methods=['GET'])
def search_devices():
    try:
        query = request.args.get('q', '').lower()
        if not query:
            return jsonify([])
        
        devices_df = pd.read_csv(DEVICES_FILE)
        
        # Case-insensitive fuzzy search
        mask = (
            devices_df['device_type'].str.lower().str.contains(query, na=False) |
            devices_df['serial_number'].str.lower().str.contains(query, na=False) |
            devices_df['assigned_user'].str.lower().str.contains(query, na=False) |
            devices_df['os_version'].str.lower().str.contains(query, na=False)
        )
        
        results = devices_df[mask]
        return jsonify(results.to_dict('records'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/devices', methods=['POST'])
def add_device():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['device_type', 'connectivity', 'serial_number', 'os_version']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        devices_df = pd.read_csv(DEVICES_FILE)
        
        # Check for duplicate serial number
        if not devices_df.empty and data['serial_number'] in devices_df['serial_number'].values:
            return jsonify({'error': 'Serial number already exists'}), 400
        
        # Create new device
        new_device = {
            'id': generate_id(),
            'device_type': data['device_type'],
            'connectivity': data['connectivity'],
            'serial_number': data['serial_number'],
            'os_version': data['os_version'],
            'assigned_user': data.get('assigned_user', ''),
            'status': data.get('status', 'available'),
            'usage_count': data.get('usage_count', 0),
            'check_out_date': data.get('check_out_date', ''),
            'created_at': get_current_timestamp(),
            'last_updated': get_current_timestamp()
        }
        
        devices_df = pd.concat([devices_df, pd.DataFrame([new_device])], ignore_index=True)
        devices_df.to_csv(DEVICES_FILE, index=False)
        
        add_history_record(new_device['id'], 'system', 'device_created')
        
        return jsonify(new_device), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/devices/<device_id>', methods=['PUT'])
def update_device(device_id):
    try:
        data = request.get_json()
        devices_df = pd.read_csv(DEVICES_FILE)
        
        device_idx = devices_df[devices_df['id'] == device_id].index
        if len(device_idx) == 0:
            return jsonify({'error': 'Device not found'}), 404
        
        # Check for duplicate serial number if serial_number is being updated
        if 'serial_number' in data:
            existing_devices = devices_df[devices_df['id'] != device_id]
            if data['serial_number'] in existing_devices['serial_number'].values:
                return jsonify({'error': 'Serial number already exists'}), 400
        
        # Update fields
        for field in data:
            if field in devices_df.columns and field not in ['id', 'created_at']:
                devices_df.loc[device_idx[0], field] = data[field]
        
        devices_df.loc[device_idx[0], 'last_updated'] = get_current_timestamp()
        devices_df.to_csv(DEVICES_FILE, index=False)
        
        add_history_record(device_id, data.get('updated_by', 'system'), 'device_updated')
        
        return jsonify(devices_df.loc[device_idx[0]].to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/devices/<device_id>/checkout', methods=['PUT'])
def checkout_device(device_id):
    try:
        data = request.get_json()
        if 'user' not in data:
            return jsonify({'error': 'User is required for checkout'}), 400
        
        devices_df = pd.read_csv(DEVICES_FILE)
        device_idx = devices_df[devices_df['id'] == device_id].index
        
        if len(device_idx) == 0:
            return jsonify({'error': 'Device not found'}), 404
        
        device = devices_df.loc[device_idx[0]]
        if device['status'] != 'available':
            return jsonify({'error': 'Device is not available for checkout'}), 400
        
        # Update device
        devices_df.loc[device_idx[0], 'assigned_user'] = data['user']
        devices_df.loc[device_idx[0], 'status'] = 'checked_out'
        devices_df.loc[device_idx[0], 'check_out_date'] = get_current_timestamp()
        devices_df.loc[device_idx[0], 'usage_count'] = device['usage_count'] + 1
        devices_df.loc[device_idx[0], 'last_updated'] = get_current_timestamp()
        
        devices_df.to_csv(DEVICES_FILE, index=False)
        
        add_history_record(device_id, data['user'], 'device_checked_out')
        
        return jsonify(devices_df.loc[device_idx[0]].to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/devices/<device_id>/checkin', methods=['PUT'])
def checkin_device(device_id):
    try:
        devices_df = pd.read_csv(DEVICES_FILE)
        device_idx = devices_df[devices_df['id'] == device_id].index
        
        if len(device_idx) == 0:
            return jsonify({'error': 'Device not found'}), 404
        
        device = devices_df.loc[device_idx[0]]
        if device['status'] != 'checked_out':
            return jsonify({'error': 'Device is not checked out'}), 400
        
        # Update device
        devices_df.loc[device_idx[0], 'assigned_user'] = ''
        devices_df.loc[device_idx[0], 'status'] = 'available'
        devices_df.loc[device_idx[0], 'check_out_date'] = ''
        devices_df.loc[device_idx[0], 'last_updated'] = get_current_timestamp()
        
        devices_df.to_csv(DEVICES_FILE, index=False)
        
        add_history_record(device_id, device['assigned_user'], 'device_checked_in')
        
        return jsonify(devices_df.loc[device_idx[0]].to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/devices/recommendations', methods=['GET'])
def get_device_recommendations():
    try:
        devices_df = pd.read_csv(DEVICES_FILE)
        
        # Filter for devices with low usage or old OS
        low_usage = devices_df[devices_df['usage_count'] < 5]
        old_os = devices_df[devices_df['os_version'].str.contains('old|legacy|deprecated', case=False, na=False)]
        
        # Combine and remove duplicates
        recommendations = pd.concat([low_usage, old_os]).drop_duplicates(subset=['id'])
        
        return jsonify(recommendations.to_dict('records'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# User endpoints
@app.route('/users', methods=['GET'])
def get_users():
    try:
        users_df = pd.read_csv(USERS_FILE)
        return jsonify(users_df.to_dict('records'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/users', methods=['POST'])
def add_user():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'department', 'role']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        users_df = pd.read_csv(USERS_FILE)
        
        # Check for duplicate email
        if not users_df.empty and data['email'] in users_df['email'].values:
            return jsonify({'error': 'Email already exists'}), 400
        
        # Create new user
        new_user = {
            'id': generate_id(),
            'name': data['name'],
            'email': data['email'],
            'department': data['department'],
            'role': data['role'],
            'status': data.get('status', 'active'),
            'join_date': get_current_timestamp()
        }
        
        users_df = pd.concat([users_df, pd.DataFrame([new_user])], ignore_index=True)
        users_df.to_csv(USERS_FILE, index=False)
        
        return jsonify(new_user), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# History endpoints
@app.route('/history/<device_id>', methods=['GET'])
def get_device_history(device_id):
    try:
        history_df = pd.read_csv(HISTORY_FILE)
        device_history = history_df[history_df['device_id'] == device_id]
        
        # Sort by timestamp (newest first)
        device_history = device_history.sort_values('timestamp', ascending=False)
        
        return jsonify(device_history.to_dict('records'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    initialize_csv_files()
    app.run(debug=True, host='localhost', port=5002) 