# GearGuard - Execution Guide

## 🚀 Quick Start (5 Minutes)

### Prerequisites Check

Before starting, verify you have:
1. ✅ Node.js installed (check: `node --version`)
2. ✅ MongoDB installed (check: `Get-Service MongoDB`)
3. ✅ GearGuard project folder at `c:\Users\91861\Documents\hackathon 2.0\GearGuard\`

---

## Step-by-Step Execution

### STEP 1: Ensure MongoDB is Running

Open PowerShell as Administrator:

```powershell
Get-Service MongoDB
```

**If status is "Running":** ✅ You're good!

**If status is "Stopped":**
```powershell
Start-Service MongoDB
```

Wait a few seconds for it to start.

---

### STEP 2: Start the Backend Server

Open PowerShell/Command Prompt:

```powershell
cd "c:\Users\91861\Documents\hackathon 2.0\GearGuard\backend"
npm install
```

Wait for installation to complete (usually 1-2 minutes).

Once done, load sample data (optional but recommended):

```powershell
npm run seed
```

You should see output like:
```
Connected to MongoDB
Cleared existing data
Created 5 users
Created 3 teams
Created 5 equipment
Created 6 maintenance requests
Database seeding completed successfully!
```

Now start the backend:

```powershell
npm start
```

**Expected output:**
```
Server running on port 5000
MongoDB connected successfully
```

✅ **Leave this terminal open!** Backend is now running.

---

### STEP 3: Start the Frontend Server

Open a **NEW PowerShell/Command Prompt window**:

```powershell
cd "c:\Users\91861\Documents\hackathon 2.0\GearGuard\frontend"
npm install
```

Wait for installation (usually 2-3 minutes).

Once done:

```powershell
npm start
```

**Expected behavior:**
- React will compile your code
- A browser window will automatically open
- You'll see the GearGuard application

---

## ✅ You're Running GearGuard!

### Access Points
- **Frontend:** http://localhost:3000 (automatically opened)
- **Backend:** http://localhost:5000
- **API Health:** http://localhost:5000/api/health

---

## 🎮 Using the Application

### Main Navigation
The left sidebar has 4 main views:

#### 1. **Kanban Board** (Default View)
- Shows all maintenance requests grouped by stage
- **Stages:** New → In Progress → Repaired → Scrap
- **How to use:**
  - Drag requests between stages
  - Click on a request to see details
  - Red highlighting means overdue
  - Different colors for priority levels

#### 2. **Calendar**
- Shows preventive maintenance scheduled for specific dates
- **How to use:**
  - Click any date to see scheduled maintenance
  - Numbers on dates indicate how many events that day
  - Sidebar shows event details for selected date

#### 3. **Equipment**
- Grid view of all company assets
- **How to use:**
  - Click "Maintenance" button to see all requests for that equipment
  - Badge shows count of open requests
  - Edit/Delete buttons available
  - Shows equipment status (Active, Inactive, Scrapped)

#### 4. **Reports**
- Dashboard with analytics
- **Shows:**
  - Total request counts
  - Status distribution (pie chart)
  - Requests per team (bar chart)
  - Requests per category (bar chart)

---

## 📝 Testing the Sample Data

### Available Sample Equipment
1. **CNC Machine 01** - Production department
2. **Hydraulic Press** - Production department
3. **Office Server** - IT department
4. **Company Vehicle 01** - Operations
5. **Desktop Computer 01** - Production

### Available Sample Requests
- **In Progress:** Hydraulic fluid replacement
- **New:** CNC machine oil leak
- **Repaired:** Vehicle oil change
- **Various:** Other requests in different stages

### Try This Workflow
1. Go to **Kanban Board**
2. Find the "Leaking oil" request (in New stage)
3. **Drag it to "In Progress"** (drag & drop)
4. Go to **Equipment** page
5. Find **CNC Machine 01**
6. Click **"Maintenance"** button
7. You'll see all requests for that machine
8. Badge shows count of open requests

---

## 🔄 API Testing

### Test the Backend API

Open a new PowerShell:

```powershell
# Get all requests
curl http://localhost:5000/api/requests

# Get all equipment
curl http://localhost:5000/api/equipment

# Get all teams
curl http://localhost:5000/api/teams

