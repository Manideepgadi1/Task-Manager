# 🚀 Complete Setup Guide for Your Company (10 Members)

## Overview
This guide will help you deploy the Task Manager application for your company with email notifications and user management.

---

## 📋 What You Have Now

✅ Full-featured Task Manager application
✅ Admin and Employee dashboards
✅ User management scripts
✅ Email notification system
✅ CSV import capability
✅ Automated welcome emails

---

## 🎯 Three Deployment Options

### Option 1: Cloud Deployment (Easiest) - **RECOMMENDED**

**Cost: FREE to $14/month**
**Time: 30-60 minutes**
**Best for: Quick setup, no server management**

**Steps:**

1. **Deploy Database** (5 min)
   - Sign up at https://render.com
   - Click "New +" → "PostgreSQL"
   - Name: `taskmanager-db`
   - Copy the **External Database URL**

2. **Deploy Backend** (10 min)
   - Push code to GitHub
   - On Render: "New +" → "Web Service"
   - Connect GitHub repo
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables (see below)

3. **Deploy Frontend** (10 min)
   - On Render: "New +" → "Static Site"
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

**Environment Variables for Backend:**
```
DATABASE_URL=<your-render-database-url>
JWT_SECRET=<generate-long-random-string>
NODE_ENV=production
FRONTEND_URL=<your-frontend-url>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your-gmail>
EMAIL_PASSWORD=<your-app-password>
EMAIL_FROM=Task Manager <your-gmail>
```

---

### Option 2: Company Server/VPS

**Cost: $12-50/month**
**Time: 1-2 hours**
**Best for: More control, better performance**

See detailed instructions in `DEPLOYMENT_GUIDE.md`

---

### Option 3: Local Testing First

**Cost: FREE**
**Time: 5 minutes**
**Best for: Testing before deployment**

You're already running this locally! Just follow the user setup below.

---

## 📧 Email Setup (Critical for Notifications)

### Using Gmail (Easiest)

1. **Create/Use Gmail Account**
   - Use existing company Gmail or create new one
   - Example: `taskmanager@yourcompany.com`

2. **Enable 2-Factor Authentication**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

3. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Task Manager"
   - Click "Generate"
   - **Copy the 16-character password**

4. **Add to Backend .env**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your_16_char_password_here
   EMAIL_FROM=Task Manager <your-email@gmail.com>
   ```

5. **Test it**
   ```bash
   cd backend
   node scripts/sendWelcomeEmails.js
   ```

---

## 👥 Setting Up Your 10 Company Members

### Method 1: Using CSV Import (Recommended)

1. **Create your user list**
   - Copy `backend/scripts/users.csv.example` to `users.csv`
   - Edit with your real employee data:
   ```csv
   name,email,employeeId,role
   Admin Name,admin@company.com,ADMIN001,admin
   John Doe,john@company.com,EMP001,employee
   Jane Smith,jane@company.com,EMP002,employee
   ...add 8 more employees
   ```

2. **Import users**
   ```bash
   cd backend
   npm run import-users scripts/users.csv
   ```

3. **Send welcome emails**
   ```bash
   npm run send-welcome-emails
   ```

### Method 2: Using JavaScript Script

1. **Edit the script**
   - Open `backend/scripts/createUsers.js`
   - Replace dummy data with your real employees
   - Update names, emails, and employee IDs

2. **Run the script**
   ```bash
   cd backend
   npm run create-users
   ```

3. **Send welcome emails**
   ```bash
   npm run send-welcome-emails
   ```

### Method 3: Manual Creation via API

Use tools like Postman or curl:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Employee Name",
    "email": "employee@company.com",
    "password": "Welcome@123",
    "employeeId": "EMP001",
    "role": "employee"
  }'
```

---

## 📬 Sending Login Details to Your Team

### Option 1: Automated Email (Best)

The `sendWelcomeEmails.js` script sends a beautiful HTML email with:
- Login credentials
- Direct login link
- Getting started guide
- Security instructions

### Option 2: Manual Email Template

```
Subject: Access to Task Manager System

Hi [Name],

Your account is ready for the new Task Manager system!

🔐 Login Details:
- URL: [Your-App-URL]
- Email: [Their-Email]
- Temporary Password: Welcome@123
- Employee ID: [Their-ID]

⚠️ Please change your password after first login!

📚 Quick Start:
1. Log in with your credentials
2. Complete your profile
3. Explore the dashboard
4. Start managing tasks!

Need help? Contact: [Admin-Email]

Best regards,
IT Team
```

---

## 🔧 Post-Deployment Checklist

### Immediate (Day 1)
- [ ] Deploy application (choose option above)
- [ ] Set up email notifications
- [ ] Create admin account
- [ ] Test login as admin
- [ ] Create test task
- [ ] Verify email notifications work
- [ ] Import all 10 user accounts
- [ ] Send welcome emails

