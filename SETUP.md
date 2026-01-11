# 🎯 Task Manager Application - Complete Setup Guide

## 📦 Project Overview

A full-stack, production-ready Task Manager application with:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React + Vite + Tailwind CSS
- **Real-time**: Socket.io for notifications
- **Design**: Uber-inspired minimal UI/UX

---

## 🎬 Quick Start (Fastest Way)

### Option 1: Automated Installation (Recommended)

**Windows:**
```bash
.\install.bat
```

**macOS/Linux:**
```bash
chmod +x install.sh
./install.sh
```

### Option 2: Manual Installation

```bash
# Install all dependencies at once
npm run install-all

# Or install individually
npm install
cd backend && npm install
cd ../frontend && npm install
```

---

## 🗄️ Database Setup

### 1. Start MongoDB

**Windows (MongoDB as Service):**
```powershell
net start MongoDB
```

**Windows (Manual):**
```powershell
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```

**macOS (Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 2. Seed Database with Sample Data

```bash
cd backend
npm run seed
```

**This creates:**
- 1 Admin account
- 10 Employee accounts
- 10 Sample tasks
- Sample notifications

---

## 🚀 Running the Application

### Method 1: Run Everything Together (Recommended)

```bash
npm run dev
```

This starts:
- Backend server on `http://localhost:5000`
- Frontend dev server on `http://localhost:5173`

### Method 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 👤 Login Credentials

### Admin Account
```
Email: admin@company.com
Password: admin123
```

**Admin Capabilities:**
- Create, edit, delete tasks
- Assign tasks to any employee
- View all employee performance
- Manage team dashboard
- Receive task completion notifications

### Employee Accounts

All employees use password: `password123`

| Name | Email | Employee ID |
|------|-------|-------------|
| John Smith | john.smith@company.com | EMP001 |
| Sarah Johnson | sarah.johnson@company.com | EMP002 |
| Michael Brown | michael.brown@company.com | EMP003 |
| Emily Davis | emily.davis@company.com | EMP004 |
| David Wilson | david.wilson@company.com | EMP005 |
| Jessica Martinez | jessica.martinez@company.com | EMP006 |
| James Anderson | james.anderson@company.com | EMP007 |
| Lisa Taylor | lisa.taylor@company.com | EMP008 |
| Robert Thomas | robert.thomas@company.com | EMP009 |
| Jennifer Lee | jennifer.lee@company.com | EMP010 |

**Employee Capabilities:**
- View assigned tasks
- Update task status
- Receive task notifications
- Personal dashboard

---

## 🧪 Testing the Application

### Complete Test Workflow:

1. **Login as Admin**
   ```
   Email: admin@company.com
   Password: admin123
   ```

2. **Create a Task**
   - Click "Create Task" button
   - Fill in task details
   - Assign to an employee (e.g., John Smith)
   - Set priority and due date
   - Save

3. **Check Admin Dashboard**
   - View task statistics
   - See employee performance
   - Monitor recent activities

4. **Logout and Login as Employee**
   ```
   Email: john.smith@company.com
   Password: password123
   ```

5. **View Assigned Task**
   - See the new task notification
   - Click on the task
   - Update status to "In Progress"

6. **Complete the Task**
   - Change status to "Completed"
   - Save

7. **Login as Admin Again**
   - See task completion notification
   - View updated statistics

---

## 📂 Project Structure

```
task-manager-app/
│
├── backend/                    # Node.js + Express backend
│   ├── models/                # MongoDB schemas
│   │   ├── User.js           # User model (Admin/Employee)
│   │   ├── Task.js           # Task model
│   │   └── Notification.js   # Notification model
│   │
│   ├── routes/               # API endpoints
│   │   ├── auth.js          # Authentication routes
│   │   ├── tasks.js         # Task CRUD routes
│   │   ├── users.js         # User management routes
│   │   └── notifications.js # Notification routes
│   │
│   ├── middleware/          # Express middleware
│   │   └── auth.js         # JWT authentication
│   │
│   ├── server.js           # Express server setup
│   ├── seedData.js        # Database seeding script
│   └── package.json       # Backend dependencies
│
├── frontend/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── StatCard.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskModal.jsx
│   │   │   └── PrivateRoute.jsx
│   │   │
│   │   ├── context/         # React Context
│   │   │   ├── AuthContext.jsx    # Authentication state
│   │   │   └── SocketContext.jsx  # Socket.io connection
│   │   │
│   │   ├── pages/          # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminOverview.jsx
│   │   │   │   ├── AdminTasks.jsx
│   │   │   │   └── AdminEmployees.jsx
│   │   │   └── employee/
│   │   │       ├── EmployeeOverview.jsx
│   │   │       └── EmployeeTasks.jsx
│   │   │
│   │   ├── utils/          # Helper functions
│   │   │   ├── api.js     # Axios configuration
│   │   │   ├── socket.js  # Socket.io setup
│   │   │   └── helpers.js # Utility functions
│   │   │
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   │
│   └── package.json       # Frontend dependencies
│
├── package.json           # Root package.json
├── README.md             # Full documentation
├── QUICKSTART.md         # Quick start guide
└── SETUP.md             # This file
```

---

## 🔧 Configuration

### Backend Configuration (`backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

### Frontend Configuration (`frontend/vite.config.js`)

The frontend automatically proxies API calls to `http://localhost:5000`.

---

## 🎨 UI/UX Features

### Design System
- **Colors**: Black, white, gray with subtle blue accent
- **Typography**: Inter font family
- **Spacing**: Consistent 4px grid system
- **Shadows**: Soft, medium, large variants
- **Animations**: Smooth transitions and micro-interactions

### Components
- Clean cards with hover effects
- Rounded buttons with state feedback
- Status badges (pending, in-progress, completed)
- Priority badges (low, medium, high)
- Toast notifications
- Loading states
- Empty states

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control
- ✅ Protected API routes
- ✅ Input validation
- ✅ CORS configuration
- ✅ Secure HTTP headers

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

### Tasks
- `GET /api/tasks` - Get tasks (filtered by role)
- `GET /api/tasks/stats` - Get statistics
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task (admin only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/employees` - Get employees (admin only)
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

---

## 🔄 Real-time Features

Socket.io events:
- `join` - User joins their room
- `notification` - Receive real-time notifications

Notification types:
- 📝 Task assigned
- ✏️ Task updated
- ✅ Task completed
- ⏰ Deadline reminder
- 🚨 Task overdue

---

## 🐛 Troubleshooting

### Port Already in Use

**Backend (Port 5000):**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill
```

**Frontend (Port 5173):**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5173 | xargs kill
```

### MongoDB Connection Error

1. Check if MongoDB is running:
```bash
# Windows
sc query MongoDB

# macOS/Linux
sudo systemctl status mongod
```

2. Verify connection string in `backend/.env`

3. Try connecting with MongoDB Compass

### Dependencies Issues

```bash
# Clear everything and reinstall
rm -rf node_modules backend/node_modules frontend/node_modules
rm -rf package-lock.json backend/package-lock.json frontend/package-lock.json
npm run install-all
```

### Real-time Notifications Not Working

1. Check browser console for Socket.io errors
2. Verify backend is running on port 5000
3. Check Socket.io connection in Network tab
4. Ensure CORS is properly configured

---

## 🚀 Production Deployment

### Build Frontend

```bash
cd frontend
npm run build
```

This creates optimized files in `frontend/dist/`

### Production Environment Variables

Update `backend/.env`:
```env
NODE_ENV=production
JWT_SECRET=<strong-random-secret>
MONGODB_URI=<mongodb-atlas-connection-string>
PORT=5000
```

### Deployment Options

- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Heroku, Railway, AWS, DigitalOcean
- **Database**: MongoDB Atlas

---

## 📊 Database Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'employee',
  employeeId: String,
  isActive: Boolean,
  timestamps: true
}
```

### Task Schema
```javascript
{
  title: String,
  description: String,
  assignedTo: ObjectId (User),
  assignedBy: ObjectId (User),
  priority: 'Low' | 'Medium' | 'High',
  status: 'Pending' | 'In Progress' | 'Completed',
  dueDate: Date,
  completedAt: Date,
  timestamps: true
}
```

### Notification Schema
```javascript
{
  userId: ObjectId (User),
  type: String,
  title: String,
  message: String,
  taskId: ObjectId (Task),
  isRead: Boolean,
  timestamps: true
}
```

---

## 📈 Performance Optimization

- ✅ Database indexing on frequently queried fields
- ✅ API response caching
- ✅ Lazy loading of components
- ✅ Code splitting in React
- ✅ Optimized images and assets
- ✅ Gzip compression
- ✅ CDN for static assets (production)

---

## 🎯 Best Practices Implemented

- Clean code architecture
- Modular component structure
- Error handling and validation
- Loading and empty states
- Responsive design
- Accessibility considerations
- Security best practices
- Git-friendly structure
- Comprehensive documentation

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

## 💡 Tips & Tricks

1. **Quick Test**: Use demo credentials buttons on login page
2. **Filter Tasks**: Use search and filters to find specific tasks
3. **Real-time**: Keep two browser windows open (admin + employee) to see real-time updates
4. **Mobile**: Open on your phone using your computer's IP address
5. **Customize**: Modify colors in `tailwind.config.js`

---

## 🎉 You're All Set!

The application is ready to use. If you encounter any issues, refer to the Troubleshooting section or check the detailed README.md.

**Happy Task Managing! 🚀**
