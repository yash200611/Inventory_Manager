#!/usr/bin/env python3
"""
Excel to CSV Import Script for Device Inventory Manager
This script helps you import your existing Excel data into the CSV format.
"""

import pandas as pd
import os
import sys

def import_excel_to_csv():
    print("📊 Excel to CSV Import Tool")
    print("=" * 50)
    
    # Check if Excel file exists
    excel_file = input("Enter the path to your Excel file (e.g., /path/to/devices.xlsx): ").strip()
    
    if not os.path.exists(excel_file):
        print(f"❌ File not found: {excel_file}")
        return
    
    try:
        # Read Excel file
        print(f"📖 Reading Excel file: {excel_file}")
        df = pd.read_excel(excel_file)
        
        print(f"✅ Found {len(df)} rows of data")
        print(f"📋 Columns: {list(df.columns)}")
        
        # Show sample data
        print("\n📄 Sample data (first 3 rows):")
        print(df.head(3))
        
        # Ask user to map columns
        print("\n🔗 Please map your Excel columns to our CSV format:")
        print("Required columns: device_type, serial_number, os_version")
        print("Optional columns: connectivity, assigned_user, status")
        
        # Get column mappings
        device_type_col = input("Which column contains device type? (e.g., 'Device Type' or 'Type'): ").strip()
        serial_col = input("Which column contains serial number? (e.g., 'Serial Number' or 'Serial'): ").strip()
        os_col = input("Which column contains OS version? (e.g., 'OS Version' or 'OS'): ").strip()
        
        # Optional mappings
        connectivity_col = input("Which column contains connectivity? (press Enter if none): ").strip() or None
        assigned_user_col = input("Which column contains assigned user? (press Enter if none): ").strip() or None
        status_col = input("Which column contains status? (press Enter if none): ").strip() or None
        
        # Create new dataframe with our format
        new_df = pd.DataFrame()
        
        # Required fields
        new_df['device_type'] = df[device_type_col]
        new_df['serial_number'] = df[serial_col]
        new_df['os_version'] = df[os_col]
        
        # Optional fields with defaults
        new_df['connectivity'] = df[connectivity_col] if connectivity_col else 'WiFi'
        new_df['assigned_user'] = df[assigned_user_col] if assigned_user_col else ''
        new_df['status'] = df[status_col] if status_col else 'available'
        
        # Add required fields
        new_df['usage_count'] = 0
        new_df['check_out_date'] = ''
        new_df['created_at'] = pd.Timestamp.now().isoformat()
        new_df['last_updated'] = pd.Timestamp.now().isoformat()
        
        # Generate IDs
        import uuid
        new_df['id'] = [str(uuid.uuid4()) for _ in range(len(new_df))]
        
        # Save to CSV
        output_file = 'devices.csv'
        new_df.to_csv(output_file, index=False)
        
        print(f"\n✅ Successfully imported {len(new_df)} devices to {output_file}")
        print(f"📊 Preview of imported data:")
        print(new_df[['device_type', 'serial_number', 'os_version', 'status']].head())
        
        print(f"\n🚀 Your data is now ready! Start the backend with:")
        print(f"   python3 app.py")
        
    except Exception as e:
        print(f"❌ Error importing data: {e}")
        print("💡 Make sure your Excel file has the required columns")

if __name__ == "__main__":
    import_excel_to_csv() 