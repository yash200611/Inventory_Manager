#!/usr/bin/env python3
"""
Startup script for Device Inventory Manager Backend
This script will install dependencies and start the Flask server
"""

import subprocess
import sys
import os

def install_dependencies():
    """Install required packages"""
    print("📦 Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully")
    except subprocess.CalledProcessError:
        print("❌ Failed to install dependencies")
        return False
    return True

def start_server():
    """Start the Flask server"""
    print("🚀 Starting Flask server...")
    print("📍 Server will be available at: http://localhost:5000")
    print("📖 API documentation available in README.md")
    print("🧪 Run 'python test_api.py' to test the API")
    print("\n" + "=" * 50)
    
    try:
        subprocess.run([sys.executable, "app.py"])
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Failed to start server: {e}")

if __name__ == "__main__":
    print("🏢 Device Inventory Manager Backend")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("app.py"):
        print("❌ Error: app.py not found. Make sure you're in the backend directory.")
        sys.exit(1)
    
    # Install dependencies
    if install_dependencies():
        # Start the server
        start_server()
    else:
        print("❌ Failed to start due to dependency installation issues")
        sys.exit(1) 