### Within First Week
- [ ] Have each user log in and change password
- [ ] Verify all users can access their dashboard
- [ ] Create initial tasks for testing
- [ ] Train users on key features
- [ ] Set up backup schedule

### Ongoing
- [ ] Monitor daily for issues
- [ ] Back up database weekly
- [ ] Update dependencies monthly
- [ ] Review security quarterly

---

## 💰 Cost Breakdown

### FREE Option (Good for Testing)
- Render.com Free tier
- Gmail (existing account)
- **Total: $0/month**
- **Limits:** 
  - Backend sleeps after inactivity
  - Limited database (256MB)
  - Good for initial testing

### Starter Plan (Recommended)
- Render.com Starter: $7/month
- Render PostgreSQL: $7/month
- Gmail: Free
- **Total: $14/month**
- **Benefits:**
  - Always on
  - Better performance
  - More database space (10GB)
  - SSL included

### Professional Plan
- Render.com Standard: $25/month
- Managed Database: $20/month
- SendGrid Pro: $0-15/month
- **Total: $45-60/month**
- **Benefits:**
  - High performance
  - More resources
  - Better email deliverability
  - Priority support

---

## 🆘 Common Issues & Solutions

### Issue: Users can't log in
**Solutions:**
- Verify email is correct (case-sensitive)
- Check if account is active
- Try password reset
- Check if backend is running

### Issue: No email notifications
**Solutions:**
- Check spam folder
- Verify EMAIL_USER and EMAIL_PASSWORD in .env
- Test with: `node scripts/sendWelcomeEmails.js`
- Check Gmail "Less secure apps" settings
- Verify App Password is correct (not regular password)

### Issue: "Connection refused" error
**Solutions:**
- Check if backend server is running
- Verify PORT matches in frontend and backend
- Check firewall settings
- Verify DATABASE_URL is correct

### Issue: Database connection error
**Solutions:**
- Check DATABASE_URL format
- Verify database is running
- Check credentials
- Test connection: `psql <DATABASE_URL>`

---

## 📊 Monitoring Your System

### Daily Checks (5 minutes)
- Open the app and verify it loads
- Check if users can log in
- Review any error reports

### Weekly Reviews (15 minutes)
- Check database size
- Review active users
- Monitor task completion rates
- Check email logs

### Monthly Maintenance (30 minutes)
- Update npm dependencies
- Review security patches
- Export data backup
- Check performance metrics

---

## 🎓 Training Your Team

### For Admins (30 minutes)
1. Dashboard overview
2. Creating and assigning tasks
3. Managing employees
4. Viewing reports and analytics
5. System settings

### For Employees (15 minutes)
1. Logging in and profile setup
2. Viewing assigned tasks
3. Updating task status
4. Using calendar view
5. Team collaboration features

**Quick Video Script Ideas:**
1. "Getting Started" (5 min)
2. "Creating Your First Task" (3 min)
3. "Managing Your Dashboard" (5 min)
4. "Team Collaboration" (4 min)

---

## 📞 Getting Support

### For Your Team
- Admin Email: [your-admin-email]
- Documentation: Check the app's help section
- Common Issues: See troubleshooting guide above

### For Deployment Help
- Render.com Docs: https://render.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Nodemailer Docs: https://nodemailer.com/

---

## 🎉 Quick Start Commands

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Set up environment
cp backend/.env.example backend/.env
# Edit backend/.env with your settings

# Create users
cd backend
npm run create-users

# Send welcome emails
npm run send-welcome-emails

# Start servers (development)
# Terminal 1:
cd backend && npm start

# Terminal 2:
cd frontend && npm run dev

# Access at: http://localhost:5173
```

---

## ✅ Success Criteria

Your deployment is successful when:
- [ ] All 10 users can log in
- [ ] Admin can create and assign tasks
- [ ] Employees receive email notifications
- [ ] Tasks show up in calendar view
- [ ] Mobile access works
- [ ] Data persists after restart
- [ ] Backups are automated

---

## 🚀 Next Steps After Deployment

1. **Week 1:** Get everyone logged in and familiar
2. **Week 2:** Start using for real tasks
3. **Week 3:** Gather feedback and adjust
4. **Month 1:** Review usage and optimize
5. **Ongoing:** Regular updates and improvements

---

## 📝 Quick Reference

**Default Admin Login:**
- Email: admin@yourcompany.com
- Password: (Set during user creation)

**Default Employee Login:**
- Email: employee@yourcompany.com
- Password: Welcome@123 (Change immediately!)

**Important URLs:**
- Frontend: http://localhost:5173 (dev) or your deployed URL
- Backend: http://localhost:5000 (dev) or your deployed URL
- Database: Check your .env file

**Support Docs:**
- `DEPLOYMENT_GUIDE.md` - Detailed deployment
- `QUICK_START.md` - Quick reference
- `NEW_FEATURES_SUMMARY.md` - Feature documentation

---

Need help? You have everything you need in this folder to get started! 🎉
