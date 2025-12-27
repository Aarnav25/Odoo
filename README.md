# GearGuard - The Ultimate Maintenance Tracker

A comprehensive maintenance management system built with Node.js, Express, MongoDB, and React. This system allows companies to track assets (equipment) and manage maintenance requests with an intuitive interface.

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Project Structure](#project-structure)
5. [API Documentation](#api-documentation)
6. [Usage](#usage)

## Features

### Core Functionality

- **Equipment Management**
  - Track all company assets (machines, vehicles, computers)
  - Group by department or employee
  - Monitor equipment status (Active, Inactive, Scrapped)
  - Track purchase dates and warranty information
  - Location tracking

- **Maintenance Teams**
  - Create specialized teams (Mechanics, Electricians, IT Support, etc.)
  - Assign team members (technicians)
  - Team-based request workflow

- **Maintenance Requests**
  - Two types: Corrective (unplanned) and Preventive (routine)
  - Auto-fill logic when equipment is selected
  - Workflow stages: New → In Progress → Repaired → Scrap
  - Priority levels: Low, Medium, High, Critical
  - Track duration and completion notes

### User Interface

- **Maintenance Kanban Board**
  - Drag-and-drop interface for managing requests
  - Grouped by stages
  - Visual indicators for technician avatars
  - Overdue status highlighting in red
  - Real-time status updates

- **Calendar View**
  - Display all preventive maintenance requests
  - Click dates to schedule new maintenance
  - Visual indicators for scheduled dates
  - Event details in sidebar

- **Equipment Management**
  - Grid view of all equipment
  - Smart "Maintenance" button with open request badges
  - Quick access to equipment-specific requests
  - Edit and delete capabilities

- **Reports & Analytics**
  - Dashboard with key statistics
  - Pie chart for request status distribution
  - Bar charts for requests per team and category
  - Real-time metrics

### Smart Features

- **Auto-Fill Logic**: When selecting equipment for a request, the system automatically:
  - Fetches equipment category
  - Assigns the appropriate maintenance team
  - Populates related information

- **Scrap Logic**: When moving a request to "Scrap" stage:
  - Equipment status is automatically set to "Scrapped"
  - Logged note with timestamp
  - Equipment marked as no longer usable

- **Overdue Tracking**: Requests past due date are highlighted with visual indicators

## Prerequisites

### System Requirements

- Windows 10/11 (or macOS/Linux)
- Node.js 14.0 or higher
- MongoDB 4.4 or higher
- 4GB RAM minimum
- 1GB disk space

### Required Software

1. **Node.js** - Download from https://nodejs.org/ (LTS version recommended)
2. **MongoDB** - Download from https://www.mongodb.com/try/download/community

## Installation

### Step 1: Install Node.js

1. Download Node.js from https://nodejs.org/
2. Run the installer and follow the setup wizard
3. Accept default settings
4. Verify installation:
   ```
   node --version
   npm --version
   ```

### Step 2: Install MongoDB

1. Download MongoDB Community from https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. During installation, choose to install MongoDB Compass (optional GUI)
4. MongoDB should start as a Windows Service automatically

**To verify MongoDB is running:**
```powershell
Get-Service MongoDB
```

If not running, start it:
```powershell
Start-Service MongoDB
```

**Alternative: Run MongoDB manually (without service)**
```powershell
mongod --dbpath C:\data\db
```

### Step 3: Set Up Backend

1. Open PowerShell/Command Prompt
2. Navigate to the backend folder:
   ```
   cd "c:\Users\91861\Documents\hackathon 2.0\GearGuard\backend"
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. The `.env` file is already configured. Verify it contains:
   ```
   MONGODB_URI=mongodb://localhost:27017/gearguard
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_change_in_production
   NODE_ENV=development
   ```

5. Start the backend server:
   ```
   npm start
   ```

   You should see: `Server running on port 5000`
   And: `MongoDB connected successfully`

### Step 4: Set Up Frontend

1. Open a new PowerShell/Command Prompt window
2. Navigate to the frontend folder:
   ```
   cd "c:\Users\91861\Documents\hackathon 2.0\GearGuard\frontend"
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

   The application will automatically open at `http://localhost:3000`

## Project Structure

```
GearGuard/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Equipment.js
│   │   ├── MaintenanceTeam.js
│   │   └── MaintenanceRequest.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── equipmentController.js
│   │   ├── teamController.js
│   │   └── requestController.js
│   ├── routes/
│   │   ├── users.js
│   │   ├── equipment.js
│   │   ├── teams.js
│   │   └── requests.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── KanbanBoard.js
    │   │   ├── CalendarView.js
    │   │   ├── Reports.js
    │   │   ├── EquipmentList.js
    │   │   └── index.js
    │   ├── pages/
    │   ├── services/
    │   │   └── api.js
    │   ├── styles/
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Users Endpoints

```
GET    /api/users              - Get all users
GET    /api/users/:id          - Get single user
POST   /api/users              - Create user
PUT    /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user
```

**Create User Example:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "department": "Production",
  "role": "Technician",
  "avatar": "https://via.placeholder.com/40"
}
```

### Equipment Endpoints

```
GET    /api/equipment                    - Get all equipment
GET    /api/equipment/:id                - Get single equipment
POST   /api/equipment                    - Create equipment
PUT    /api/equipment/:id                - Update equipment
DELETE /api/equipment/:id                - Delete equipment
GET    /api/equipment/:id/requests       - Get equipment requests
```

**Create Equipment Example:**
```json
{
  "name": "CNC Machine 01",
  "serialNumber": "CNC-2024-001",
  "category": "Machine",
  "department": "Production",
  "owner": "user_id",
  "maintenanceTeam": "team_id",
  "assignedTechnician": "technician_id",
  "purchaseDate": "2023-01-15",
  "warrantyExpiry": "2025-01-15",
  "location": "Production Floor - Section A",
  "notes": "Critical equipment"
}
```

### Maintenance Team Endpoints

```
GET    /api/teams              - Get all teams
GET    /api/teams/:id          - Get single team
POST   /api/teams              - Create team
PUT    /api/teams/:id          - Update team
POST   /api/teams/:id/members  - Add team member
DELETE /api/teams/:id/members  - Remove team member
DELETE /api/teams/:id          - Delete team
```

**Create Team Example:**
```json
{
  "name": "Mechanics Team",
  "description": "Responsible for mechanical repairs",
  "specialty": "Mechanics",
  "members": [],
  "teamLead": "user_id"
}
```

### Maintenance Request Endpoints

```
GET    /api/requests                           - Get all requests
GET    /api/requests/:id                       - Get single request
POST   /api/requests                           - Create request
PUT    /api/requests/:id                       - Update request
PUT    /api/requests/:id/stage                 - Update stage
PUT    /api/requests/:id/assign                - Assign technician
PUT    /api/requests/:id/complete              - Complete request
DELETE /api/requests/:id                       - Delete request
GET    /api/requests/equipment/:equipmentId    - Get requests by equipment
GET    /api/requests/calendar/events           - Get calendar requests
GET    /api/requests/stats/all                 - Get statistics
```

**Create Request Example:**
```json
{
  "subject": "Leaking oil from main bearing",
  "equipment": "equipment_id",
  "requestType": "Corrective",
  "description": "The machine is leaking oil from the main bearing assembly",
  "priority": "High",
  "createdBy": "user_id",
  "dueDate": "2024-12-28"
}
```

**Update Stage Example:**
```json
{
  "stage": "In Progress"
}
```

**Complete Request Example:**
```json
{
  "durationHours": 2.5,
  "completionNotes": "Replaced bearing assembly. Machine tested and working fine."
}
```

## Usage

### Initial Setup (First Time)

1. Create some users in the system
2. Create maintenance teams
3. Create equipment and assign teams
4. Start creating and managing maintenance requests

### Typical Workflow

#### Corrective Maintenance (Breakdown)
1. User reports a broken equipment → Creates a new request
2. System auto-fills the team based on equipment assignment
3. Manager reviews and assigns a technician
4. Request moves to "In Progress"
5. Technician completes the work and records hours
6. Request moves to "Repaired"

#### Preventive Maintenance (Routine Checkup)
1. Manager creates a "Preventive" request
2. Sets a scheduled date
3. Request appears on the Calendar View
4. Technician sees it on their calendar
5. On the scheduled date, technician performs maintenance
6. Marks as "Repaired" with completion notes

### Accessing Different Views

- **Kanban Board**: Main dashboard for managing requests by stage
- **Calendar**: View and schedule preventive maintenance
- **Equipment**: Manage all assets and view related requests
- **Reports**: View statistics and analytics

## Troubleshooting

### MongoDB Connection Error

**Problem**: Backend fails to connect to MongoDB

**Solution**:
1. Verify MongoDB is running:
   ```powershell
   Get-Service MongoDB
   ```
2. If not running, start it:
   ```powershell
   Start-Service MongoDB
   ```
3. Check the MONGODB_URI in `.env` file matches your MongoDB installation

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
1. Find the process using port 5000:
   ```powershell
   netstat -ano | findstr :5000
   ```
2. Kill the process:
   ```powershell
   taskkill /PID <process_id> /F
   ```

### Node Modules Issues

**Problem**: `npm install` fails or modules not found

**Solution**:
```powershell
# Delete node_modules and lock file
rm -r node_modules package-lock.json

# Reinstall
npm install
```

### Frontend Won't Load

**Problem**: Blank page or component errors in React

**Solution**:
1. Check browser console for errors (F12)
2. Verify backend is running on port 5000
3. Restart the frontend server: `npm start`

## Environment Variables

### Backend (.env)

```
MONGODB_URI=mongodb://localhost:27017/gearguard
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

For production, change `NODE_ENV=production` and use a strong JWT_SECRET.

## Technology Stack

### Backend
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Runtime**: Node.js

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Drag & Drop**: React Beautiful DnD
- **Calendar**: React Calendar
- **Charts**: Recharts
- **Icons**: React Icons
- **Styling**: CSS3

## License

This project is developed for hackathon purposes.

## Support

For issues or questions, please check:
1. The troubleshooting section above
2. Browser console (F12) for client-side errors
3. Backend terminal for server errors
4. MongoDB logs if database connection fails
