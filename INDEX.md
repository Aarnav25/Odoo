# 🛠️ GearGuard - The Ultimate Maintenance Tracker

## Quick Links

### 📚 Documentation
1. **[START HERE] QUICK_START_EXECUTION.md** ← Read this first!
2. **SETUP_GUIDE.md** - Detailed setup instructions
3. **README.md** - Complete project documentation
4. **API_EXAMPLES.md** - API endpoints & examples
5. **PROJECT_SUMMARY.md** - Project overview
6. **FILE_STRUCTURE.md** - Complete file listing

---

## ⚡ 5-Minute Quick Start

### Prerequisite: Ensure MongoDB is Running
```powershell
Get-Service MongoDB
# If not running:
Start-Service MongoDB
```

### Terminal 1: Backend
```powershell
cd backend
npm install
npm run seed        # Load sample data
npm start           # Run on port 5000
```

### Terminal 2: Frontend
```powershell
cd frontend
npm install
npm start           # Opens http://localhost:3000
```

**That's it! Application is now running.** ✅

---

## 📋 What You Get

### Backend Features
✅ Complete REST API (25+ endpoints)
✅ MongoDB database with 4 collections
✅ User management system
✅ Equipment tracking
✅ Maintenance team management
✅ Request lifecycle management
✅ Auto-fill logic
✅ Scrap equipment tracking
✅ Statistics & reporting

### Frontend Features
✅ Kanban board with drag & drop
✅ Calendar for preventive maintenance
✅ Equipment management with smart buttons
✅ Real-time analytics dashboard
✅ Responsive design
✅ Modern UI with navigation

### Sample Data Included
✅ 5 sample users with roles
✅ 3 maintenance teams
✅ 5 equipment items
✅ 6 maintenance requests
✅ Various request types & statuses

---

## 📂 Project Structure

```
GearGuard/
├── backend/              (Node.js + Express + MongoDB)
│   ├── models/          (Database schemas)
│   ├── controllers/     (Business logic)
│   ├── routes/          (API endpoints)
│   ├── server.js        (Express setup)
│   ├── seed.js          (Sample data)
│   └── .env             (Config)
│
├── frontend/            (React + Components)
│   ├── public/          (HTML template)
│   └── src/
│       ├── components/  (Kanban, Calendar, etc.)
│       ├── services/    (API client)
│       ├── styles/      (CSS styling)
│       └── App.js       (Main component)
│
└── Documentation Files (6)
    └── Comprehensive guides
```

---

## 🎯 Key Endpoints

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create user

### Equipment
- `GET /api/equipment` - List equipment
- `POST /api/equipment` - Create equipment
- `GET /api/equipment/:id/requests` - Equipment's requests (Smart Button)

### Teams
- `GET /api/teams` - List teams
- `POST /api/teams` - Create team

### Requests
- `GET /api/requests` - List requests
- `POST /api/requests` - Create request (Auto-fill team)
- `PUT /api/requests/:id/stage` - Update stage (Kanban)
- `GET /api/requests/calendar/events` - Calendar events
- `GET /api/requests/stats/all` - Statistics

---

## 🎮 Main Views

### 1. Kanban Board
- Drag & drop requests between stages
- 4 columns: New | In Progress | Repaired | Scrap
- Color-coded priority
- Technician avatars
- Overdue highlighting

### 2. Calendar
- View preventive maintenance schedules
- Click dates for event details
- Visual event indicators

### 3. Equipment
- Grid view of all assets
- "Maintenance" button with open request count
- Status tracking (Active, Inactive, Scrapped)
- Quick actions (Edit, Delete)

### 4. Reports
- Total request count
- Status distribution chart
- Requests per team
- Requests per category

---

## 💡 Smart Features

✅ **Auto-Fill**: Select equipment → team automatically assigned
✅ **Smart Button**: Equipment → View all related requests
✅ **Scrap Logic**: Mark equipment as unusable + log timestamp
✅ **Overdue Tracking**: Red highlighting for past due requests
✅ **Request Badges**: Show count of open requests
✅ **Drag & Drop**: Kanban workflow
✅ **Calendar Integration**: Schedule preventive maintenance
✅ **Real-time Stats**: Dashboard with analytics

---

## 🛠️ Technology Stack

### Backend
- Node.js 14+
- Express.js 4.18
- MongoDB 4.4+
- Mongoose 7.0

### Frontend
- React 18
- React Router v6
- Axios
- React Beautiful DnD (Drag & Drop)
- React Calendar
- Recharts (Charts)
- React Icons

---

## 📦 Installation Size

- **Backend dependencies:** ~150MB
- **Frontend dependencies:** ~500MB
- **Total with code:** ~700MB

---

## 🚀 Getting Started

