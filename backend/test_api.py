#!/usr/bin/env python3
"""
Test script for the Device Inventory Manager API
Run this script to test all endpoints with sample data
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000"

def test_api():
    print("🧪 Testing Device Inventory Manager API")
    print("=" * 50)
    
    # Test 1: Add a user
    print("\n1. Adding a test user...")
    user_data = {
        "name": "John Doe",
        "email": "john.doe@company.com",
        "department": "Engineering",
        "role": "Developer",
        "status": "active"
    }
    
    response = requests.post(f"{BASE_URL}/users", json=user_data)
    if response.status_code == 201:
        user = response.json()
        print(f"✅ User added: {user['name']} ({user['email']})")
    else:
        print(f"❌ Failed to add user: {response.text}")
        return
    
    # Test 2: Add a device
    print("\n2. Adding a test device...")
    device_data = {
        "device_type": "Laptop",
        "connectivity": "WiFi",
        "serial_number": "LAP001",
        "os_version": "Windows 11",
        "status": "available"
    }
    
    response = requests.post(f"{BASE_URL}/devices", json=device_data)
    if response.status_code == 201:
        device = response.json()
        device_id = device['id']
        print(f"✅ Device added: {device['device_type']} ({device['serial_number']})")
    else:
        print(f"❌ Failed to add device: {response.text}")
        return
    
    # Test 3: Get all devices
    print("\n3. Getting all devices...")
    response = requests.get(f"{BASE_URL}/devices")
    if response.status_code == 200:
        devices = response.json()
        print(f"✅ Found {len(devices)} devices")
    else:
        print(f"❌ Failed to get devices: {response.text}")
    
    # Test 4: Search devices
    print("\n4. Searching devices...")
    response = requests.get(f"{BASE_URL}/devices/search?q=laptop")
    if response.status_code == 200:
        results = response.json()
        print(f"✅ Search found {len(results)} results")
    else:
        print(f"❌ Search failed: {response.text}")
    
    # Test 5: Checkout device
    print("\n5. Checking out device...")
    checkout_data = {"user": "john.doe@company.com"}
    response = requests.put(f"{BASE_URL}/devices/{device_id}/checkout", json=checkout_data)
    if response.status_code == 200:
        device = response.json()
        print(f"✅ Device checked out to: {device['assigned_user']}")
    else:
        print(f"❌ Checkout failed: {response.text}")
    
    # Test 6: Get device history
    print("\n6. Getting device history...")
    response = requests.get(f"{BASE_URL}/history/{device_id}")
    if response.status_code == 200:
        history = response.json()
        print(f"✅ Found {len(history)} history records")
        for record in history:
            print(f"   - {record['action']} by {record['user']} at {record['timestamp']}")
    else:
        print(f"❌ Failed to get history: {response.text}")
    
    # Test 7: Checkin device
    print("\n7. Checking in device...")
    response = requests.put(f"{BASE_URL}/devices/{device_id}/checkin")
    if response.status_code == 200:
        device = response.json()
        print(f"✅ Device checked in. Status: {device['status']}")
    else:
        print(f"❌ Checkin failed: {response.text}")
    
    # Test 8: Get recommendations
    print("\n8. Getting device recommendations...")
    response = requests.get(f"{BASE_URL}/devices/recommendations")
    if response.status_code == 200:
        recommendations = response.json()
        print(f"✅ Found {len(recommendations)} recommended devices")
    else:
        print(f"❌ Failed to get recommendations: {response.text}")
    
    # Test 9: Get all users
    print("\n9. Getting all users...")
    response = requests.get(f"{BASE_URL}/users")
    if response.status_code == 200:
        users = response.json()
        print(f"✅ Found {len(users)} users")
    else:
        print(f"❌ Failed to get users: {response.text}")
    
    print("\n" + "=" * 50)
    print("🎉 API testing completed!")

if __name__ == "__main__":
    try:
        test_api()
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to the API. Make sure the Flask server is running on localhost:5000")
        print("Run: python app.py")
    except Exception as e:
        print(f"❌ Test failed with error: {e}") 