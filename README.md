# Device Inventory Manager

A comprehensive device inventory management system with a Flask backend and React frontend.

## 🏗️ Architecture

- **Backend**: Flask (Python) + Pandas + CSV storage
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Storage**: Local CSV files for data persistence
- **API**: RESTful API with CORS support

## 📁 Project Structure

```
Inventory_Manager/
├── backend/                 # Flask backend
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   ├── README.md          # Backend documentation
│   ├── test_api.py        # API testing script
│   ├── run.py             # Startup script
│   └── *.csv              # Data files (auto-generated)
├── frontend/               # React frontend
│   └── project/           # React application
│       ├── src/           # Source code
│       ├── package.json   # Node dependencies
│       └── README.md      # Frontend documentation
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Start the Backend

```bash
cd backend
python3 -m pip install -r requirements.txt
python3 app.py
```

The backend will start on `http://localhost:5000`

### 2. Start the Frontend

```bash
cd frontend/project
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## 💾 Data Storage

### How Your Data is Stored

The application stores all data locally in CSV files in the `backend/` directory:

1. **`devices.csv`** - Device inventory
   - `id`: Unique identifier (UUID)
   - `device_type`: Type of device (Laptop, iPhone, etc.)
   - `connectivity`: Connectivity type (WiFi, Cellular, etc.)
   - `serial_number`: Unique serial number
   - `os_version`: Operating system version
   - `assigned_user`: Currently assigned user
   - `status`: Device status (available, checked_out, etc.)
   - `usage_count`: Number of times checked out
   - `check_out_date`: Last checkout date
   - `created_at`: Device creation timestamp
   - `last_updated`: Last update timestamp

2. **`users.csv`** - User information
   - `id`: Unique identifier (UUID)
   - `name`: User's full name
   - `email`: User's email address
   - `department`: User's department
   - `role`: User's role
   - `status`: User status (active, inactive)
   - `join_date`: User join date

3. **`history.csv`** - Action history
   - `id`: Unique identifier (UUID)
   - `device_id`: Device ID
   - `user`: User who performed the action
   - `action`: Action performed (device_created, checkout, etc.)
   - `timestamp`: Action timestamp

### Data Persistence

- **Automatic Creation**: CSV files are automatically created when the backend starts
- **Real-time Updates**: All changes are immediately saved to CSV files
- **Backup Friendly**: CSV files can be easily backed up, versioned, or migrated
- **Human Readable**: Data can be viewed and edited in any spreadsheet application

### Data Management

#### Backing Up Your Data
```bash
# Copy the CSV files to a backup location
cp backend/*.csv /path/to/backup/
```

#### Restoring Data
```bash
# Replace the CSV files with your backup
cp /path/to/backup/*.csv backend/
```

#### Exporting Data
```bash
# The frontend includes CSV export functionality
# Use the "Export CSV" button in the Devices page
```

#### Manual Data Editing
You can edit the CSV files directly in any spreadsheet application:
```bash
# Open in Excel, Google Sheets, or any CSV editor
open backend/devices.csv
```

## 🔧 API Endpoints

### Devices
- `GET /devices` - Get all devices
- `GET /devices/{id}` - Get specific device
- `GET /devices/search?q={query}` - Search devices
- `POST /devices` - Add new device
- `PUT /devices/{id}` - Update device
- `PUT /devices/{id}/checkout` - Checkout device
- `PUT /devices/{id}/checkin` - Checkin device
- `GET /devices/recommendations` - Get device recommendations

### Users
- `GET /users` - Get all users
- `POST /users` - Add new user

### History
- `GET /history/{device_id}` - Get device history

## 🎯 Features

### Device Management
- ✅ Add, edit, and delete devices
- ✅ Check out/in devices with automatic tracking
- ✅ Search and filter devices
- ✅ Device status tracking
- ✅ Usage statistics
- ✅ Serial number validation

### User Management
- ✅ Add and manage users
- ✅ Role-based access control
- ✅ Department organization
- ✅ User status tracking

### Analytics & Reporting
- ✅ Device status overview
- ✅ Usage analytics
- ✅ History tracking
- ✅ CSV export functionality

### User Experience
- ✅ Modern, responsive UI
- ✅ Real-time updates
- ✅ Error handling with fallbacks
- ✅ Loading states
- ✅ Form validation

## 🔒 Security & Data Integrity

- **Unique Constraints**: Serial numbers and user emails are enforced as unique
- **Automatic ID Generation**: UUIDs prevent conflicts
- **Timestamp Tracking**: All changes are timestamped
- **History Logging**: Complete audit trail for all actions
- **Error Handling**: Graceful handling of data corruption

## 🛠️ Development

### Backend Development
```bash
cd backend
python3 -m pip install -r requirements.txt
python3 test_api.py  # Test the API
```

### Frontend Development
```bash
cd frontend/project
npm install
npm run dev
npm run build  # Build for production
```

### Testing
```bash
# Test backend API
cd backend
python3 test_api.py

# Test frontend
cd frontend/project
npm run lint
```

## 📊 Data Migration

### From Other Systems
If you have data in other formats, you can convert it to the CSV format:

1. **Excel/Google Sheets**: Export as CSV and place in `backend/`
2. **JSON Data**: Convert to CSV format matching the schema
3. **Database Export**: Export to CSV and place in `backend/`

### To Other Systems
The CSV format makes it easy to migrate to other systems:
- **Database**: Import CSV files into any database
- **Cloud Storage**: Upload CSV files to cloud storage
- **Other Applications**: Use CSV files with any application that supports them

## 🚨 Troubleshooting

### Backend Issues
- **Port 5000 in use**: Change port in `app.py`
- **CSV file errors**: Delete CSV files and restart (data will be recreated)
- **Import errors**: Ensure all dependencies are installed

### Frontend Issues
- **API connection errors**: Check if backend is running on port 5000
- **Build errors**: Clear node_modules and reinstall
- **CORS errors**: Backend has CORS enabled by default

### Data Issues
- **Missing data**: Check CSV file permissions
- **Corrupted data**: Restore from backup or restart backend
- **Duplicate entries**: Check for duplicate serial numbers or emails

## 📈 Scaling Considerations

### For Larger Datasets
- Consider migrating to a database (PostgreSQL, SQLite)
- Implement pagination for large device lists
- Add caching for frequently accessed data

### For Multiple Users
- Add user authentication and authorization
- Implement role-based access control
- Add audit logging for compliance

### For Production
- Use a production WSGI server (Gunicorn)
- Add environment variables for configuration
- Implement proper logging and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License. 