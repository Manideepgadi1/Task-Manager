# Quick Start Guide - Task Manager Application

## 🚀 Quick Installation (5 Minutes)

Follow these steps to get the application running:

### Step 1: Install All Dependencies
```bash
npm run install-all
```

### Step 2: Start MongoDB
Make sure MongoDB is running on your system.

**Windows:**
```bash
net start MongoDB
```

**macOS/Linux:**
```bash
mongod
```

### Step 3: Seed the Database
```bash
cd backend
npm run seed
cd ..
```

### Step 4: Start the Application
```bash
npm run dev
```

The app will open at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🔑 Test Accounts

**Admin Login:**
- Email: `admin@company.com`
- Password: `admin123`

**Employee Login:**
- Email: `john.smith@company.com`
- Password: `password123`

## ✨ What You Can Do

### As Admin:
1. ✅ Create and assign tasks to employees
2. 📊 View team performance dashboard
3. 👥 Manage 10 employees
4. 🔔 Receive real-time task notifications
5. 📈 Track completion rates and statistics

### As Employee:
1. ✅ View your assigned tasks
2. 🔄 Update task status (Pending → In Progress → Completed)
3. 🔔 Get notified about new tasks and updates
4. 🔍 Search and filter your tasks
5. 📊 See your personal productivity metrics

## 🎨 Features Showcase

- **Real-time Updates**: Socket.io for instant notifications
- **Uber-style UI**: Minimal, clean, professional design
- **Smooth Animations**: Framer Motion for delightful interactions
- **Mobile Responsive**: Works perfectly on all devices
- **Role-based Access**: Separate dashboards for Admin and Employee
- **Task Management**: Full CRUD with priority, due dates, and status tracking

## 🛠️ Troubleshooting

**Port already in use:**
```bash
# Change ports in:
# - backend/.env (PORT=5000)
# - frontend/vite.config.js (port: 5173)
```

**MongoDB connection error:**
- Ensure MongoDB is running
- Check MONGODB_URI in backend/.env

**Dependencies issues:**
```bash
# Delete all node_modules and reinstall
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install-all
```

## 📱 Demo Workflow

1. Login as **Admin** (admin@company.com)
2. Create a new task and assign it to an employee
3. Logout and login as **Employee** (john.smith@company.com)
4. See the new task notification
5. Update task status to "In Progress"
6. Complete the task
7. Logout and login as Admin to see completion notification

## 🎯 Next Steps

- Customize the design in `frontend/tailwind.config.js`
- Add more employees in `backend/seedData.js`
- Configure email notifications
- Deploy to production (Vercel, Heroku, AWS, etc.)

---

**Enjoy your new Task Manager! 🚀**
