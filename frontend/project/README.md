# Device Inventory Manager - Frontend

A modern React TypeScript frontend for the Device Inventory Manager with a beautiful, responsive UI.

## Features

- **Modern UI**: Beautiful, responsive design with dark theme
- **Real-time Updates**: Connected to Flask backend API
- **Device Management**: Add, edit, delete, and track devices
- **User Management**: Manage users and their roles
- **Checkout System**: Check out/in devices with automatic tracking
- **Search & Filter**: Advanced search and filtering capabilities
- **Analytics**: Dashboard with charts and insights
- **Error Handling**: Graceful error handling with fallback to mock data

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** with Zod validation
- **Lucide React** for icons
- **Recharts** for data visualization

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Backend Connection

The frontend connects to the Flask backend at `http://localhost:5000`. Make sure the backend is running before using the frontend.

If the backend is not available, the frontend will fallback to mock data for demonstration purposes.

## API Integration

The frontend uses the following API endpoints:

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

## Features

### Device Management
- View all devices in a responsive grid
- Add new devices with form validation
- Edit device details
- Delete devices (admin only)
- Check out/in devices
- Search and filter devices

### User Management
- View all users
- Add new users
- Manage user roles and departments

### Analytics Dashboard
- Device status overview
- Usage statistics
- Recent activity

### Responsive Design
- Works on desktop, tablet, and mobile
- Dark theme with modern UI
- Smooth animations and transitions

## Development

### Project Structure
```
src/
├── components/     # Reusable UI components
├── contexts/      # React contexts for state management
├── pages/         # Page components
├── services/      # API service layer
├── types/         # TypeScript type definitions
└── App.tsx        # Main app component
```

### Key Components
- `DeviceContext`: Manages device and user state
- `AuthContext`: Handles authentication
- `Layout`: Main layout with navigation
- `DevicesPage`: Device management interface
- `UsersPage`: User management interface
- `AnalyticsPage`: Dashboard with charts

## Error Handling

The application includes comprehensive error handling:
- Network errors are displayed to users
- Fallback to mock data when API is unavailable
- Loading states for better UX
- Form validation with helpful error messages

## Styling

The application uses Tailwind CSS with a custom dark theme:
- Dark background with subtle transparency
- Cyan and purple accent colors
- Glassmorphism effects
- Responsive grid layouts
- Smooth hover animations 