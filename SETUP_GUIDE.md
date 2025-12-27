# GearGuard Setup & Execution Guide

## Prerequisites Installation

### 1. Download and Install Node.js

1. Go to https://nodejs.org/
2. Download the **LTS (Long Term Support)** version
3. Run the installer
4. Accept the default settings and complete installation
5. Verify installation by opening PowerShell and typing:
   ```powershell
   node --version
   npm --version
   ```

### 2. Download and Install MongoDB

1. Go to https://www.mongodb.com/try/download/community
2. Select your Windows version (usually Windows x64)
3. Run the MSI installer
4. Accept the License Agreement
5. In "Service Configuration" dialog:
   - Choose "Install MongoDB as a Service" (recommended)
   - Choose "Run service as Network Service user"
6. Complete the installation
7. MongoDB will start automatically as a Windows Service

**Verify MongoDB is running:**
```powershell
Get-Service MongoDB
```

If status shows "Running", you're good!

If MongoDB doesn't start automatically:
```powershell
Start-Service MongoDB
```

---

## GearGuard Project Setup

### Step 1: Navigate to Backend Folder

Open PowerShell/Command Prompt and navigate to the backend:

```powershell
cd "c:\Users\91861\Documents\hackathon 2.0\GearGuard\backend"
```

### Step 2: Install Backend Dependencies

```powershell
npm install
```

This will install:
- Express (web framework)
- Mongoose (MongoDB library)
- CORS (cross-origin support)
- dotenv (environment variables)
- And other dependencies

**Expected output:**
```
added XXX packages in X seconds
```

### Step 3: Verify MongoDB Connection & Seed Data (Optional)

Before starting, you can populate the database with sample data:

```powershell
npm run seed
```

This creates sample users, teams, equipment, and requests for testing.

### Step 4: Start Backend Server

```powershell
npm start
```

**Expected output:**
```
Server running on port 5000
MongoDB connected successfully
```

**Keep this terminal open!** The backend will continue running.

---

## Frontend Setup (New Terminal/PowerShell)

### Step 1: Open New PowerShell Window

Open a new PowerShell/Command Prompt window (keep the backend running in the first one).

### Step 2: Navigate to Frontend Folder

```powershell
cd "c:\Users\91861\Documents\hackathon 2.0\GearGuard\frontend"
```

### Step 3: Install Frontend Dependencies

```powershell
npm install
```

This will install:
- React
- React Router
- Axios (HTTP client)
- React Beautiful DnD (drag & drop)
- React Calendar
- Recharts (charting library)
- And other dependencies

**Note:** This may take 2-5 minutes as it's downloading large packages.

### Step 4: Start Frontend Development Server

```powershell
npm start
```

**Expected behavior:**
- React will compile your code
- Your default browser will automatically open
- You'll see the GearGuard application at `http://localhost:3000`

---

## Accessing the Application

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

---

## Using the Application

### Views & Features

1. **Kanban Board** (Default View)
   - Drag and drop maintenance requests between stages
   - See all requests grouped by status (New, In Progress, Repaired, Scrap)
   - Color-coded priority levels
   - Shows technician assignments with avatars
   - Red indicators for overdue requests

2. **Calendar View**
   - See preventive maintenance scheduled for specific dates
   - Click dates to view details
   - Visual indicators show how many events per day

3. **Equipment Management**
   - View all company assets
   - Click the "Maintenance" button to see all requests for that equipment
   - Shows badge with open request count
   - Track equipment status (Active, Inactive, Scrapped)

4. **Reports & Analytics**
   - Dashboard with key statistics
   - Pie chart showing request status distribution
   - Bar charts for requests by team and category
   - Real-time metrics

### Sample Data

If you ran `npm run seed`, you have sample data to work with:

**Users:**
- John Smith (Manager)
- Sarah Johnson (Technician)
- Mike Davis (Technician)
- Lisa Anderson (Technician)
- Robert Wilson (Manager)

**Teams:**
- Mechanics Team
- Electricians
- IT Support

**Equipment:**
- CNC Machine 01
- Hydraulic Press
- Office Server
- Company Vehicle 01
- Desktop Computer 01

**Sample Requests:**
- Various corrective and preventive requests
- Different stages (New, In Progress, Repaired)
- Different priority levels

---

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongoDB connection error`

**Solution:**
1. Check if MongoDB is running:
   ```powershell
   Get-Service MongoDB
   ```
2. If status is "Stopped", start it:
   ```powershell
   Start-Service MongoDB
   ```
3. Verify connection in MongoDB:
   ```powershell
   mongosh
   show databases
   ```

### Port 5000 Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
1. Find what's using the port:
   ```powershell
   netstat -ano | findstr :5000
   ```
2. Kill the process:
   ```powershell
   taskkill /PID <PID> /F
   ```
3. Restart the backend

### Port 3000 Already in Use (Frontend)

**Error:** `Port 3000 is already in use`

**Solution:**
You can either:
1. Kill the process using port 3000:
   ```powershell
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```
2. Or let React use a different port when prompted

### Dependencies Won't Install

**Error:** `npm ERR!`

**Solution:**
1. Clear the npm cache:
   ```powershell
   npm cache clean --force
   ```
2. Delete node_modules and package-lock.json:
   ```powershell
   rm -r node_modules package-lock.json
   npm install
   ```

### Frontend Won't Load

**Error:** Blank page or errors in browser

**Solution:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check that backend is running
4. Try hard refresh: `Ctrl + Shift + R`
5. If still issues, restart frontend: Stop terminal and run `npm start` again

---

## Development Workflow

### Adding New Features

1. **Backend:** Edit files in `backend/models`, `controllers`, or `routes`
2. **Frontend:** Edit files in `frontend/src/components` or `pages`
3. Changes automatically reload with hot-reload functionality
4. No need to restart servers for most changes

### Running Different Commands

**Backend:**
```powershell
npm start      # Run production server
npm run dev    # Run with nodemon (auto-restart on changes)
npm run seed   # Populate database with sample data
```

**Frontend:**
```powershell
npm start      # Start development server
npm build      # Create production build
npm test       # Run tests
```

---

## Stopping the Application

### To Stop Backend
In the backend terminal, press: `Ctrl + C`

### To Stop Frontend
In the frontend terminal, press: `Ctrl + C`

### To Stop MongoDB
```powershell
Stop-Service MongoDB
```

---

## Next Steps

1. **Create Your Own Data:**
   - Use the Equipment form to add your company's assets
   - Create teams for your departments
   - Start creating maintenance requests

2. **Customize:**
   - Modify colors and branding in CSS files
   - Add your company logo
   - Adjust field requirements as needed

3. **Deploy:**
   - For production, use a proper hosting service
   - Deploy backend to Heroku, AWS, or similar
   - Deploy frontend to Vercel, Netlify, or similar
   - Use environment variables for sensitive data

---

## Environment Variables

The `.env` file in the backend contains:

```
MONGODB_URI=mongodb://localhost:27017/gearguard
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

**For production:**
- Change `NODE_ENV=production`
- Use a strong, random `JWT_SECRET`
- Update `MONGODB_URI` to your production database

---

## Documentation

See `README.md` for:
- Complete API documentation
- Detailed feature descriptions
- Architecture overview
- Technology stack details

---

## Getting Help

If you encounter issues:

1. Check this guide first
2. Review error messages carefully
3. Check browser console (F12) for frontend errors
4. Check terminal output for backend errors
5. Ensure all prerequisites are installed correctly

**Common issues are usually:**
- MongoDB not running
- Port conflicts
- npm/node version mismatch
- Network connectivity issues

---

**You're all set! Enjoy using GearGuard!** 🚀
