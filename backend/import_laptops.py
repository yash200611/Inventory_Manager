import pandas as pd
import uuid
from datetime import datetime
import os

def import_laptops():
    """Import laptop data from the second sheet of the Excel file"""
    
    # Read the laptops sheet
    df = pd.read_excel('/Users/ysara563/Desktop/2025 Mobile Inventory.xlsx', sheet_name='Laptops')
    
    # Read existing devices to avoid duplicates
    devices_file = 'devices.csv'
    existing_devices = []
    if os.path.exists(devices_file):
        existing_df = pd.read_csv(devices_file)
        existing_devices = existing_df.to_dict('records')
    
    # Process laptop data
    laptops_to_add = []
    
    for index, row in df.iterrows():
        # Skip rows with no device model
        if pd.isna(row['Device Model']) or str(row['Device Model']).strip() == '':
            continue
            
        # Determine device type based on Type column
        device_type = str(row['Type(Mac, Lenovo)']).strip().lower()
        if 'mac' in device_type:
            device_type = 'MacBook'
        elif 'lenovo' in device_type:
            device_type = 'Laptop'
        else:
            device_type = 'Laptop'  # Default
            
        # Determine status based on whether device is assigned
        status = 'Available'
        assigned_user = None
        if not pd.isna(row['Full Name']) and str(row['Full Name']).strip() != '':
            status = 'Checked Out'
            assigned_user = str(row['Full Name']).strip()
            
        # Create device record
        laptop_device = {
            'id': str(uuid.uuid4()),
            'device_type': f"{device_type} {row['Device Model']}",
            'serial_number': str(row['Serial #']) if not pd.isna(row['Serial #']) else f"LAP-{index+1:04d}",
            'os_version': str(row['Laptop Configuration \xa0 (OS)']) if not pd.isna(row['Laptop Configuration \xa0 (OS)']) else 'Windows 11',
            'status': status,
            'assigned_user': assigned_user,
            'check_out_date': datetime.now().strftime('%Y-%m-%d') if assigned_user else None,
            'usage_count': 1 if assigned_user else 0,
            'created_at': datetime.now().strftime('%Y-%m-%dT%H:%M:%S'),
            'last_updated': datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
        }
        
        # Check if this device already exists (by serial number)
        serial_exists = any(d.get('serial_number') == laptop_device['serial_number'] for d in existing_devices)
        if not serial_exists:
            laptops_to_add.append(laptop_device)
    
    # Add laptops to existing devices
    if laptops_to_add:
        all_devices = existing_devices + laptops_to_add
        devices_df = pd.DataFrame(all_devices)
        devices_df.to_csv(devices_file, index=False)
        print(f"✅ Successfully imported {len(laptops_to_add)} laptop devices")
        print(f"📊 Total devices now: {len(all_devices)}")
        
        # Show some examples
        print("\n📱 Sample imported laptops:")
        for laptop in laptops_to_add[:5]:
            print(f"  - {laptop['device_type']} (Serial: {laptop['serial_number']})")
    else:
        print("ℹ️ No new laptop devices to import")

if __name__ == "__main__":
    import_laptops() 