# Get statistics
curl http://localhost:5000/api/requests/stats/all
```

Or use browser:
- Open http://localhost:5000/api/requests
- Open http://localhost:5000/api/equipment
- Open http://localhost:5000/api/users

---

## 📊 Sample Workflow

### Create a New Request (Manual)

1. In the application, go to **Kanban Board**
2. Look for a "Create Request" button (or use the API)
3. Fill in:
   - **Subject:** "Machine overheating"
   - **Equipment:** Select "CNC Machine 01"
   - **Type:** Select "Corrective"
   - **Priority:** "High"
4. **Submit**
5. Request appears in "New" column
6. Drag it to "In Progress"
7. Drag it to "Repaired"

### Try Calendar Scheduling

1. Go to **Calendar View**
2. Click any date in the future
3. It will show what's scheduled (from sample data)
4. Preventive requests are visible here

### Check Equipment Requests

1. Go to **Equipment**
2. Click "Maintenance" on any equipment
3. See all requests for that equipment
4. Open request count shown in badge

---

## 🛑 Stopping the Application

### To Stop Backend
In backend terminal: Press `Ctrl + C`

### To Stop Frontend
In frontend terminal: Press `Ctrl + C`

### To Stop MongoDB
```powershell
Stop-Service MongoDB
```

---

## ⚠️ Troubleshooting

### Problem: "MongoDB connection error"
**Solution:**
```powershell
Get-Service MongoDB
Start-Service MongoDB
```

### Problem: "Port 5000 already in use"
**Solution:**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
npm start
```

### Problem: "Port 3000 already in use"
**Solution:** Let React use a different port when prompted

### Problem: "Cannot find modules"
**Solution:**
```powershell
rm -r node_modules package-lock.json
npm install
```

### Problem: Frontend shows blank page
**Solution:**
1. Press F12 (open DevTools)
2. Check Console for errors
3. Verify backend is running on port 5000
4. Try hard refresh: `Ctrl + Shift + R`

### Problem: npm install is slow
**Normal** - First installation takes 2-5 minutes
Just wait, don't interrupt

---

## 📱 Accessing from Different Machines

If running on a different machine on your network:

Replace `localhost` with the machine's IP:
```
http://<machine-ip>:3000
```

Backend API:
```
http://<machine-ip>:5000/api
```

To find your machine IP:
```powershell
ipconfig
```
Look for "IPv4 Address"

---

## 🔐 Production Considerations

**This is development setup. For production:**

1. Change `.env` variables:
   - `NODE_ENV=production`
   - Strong `JWT_SECRET`
   - Real MongoDB connection string

2. Build frontend:
   ```powershell
   npm run build
   ```

3. Use proper hosting services:
   - Backend: Heroku, AWS, Azure
   - Frontend: Vercel, Netlify, AWS S3
   - Database: MongoDB Atlas

---

## 📞 Need Help?

Check these in order:

1. **SETUP_GUIDE.md** - Detailed setup help
2. **API_EXAMPLES.md** - API usage examples
3. **README.md** - Complete documentation
4. Browser Console (F12) - Frontend errors
5. Terminal output - Backend errors

---

## ✨ Key Features to Try

1. ✅ **Drag & Drop** - Kanban board requests
2. ✅ **Calendar** - Schedule preventive maintenance
3. ✅ **Smart Button** - Equipment's Maintenance button
4. ✅ **Analytics** - View reports & charts
5. ✅ **Auto-fill** - Create request, team auto-fills
6. ✅ **Overdue** - Red highlighting for past due
7. ✅ **Status** - See request lifecycle
8. ✅ **Search** - Find equipment or requests

---

## 🎯 What's Next?

1. ✅ Run the application (follow this guide)
2. ✅ Explore sample data
3. ✅ Test the Kanban board
4. ✅ Create your own requests
5. ✅ Use the calendar
6. ✅ Check reports

---

## 📋 Command Reference

```powershell
# Check Node
node --version
npm --version

# Check MongoDB
Get-Service MongoDB
Start-Service MongoDB
Stop-Service MongoDB

# Backend
cd backend
npm install          # First time only
npm run seed         # Optional: load sample data
npm start            # Run backend
npm run dev          # Run with auto-reload

# Frontend
cd frontend
npm install          # First time only
npm start            # Run frontend
npm build            # Create build for production

# Network
ipconfig             # Find your IP
netstat -ano | findstr :5000  # Check port usage
```

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ Backend terminal shows:
```
Server running on port 5000
MongoDB connected successfully
```

✅ Frontend automatically opens in browser at http://localhost:3000

✅ You see the GearGuard application with:
- Navigation sidebar on the left
- Main content area showing Kanban board
- Sample data visible (requests, equipment, etc.)

✅ You can:
- Drag requests between columns
- Click on Equipment and see Maintenance button
- Navigate between views in sidebar
- See charts in Reports

---

## 📞 Quick Help

| Issue | Solution |
|-------|----------|
| MongoDB won't start | Run as Administrator |
| Port in use | Kill process using that port |
| npm install slow | It's normal, be patient |
| Frontend blank | Hard refresh (Ctrl+Shift+R) |
| Backend not connecting | Check MongoDB is running |
| Can't find folders | Copy exact path from explorer |

---

## 🚀 You're Ready!

Follow the steps above and you'll have GearGuard running in minutes.

**Any issues? Check the troubleshooting section above.**

**Enjoy managing maintenance! 🛠️**

---

**Last Updated:** December 27, 2025
**GearGuard Version:** 1.0.0
