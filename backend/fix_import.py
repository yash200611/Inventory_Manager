#!/usr/bin/env python3
"""
Fixed import script for the user's Excel file with correct column mapping
"""

import pandas as pd
import uuid
from datetime import datetime

def fix_import():
    excel_file = "/Users/ysara563/Desktop/2025 Mobile Inventory.xlsx"
    
    try:
        print(f"📖 Reading Excel file: {excel_file}")
        df = pd.read_excel(excel_file)
        
        print(f"✅ Found {len(df)} rows of data")
        print(f"📋 Columns: {list(df.columns)}")
        
        # Show sample data
        print("\n📄 Sample data (first 3 rows):")
        print(df.head(3))
        
        # Filter for mobile and laptops only
        mobile_keywords = ['iphone', 'android', 'pixel', 'samsung', 'galaxy', 'motorola', 'oneplus', 'oppo', 'redmi', 'nokia', 'tcl', 'google']
        laptop_keywords = ['macbook', 'laptop', 'dell', 'hp', 'lenovo', 'acer', 'asus']
        
        # Create filter mask
        device_filter = df['Device\xa0'].str.lower().str.contains('|'.join(mobile_keywords + laptop_keywords), na=False)
        filtered_df = df[device_filter]
        
        print(f"\n📱 Filtered for mobile and laptops: {len(filtered_df)} devices")
        
        # Create new dataframe with correct mapping
        new_df = pd.DataFrame()
        
        # Map columns correctly using the actual column names
        new_df['device_type'] = filtered_df['Device\xa0']
        new_df['serial_number'] = filtered_df['Serial Number']
        new_df['os_version'] = filtered_df['Android/iOS Version ']
        new_df['connectivity'] = filtered_df['Wifi/Cellular']
        new_df['assigned_user'] = filtered_df['Tester']
        
        # Set status based on whether device is assigned
        new_df['status'] = new_df['assigned_user'].apply(lambda x: 'checked_out' if pd.notna(x) and str(x).strip() != '' else 'available')
        
        # Add required fields
        new_df['usage_count'] = 0
        new_df['check_out_date'] = ''
        new_df['created_at'] = datetime.now().isoformat()
        new_df['last_updated'] = datetime.now().isoformat()
        
        # Generate IDs
        new_df['id'] = [str(uuid.uuid4()) for _ in range(len(new_df))]
        
        # Clean up the data
        # Replace NaN values with empty strings
        new_df = new_df.fillna('')
        
        # Save to CSV
        output_file = 'devices.csv'
        new_df.to_csv(output_file, index=False)
        
        print(f"\n✅ Successfully imported {len(new_df)} mobile/laptop devices to {output_file}")
        print(f"📊 Preview of imported data:")
        print(new_df[['device_type', 'serial_number', 'os_version', 'assigned_user', 'status']].head())
        
        print(f"\n🚀 Your data is now ready! The backend is already running.")
        print(f"🌐 Go to http://localhost:5173 to see your data in the frontend!")
        
        # Show some statistics
        print(f"\n📈 Statistics:")
        print(f"Total mobile/laptop devices: {len(new_df)}")
        print(f"Assigned devices: {len(new_df[new_df['assigned_user'] != ''])}")
        print(f"Available devices: {len(new_df[new_df['assigned_user'] == ''])}")
        print(f"Checked out devices: {len(new_df[new_df['status'] == 'checked_out'])}")
        
    except Exception as e:
        print(f"❌ Error importing data: {e}")
        print("💡 Make sure your Excel file has the required columns")

if __name__ == "__main__":
    fix_import() 