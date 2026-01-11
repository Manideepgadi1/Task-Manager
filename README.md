# Task Manager Application

A professional, production-ready Task Manager Web Application with Uber-style minimal UI/UX design for managing tasks across a team of 10 employees.

## 🎯 Features

### Admin Features
- **Dashboard Overview**: View total tasks, completed tasks, pending tasks, overdue tasks, and employee-wise task distribution
- **Task Management**: Create, assign, edit, and delete tasks with detailed information
- **Employee Management**: View and manage all 10 employees
- **Real-time Notifications**: Receive alerts when tasks are completed, updated, or overdue
- **Activity Tracking**: Monitor employee performance and task completion rates

### Employee Features
- **Personal Dashboard**: View assigned tasks and personal productivity metrics
- **Task Updates**: Update task status (Pending, In Progress, Completed)
- **Real-time Notifications**: Get notified about new assignments, updates, and deadlines
- **Task Filters**: Search and filter tasks by status and priority

### Key Capabilities
- Role-based access control (Admin & Employee)
- Real-time updates using Socket.io
- Task CRUD operations with validation
- Advanced filtering and search
- Responsive mobile-first design
- Smooth animations and transitions
- Professional Uber-inspired minimal UI

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Framer Motion for animations
- Socket.io Client for real-time updates
- Axios for API calls
- React Hot Toast for notifications

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Socket.io for WebSocket connections
- Express Validator for input validation
- bcryptjs for password hashing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` folder (already created with defaults):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# For Windows (if MongoDB is installed as a service)
net start MongoDB

# For macOS/Linux
mongod
```

### 4. Seed Database (First Time Only)

Populate the database with sample data (1 admin + 10 employees):

```bash
cd backend
npm run seed
```

**Default Login Credentials:**
- **Admin**: admin@company.com / admin123
- **Employee**: john.smith@company.com / password123
- (All employees use password: password123)

### 5. Run the Application

From the root directory:

```bash
# Run both backend and frontend concurrently
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 👥 Default Users

After seeding the database, you'll have:

**1 Admin:**
- Email: admin@company.com
- Password: admin123

**10 Employees:**
1. john.smith@company.com (EMP001)
2. sarah.johnson@company.com (EMP002)
3. michael.brown@company.com (EMP003)
4. emily.davis@company.com (EMP004)
5. david.wilson@company.com (EMP005)
6. jessica.martinez@company.com (EMP006)
7. james.anderson@company.com (EMP007)
8. lisa.taylor@company.com (EMP008)
9. robert.thomas@company.com (EMP009)
10. jennifer.lee@company.com (EMP010)

All employees use password: `password123`

## 📱 Application Structure

```
task-manager-app/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication & validation
│   ├── server.js         # Express server setup
│   └── seedData.js       # Database seeding script
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React Context (Auth, Socket)
│   │   ├── pages/        # Page components
│   │   │   ├── admin/    # Admin-specific pages
│   │   │   └── employee/ # Employee-specific pages
│   │   ├── utils/        # Helper functions
│   │   └── App.jsx       # Main app component
│   └── index.html
└── package.json
```

## 🎨 UI/UX Design Philosophy

- **Minimal & Clean**: Uber-inspired design with neutral colors
- **Smooth Interactions**: Micro-animations and hover effects
- **Mobile-First**: Fully responsive layout
- **Clear Typography**: Easy-to-read fonts and hierarchy
- **Intuitive Navigation**: Simple, clutter-free interface
- **Professional**: Production-ready quality

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Protected API routes
- Input validation and sanitization
- Secure HTTP headers

## 📊 API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user

### Tasks
- GET `/api/tasks` - Get all tasks (filtered by role)
- GET `/api/tasks/stats` - Get task statistics
- POST `/api/tasks` - Create new task (admin only)
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task (admin only)

### Users
- GET `/api/users` - Get all users (admin only)
- GET `/api/users/employees` - Get all employees (admin only)

### Notifications
- GET `/api/notifications` - Get user notifications
- PUT `/api/notifications/:id/read` - Mark as read
- PUT `/api/notifications/read-all` - Mark all as read

## 🔄 Real-time Features

The application uses Socket.io for real-time notifications:
- New task assignments
- Task updates
- Task completions
- Deadline reminders
- Overdue task alerts

## 🚀 Production Deployment

### Build Frontend

```bash
cd frontend
npm run build
```

### Environment Variables for Production

Update `.env` with production values:
- Use strong JWT_SECRET
- Use MongoDB Atlas URI
- Set NODE_ENV=production

## 📝 Usage Tips

### For Admins:
1. Login with admin credentials
2. View dashboard to see team performance
3. Create tasks and assign to employees
4. Monitor task completion and employee productivity
5. Receive real-time notifications on task updates

### For Employees:
1. Login with employee credentials
2. View personal dashboard
3. Update task status as you work
4. Filter and search your tasks
5. Stay updated with real-time notifications

## 🤝 Support

For issues or questions:
- Check the application logs in terminal
- Verify MongoDB is running
- Ensure all dependencies are installed
- Check that ports 5000 and 5173 are available

## 📄 License

MIT License - feel free to use this project for your organization.

---

**Built with ❤️ for productivity and efficiency**
