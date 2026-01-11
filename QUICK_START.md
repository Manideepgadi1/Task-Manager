# Quick Start Guide for Company Deployment

## For IT Admin / Person Setting This Up

### Step 1: Choose Your Deployment Method

**Easiest (Recommended for 10 users):**
- Use Render.com (free tier available)
- Follow instructions in DEPLOYMENT_GUIDE.md

**If you have a company server:**
- Follow VPS deployment instructions in DEPLOYMENT_GUIDE.md

### Step 2: Set Up Email Notifications

**Option A: Use Gmail (Quick Setup)**
1. Create a new Gmail account for the company (e.g., taskmanager@yourcompany.com)
2. Enable 2-Factor Authentication
3. Generate App Password: https://myaccount.google.com/apppasswords
4. Add credentials to `.env.production`:
   ```
   EMAIL_USER=taskmanager@yourcompany.com
   EMAIL_PASSWORD=your_16_char_app_password
   ```

**Option B: Use SendGrid (Better for production)**
1. Sign up at https://sendgrid.com/ (Free: 100 emails/day)
2. Get API key
3. Add to `.env.production`

### Step 3: Create User Accounts

**Method 1: Use the Script (Recommended)**

1. Edit `backend/scripts/users.csv.example`
   - Add your 10 employee names and emails
   - Save as `users.csv`

2. Install CSV parser:
   ```bash
   cd backend
   npm install csv-parser
   ```

3. Run the import script:
   ```bash
   node scripts/importUsers.js scripts/users.csv
   ```

4. Send welcome emails:
   ```bash
   node scripts/sendWelcomeEmails.js
   ```

**Method 2: Create Users Manually**

1. Edit `backend/scripts/createUsers.js`
   - Replace the dummy user data with your actual employees
   - Change emails to real company emails

2. Run the script:
   ```bash
   cd backend
   node scripts/createUsers.js
   ```

### Step 4: Send Login Details to Your Team

**Email Template for Your Team:**

```
Subject: Access to New Task Manager System

Hi [Name],

Your account has been created for our new Task Manager system!

Login URL: [Your deployed URL]
Email: [Their email]
Temporary Password: Welcome@123

Please log in and change your password immediately.

Features you can use:
- Create and manage tasks
- View calendar
- Collaborate with team
- Track progress
- Get notifications

For help, contact: [Admin email]

Thanks!
```

### Step 5: Test Before Rolling Out

1. Log in as admin
2. Create a test task
3. Assign it to yourself
4. Check if email notifications work
5. Test from different devices (desktop, mobile)

### Step 6: Monitor and Maintain

**Daily:**
- Check for any errors
- Monitor user feedback

**Weekly:**
- Review system usage
- Check database size
- Back up data

**Monthly:**
- Update dependencies
- Review security

---

## For Your 10 Team Members

### How to Access

1. **Check your email** for login credentials
2. **Open the link** provided
3. **Log in** with your email and temporary password
4. **Change your password** immediately
5. **Complete your profile** (add photo, bio, skills)

### Features You Can Use

**Dashboard:**
- See your task overview
- View statistics
- Check notifications

**My Tasks:**
- View all your assigned tasks
- Update task status
- Add notes and comments

**Calendar:**
- See tasks by due date
- Plan your schedule
- View upcoming deadlines

**Team:**
- See other team members
- View their workload
- Collaborate

**Profile:**
- Update personal information
- Change password
- Manage settings

### Getting Help

**Common Issues:**

1. **Can't log in?**
   - Check if Caps Lock is on
   - Make sure you're using the correct email
   - Try password reset

2. **Not receiving notifications?**
   - Check spam folder
   - Verify email settings
   - Contact admin

3. **Task not showing?**
   - Refresh the page
   - Check filters
   - Clear browser cache

**Contact Admin:**
- Email: [Admin email]
- Phone: [Phone number]

---

## Costs Summary

**Free Option (Good for testing):**
- Frontend: Vercel (Free)
- Backend: Render.com (Free)
- Database: ElephantSQL (Free)
- Email: Gmail (Free)
- **Total: $0/month**

**Recommended Option:**
- Frontend: Vercel (Free)
- Backend: Render.com ($7/month)
- Database: Render PostgreSQL ($7/month)
- Email: SendGrid (Free for 100 emails/day)
- **Total: $14/month**

---

## Quick Commands Reference

```bash
# Create users from script
node backend/scripts/createUsers.js

# Import users from CSV
node backend/scripts/importUsers.js backend/scripts/users.csv

# Send welcome emails
node backend/scripts/sendWelcomeEmails.js

# Start application (development)
cd backend && npm start
cd frontend && npm run dev

# Build for production
cd frontend && npm run build

# Start production server
cd backend && npm start
```

---

## Support

For detailed instructions, see:
- `DEPLOYMENT_GUIDE.md` - Complete deployment instructions
- `NEW_FEATURES_SUMMARY.md` - All features documentation

Need help? Create an issue or contact support.
