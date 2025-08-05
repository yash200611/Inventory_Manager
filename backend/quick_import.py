#!/usr/bin/env python3
"""
Quick import for the user's Excel file
"""

import pandas as pd
import uuid
from datetime import datetime

def quick_import():
    excel_file = "/Users/ysara563/Desktop/2025 Mobile Inventory.xlsx"
    
    try:
        print(f"📖 Reading Excel file: {excel_file}")
        df = pd.read_excel(excel_file)
        
        print(f"✅ Found {len(df)} rows of data")
        print(f"📋 Columns: {list(df.columns)}")
        
        # Show sample data
        print("\n📄 Sample data (first 3 rows):")
        print(df.head(3))
        
        # Ask user to map columns
        print("\n🔗 Please tell me which columns contain:")
        
        # Try to auto-detect common column names
        device_type_col = None
        serial_col = None
        os_col = None
        
        # Auto-detect device type column
        for col in df.columns:
            if any(word in col.lower() for word in ['device', 'type', 'model', 'name']):
                device_type_col = col
                break
        
        # Auto-detect serial column
        for col in df.columns:
            if any(word in col.lower() for word in ['serial', 'sn', 'id']):
                serial_col = col
                break
        
        # Auto-detect OS column
        for col in df.columns:
            if any(word in col.lower() for word in ['os', 'version', 'system', 'ios', 'android']):
                os_col = col
                break
        
        print(f"Auto-detected columns:")
        print(f"Device Type: {device_type_col or 'NOT FOUND'}")
        print(f"Serial Number: {serial_col or 'NOT FOUND'}")
        print(f"OS Version: {os_col or 'NOT FOUND'}")
        
        # If auto-detection failed, ask user
        if not device_type_col:
            device_type_col = input("Which column contains device type? ")
        if not serial_col:
            serial_col = input("Which column contains serial number? ")
        if not os_col:
            os_col = input("Which column contains OS version? ")
        
        # Create new dataframe with our format
        new_df = pd.DataFrame()
        
        # Required fields
        new_df['device_type'] = df[device_type_col]
        new_df['serial_number'] = df[serial_col]
        new_df['os_version'] = df[os_col]
        
        # Optional fields with defaults
        new_df['connectivity'] = 'WiFi'  # Default
        new_df['assigned_user'] = ''     # Default
        new_df['status'] = 'available'   # Default
        
        # Add required fields
        new_df['usage_count'] = 0
        new_df['check_out_date'] = ''
        new_df['created_at'] = datetime.now().isoformat()
        new_df['last_updated'] = datetime.now().isoformat()
        
        # Generate IDs
        new_df['id'] = [str(uuid.uuid4()) for _ in range(len(new_df))]
        
        # Save to CSV
        output_file = 'devices.csv'
        new_df.to_csv(output_file, index=False)
        
        print(f"\n✅ Successfully imported {len(new_df)} devices to {output_file}")
        print(f"📊 Preview of imported data:")
        print(new_df[['device_type', 'serial_number', 'os_version', 'status']].head())
        
        print(f"\n🚀 Your data is now ready! The backend is already running.")
        print(f"🌐 Go to http://localhost:5173 to see your data in the frontend!")
        
    except Exception as e:
        print(f"❌ Error importing data: {e}")
        print("💡 Make sure your Excel file has the required columns")

if __name__ == "__main__":
    quick_import() 