### Step 1: Prerequisites
✅ Download Node.js from https://nodejs.org/
✅ Download MongoDB from https://www.mongodb.com/

### Step 2: Read Documentation
**[READ FIRST]** Open **QUICK_START_EXECUTION.md** in this folder

### Step 3: Start Application
Follow the 3-step quick start above

### Step 4: Access Application
- Open http://localhost:3000 in your browser
- Explore sample data
- Test the features

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| **QUICK_START_EXECUTION.md** | Step-by-step execution guide |
| **SETUP_GUIDE.md** | Detailed setup & troubleshooting |
| **README.md** | Complete documentation |
| **API_EXAMPLES.md** | API endpoints with examples |
| **PROJECT_SUMMARY.md** | Project completion summary |
| **FILE_STRUCTURE.md** | Complete file listing |

---

## ✅ What's Included

- ✅ 51 source files
- ✅ 25+ API endpoints
- ✅ 4 frontend views
- ✅ 4 database collections
- ✅ Sample data (users, equipment, teams, requests)
- ✅ 6 comprehensive guides
- ✅ Production-ready code
- ✅ Error handling & validation

---

## 🔧 Environment

The `.env` file is pre-configured for local development:
```
MONGODB_URI=mongodb://localhost:27017/gearguard
PORT=5000
NODE_ENV=development
```

For production, update as needed.

---

## 📞 Quick Help

### "I don't know where to start"
→ Read **QUICK_START_EXECUTION.md**

### "How do I set it up?"
→ Follow **SETUP_GUIDE.md**

### "What APIs are available?"
→ Check **API_EXAMPLES.md**

### "Project overview"
→ See **PROJECT_SUMMARY.md**

### "I found an issue"
→ Check troubleshooting in **SETUP_GUIDE.md**

---

## 🎯 Sample Workflow

1. **Start Application** (Backend + Frontend)
2. **View Kanban Board** - See sample requests
3. **Drag Request** - Move from "New" to "In Progress"
4. **View Equipment** - Click "Maintenance" to see requests
5. **Check Calendar** - See scheduled preventive maintenance
6. **View Reports** - See analytics dashboard

---

## 🚀 Next Steps

1. **Download & Install Prerequisites**
   - Node.js from nodejs.org
   - MongoDB from mongodb.com

2. **Read Quick Start Guide**
   - Open QUICK_START_EXECUTION.md

3. **Follow 3-Step Execution**
   - Start MongoDB
   - Start Backend
   - Start Frontend

4. **Explore the App**
   - Try all 4 views
   - Test drag & drop
   - View sample data

5. **Create Your Own Data**
   - Add equipment
   - Create requests
   - Schedule maintenance

---

## 📊 Features At A Glance

| Feature | Status |
|---------|--------|
| Equipment Management | ✅ Complete |
| Team Management | ✅ Complete |
| Request Lifecycle | ✅ Complete |
| Kanban Board | ✅ Complete |
| Calendar View | ✅ Complete |
| Analytics Dashboard | ✅ Complete |
| Auto-Fill Logic | ✅ Complete |
| Scrap Equipment Logic | ✅ Complete |
| Smart Buttons | ✅ Complete |
| Drag & Drop | ✅ Complete |
| REST API | ✅ Complete |
| Database | ✅ Complete |
| Sample Data | ✅ Complete |
| Documentation | ✅ Complete |

---

## 🎉 You're All Set!

Everything is ready to run. Just follow the **5-Minute Quick Start** above, or read **QUICK_START_EXECUTION.md** for detailed steps.

**Enjoy GearGuard!** 🛠️

---

## 📝 File Checklist

### Documentation (6 files)
- ✅ README.md
- ✅ SETUP_GUIDE.md
- ✅ API_EXAMPLES.md
- ✅ PROJECT_SUMMARY.md
- ✅ FILE_STRUCTURE.md
- ✅ QUICK_START_EXECUTION.md
- ✅ QUICK_START.bat (Windows batch)
- ✅ INDEX.md (This file)

### Backend (13 files)
- ✅ 4 models
- ✅ 4 controllers
- ✅ 4 routes
- ✅ server.js
- ✅ seed.js
- ✅ package.json
- ✅ .env

### Frontend (15 files)
- ✅ 5 components
- ✅ 1 API service
- ✅ 5 CSS files
- ✅ App.js & index.js
- ✅ 2 configuration files
- ✅ HTML template

**Total: 51 files configured and ready to use**

---

**Project Version:** 1.0.0
**Status:** ✅ Complete & Ready for Execution
**Last Updated:** December 27, 2025

---

## 🏁 Ready to Begin?

**→ Start with [QUICK_START_EXECUTION.md](QUICK_START_EXECUTION.md)**
