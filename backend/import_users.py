import pandas as pd
import uuid
from datetime import datetime
import os

def import_users_from_devices():
    """Extract unique assigned users from devices.csv and add them to users.csv"""
    
    # Read devices to get assigned users
    devices_df = pd.read_csv('devices.csv')
    
    # Get unique assigned users (remove empty values)
    assigned_users = devices_df['assigned_user'].dropna()
    assigned_users = assigned_users[assigned_users != '']
    unique_users = assigned_users.unique()
    
    # Read existing users
    users_df = pd.read_csv('users.csv')
    existing_names = set(users_df['name'].values)
    
    new_users = []
    
    for user_name in unique_users:
        if user_name not in existing_names:
            # Clean up the name and generate email
            clean_name = user_name.strip()
            # Remove content in parentheses for cleaner names
            if '(' in clean_name:
                clean_name = clean_name.split('(')[0].strip()
            
            # Generate email from name
            email_name = clean_name.lower().replace(' ', '.')
            email = f"{email_name}@company.com"
            
            # Determine department based on name patterns
            department = 'QA'  # Default
            if any(keyword in user_name.lower() for keyword in ['dev', 'development', 'engineer']):
                department = 'Development'
            elif any(keyword in user_name.lower() for keyword in ['test', 'qa', 'quality']):
                department = 'QA'
            elif any(keyword in user_name.lower() for keyword in ['manager', 'lead']):
                department = 'Management'
            
            new_user = {
                'id': str(uuid.uuid4()),
                'name': clean_name,
                'email': email,
                'department': department,
                'role': 'viewer',  # Default role
                'status': 'active',
                'join_date': datetime.now().strftime('%Y-%m-%d')
            }
            new_users.append(new_user)
    
    if new_users:
        # Add new users to existing users
        all_users = users_df.to_dict('records') + new_users
        updated_users_df = pd.DataFrame(all_users)
        updated_users_df.to_csv('users.csv', index=False)
        
        print(f"✅ Added {len(new_users)} new users:")
        for user in new_users:
            print(f"  - {user['name']} ({user['email']}) - {user['department']}")
        print(f"📊 Total users now: {len(all_users)}")
    else:
        print("ℹ️ No new users to add")

if __name__ == "__main__":
    import_users_from_devices()