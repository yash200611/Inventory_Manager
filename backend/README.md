# Device Inventory Manager - Backend

A Flask-based REST API for managing device inventory with CSV storage using Pandas.

## Features

- **Device Management**: Add, update, search, and track devices
- **User Management**: Add and manage users
- **Checkout System**: Check out/in devices with automatic history tracking
- **Search**: Case-insensitive fuzzy search across device properties
- **Recommendations**: Get device recommendations based on usage and OS version
- **History Tracking**: Complete audit trail for all device actions
- **CSV Storage**: Local CSV files for data persistence

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Application**:
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Devices

#### GET /devices
Get all devices
```bash
curl http://localhost:5000/devices
```

#### GET /devices/{id}
Get a specific device by ID
```bash
curl http://localhost:5000/devices/{device_id}
```

#### GET /devices/search?q={query}
Search devices by keyword (case-insensitive)
```bash
curl "http://localhost:5000/devices/search?q=laptop"
```

#### POST /devices
Add a new device
```bash
curl -X POST http://localhost:5000/devices \
  -H "Content-Type: application/json" \
  -d '{
    "device_type": "Laptop",
    "connectivity": "WiFi",
    "serial_number": "LAP001",
    "os_version": "Windows 11",
    "assigned_user": "",
    "status": "available"
  }'
```

#### PUT /devices/{id}
Update a device
```bash
curl -X PUT http://localhost:5000/devices/{device_id} \
  -H "Content-Type: application/json" \
  -d '{
    "os_version": "Windows 11 Pro",
    "updated_by": "admin"
  }'
```

#### PUT /devices/{id}/checkout
Check out a device to a user
```bash
curl -X PUT http://localhost:5000/devices/{device_id}/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "user": "john.doe@company.com"
  }'
```

#### PUT /devices/{id}/checkin
Check in a device
```bash
curl -X PUT http://localhost:5000/devices/{device_id}/checkin
```

#### GET /devices/recommendations
Get device recommendations (low usage or old OS)
```bash
curl http://localhost:5000/devices/recommendations
```

### Users

#### GET /users
Get all users
```bash
curl http://localhost:5000/users
```

#### POST /users
Add a new user
```bash
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@company.com",
    "department": "Engineering",
    "role": "Developer",
    "status": "active"
  }'
```

### History

#### GET /history/{device_id}
Get history for a specific device
```bash
curl http://localhost:5000/history/{device_id}
```

## Data Structure

### Devices CSV
- `id`: Unique identifier (UUID)
- `device_type`: Type of device (e.g., Laptop, Tablet, Phone)
- `connectivity`: Connectivity type (e.g., WiFi, Cellular, Ethernet)
- `serial_number`: Unique serial number
- `os_version`: Operating system version
- `assigned_user`: Currently assigned user (empty if available)
- `status`: Device status (available, checked_out, maintenance)
- `usage_count`: Number of times device has been checked out
- `check_out_date`: Date when device was last checked out
- `created_at`: Device creation timestamp
- `last_updated`: Last update timestamp

### Users CSV
- `id`: Unique identifier (UUID)
- `name`: User's full name
- `email`: User's email address
- `department`: User's department
- `role`: User's role
- `status`: User status (active, inactive)
- `join_date`: User join date

### History CSV
- `id`: Unique identifier (UUID)
- `device_id`: Device ID
- `user`: User who performed the action
- `action`: Action performed (device_created, device_updated, device_checked_out, device_checked_in)
- `timestamp`: Action timestamp

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

Error responses include a JSON object with an `error` field:
```json
{
  "error": "Serial number already exists"
}
```

## Features

- **Unique Constraints**: Serial numbers and user emails are enforced as unique
- **Automatic ID Generation**: UUIDs are automatically generated for new records
- **Timestamp Tracking**: Automatic creation and update timestamps
- **History Logging**: All device actions are automatically logged
- **Case-insensitive Search**: Fuzzy search across multiple device fields
- **CORS Enabled**: Frontend integration ready
- **Error Handling**: Comprehensive error handling for file I/O and validation

## File Storage

The application creates three CSV files in the backend directory:
- `devices.csv`: Device inventory
- `users.csv`: User information
- `history.csv`: Action history

These files are automatically created when the application starts for the first time. 