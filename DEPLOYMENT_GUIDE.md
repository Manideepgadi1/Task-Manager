# Deployment Guide - Task Manager Pro

## Overview
This guide will help you deploy the Task Manager application for your company with ~10 members.

---

## Option 1: Quick Cloud Deployment (Recommended for Small Teams)

### Using Render.com (Free/Paid)

#### **Step 1: Prepare Your Code**

1. Create a `.env.production` file in the backend folder:
```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key_here_make_it_long_and_random
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.onrender.com

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-company-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Task Manager <your-company-email@gmail.com>
```

#### **Step 2: Deploy PostgreSQL Database**

**Option A: Render.com PostgreSQL (Recommended)**
1. Go to https://render.com
2. Create account → New → PostgreSQL
3. Name: `taskmanager-db`
4. Choose free tier or paid based on needs
5. Copy the **External Database URL**

**Option B: ElephantSQL (Free tier available)**
1. Go to https://www.elephantsql.com/
2. Create account → Create New Instance
3. Choose "Tiny Turtle" (Free)
4. Copy the database URL

**Option C: Supabase (Free tier with good features)**
1. Go to https://supabase.com/
2. Create project
3. Get PostgreSQL connection string from Settings → Database

#### **Step 3: Deploy Backend**

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to Render Dashboard → New → Web Service
   - Connect your GitHub repository
   - Settings:
     - Name: `taskmanager-backend`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Add Environment Variables from `.env.production`

#### **Step 4: Deploy Frontend**

1. **Update frontend API URL:**
   - In `frontend/src/utils/api.js`, update the base URL to your backend URL

2. **Deploy on Render/Vercel/Netlify:**
   
   **Render:**
   - New → Static Site
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

   **Vercel (Recommended for frontend):**
   ```bash
   npm install -g vercel
   cd frontend
   vercel
   ```

   **Netlify:**
   ```bash
   npm install -g netlify-cli
   cd frontend
   npm run build
   netlify deploy --prod
   ```

---

## Option 2: Company Server/VPS Deployment

### Using DigitalOcean, AWS, or Azure

#### **Step 1: Set Up Server**

1. **Create VPS/Droplet** (DigitalOcean example):
   - Ubuntu 22.04 LTS
   - Minimum: 2GB RAM, 1 CPU (for 10 users)
   - Recommended: 4GB RAM, 2 CPUs

2. **Connect to server:**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install required software:**
   ```bash
   # Update system
   apt update && apt upgrade -y

   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt install -y nodejs

   # Install PostgreSQL
   apt install -y postgresql postgresql-contrib

   # Install Nginx
   apt install -y nginx

   # Install PM2 (process manager)
   npm install -g pm2

   # Install Git
   apt install -y git
   ```

#### **Step 2: Set Up Database**

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE taskmanager;
CREATE USER taskmanager_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE taskmanager TO taskmanager_user;
\q
```

#### **Step 3: Deploy Application**

```bash
# Create app directory
mkdir -p /var/www/taskmanager
cd /var/www/taskmanager

# Clone your repository
git clone your-repo-url .

# Set up backend
cd backend
npm install --production
cp .env.example .env
# Edit .env with your production settings
nano .env

# Run database migrations
npm run migrate  # or appropriate command

# Start with PM2
pm2 start server.js --name taskmanager-backend
pm2 save
pm2 startup

# Set up frontend
cd ../frontend
npm install
npm run build
```

#### **Step 4: Configure Nginx**

```bash
nano /etc/nginx/sites-available/taskmanager
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/taskmanager/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/taskmanager /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### **Step 5: Set Up SSL (HTTPS)**

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

---

## User Management & Initial Setup

### Creating Admin Account

**Option 1: Via Database**
```sql
-- Connect to database
psql -d taskmanager

-- Create admin user
INSERT INTO users (name, email, password, role, "employeeId", "isActive")
VALUES (
    'Admin Name',
    'admin@yourcompany.com',
    '$2a$10$hashed_password_here',  -- Use bcrypt hash
    'admin',
    'ADMIN001',
    true
);
```

**Option 2: Via Backend Script**

I'll create a user creation script for you.

### Adding 10 Company Members

You have two options:

**Option A: Manual Registration Page** (I can create this)
- Create a one-time registration page
- Share link with employees
- They create their own accounts
- Admin approves/activates them

**Option B: Bulk Import Script** (I can create this)
- Prepare CSV file with employee data
- Run import script
- Send welcome emails with temporary passwords

---

## Email Setup

### Using Gmail (Easy Setup)

1. **Enable 2-Factor Authentication** on your Gmail account

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other"
   - Generate password
   - Copy the 16-character password

3. **Add to .env:**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your_16_char_app_password
   EMAIL_FROM=Task Manager <your-email@gmail.com>
   ```

### Using SendGrid (Recommended for Production)

1. **Sign up:** https://sendgrid.com/ (Free: 100 emails/day)
2. **Get API Key:** Settings → API Keys → Create
3. **Add to .env:**
   ```env
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=your_api_key
   EMAIL_FROM=your-email@yourcompany.com
   ```

### Using AWS SES (Best for Large Scale)

1. **Sign up for AWS SES**
2. **Verify your domain**
3. **Get credentials**
4. **Add to .env:**
   ```env
   EMAIL_PROVIDER=aws-ses
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   AWS_REGION=us-east-1
   EMAIL_FROM=notifications@yourcompany.com
   ```

---

## Data Backup Strategy

### Automated Database Backups

**Option 1: Render.com** (if using their PostgreSQL)
- Automatic daily backups included
- Can download backups anytime

**Option 2: Manual Backup Script**

Create `/scripts/backup.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/taskmanager"
mkdir -p $BACKUP_DIR

# Backup database
pg_dump taskmanager > $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/db_backup_$DATE.sql"
```

Add to crontab (daily at 2 AM):
```bash
0 2 * * * /scripts/backup.sh
```

---

## Cost Estimates

### Small Team (10 users) - Budget Options

**Option 1: Free Tier**
- Frontend: Vercel (Free)
- Backend: Render.com (Free)
- Database: ElephantSQL (Free - 20MB)
- **Total: $0/month**
- Limitations: Limited database size, slower performance

**Option 2: Starter Plan**
- Frontend: Vercel (Free)
- Backend: Render.com ($7/month)
- Database: Render PostgreSQL ($7/month)
- Email: SendGrid (Free - 100/day)
- **Total: $14/month**

**Option 3: VPS (More Control)**
- DigitalOcean Droplet ($12/month)
- Managed Database ($15/month)
- **Total: $27/month**

**Option 4: Company Server**
- Use existing company infrastructure
- **Total: $0/month** (just maintenance)

---

## Security Checklist

- ✅ Use HTTPS (SSL certificate)
- ✅ Strong JWT_SECRET (random 64+ characters)
- ✅ Secure database password
- ✅ Environment variables (never commit .env)
- ✅ Regular backups
- ✅ Update dependencies regularly
- ✅ Set up firewall rules
- ✅ Monitor logs
- ✅ Rate limiting on API endpoints
- ✅ Input validation

---

## Next Steps

1. **Choose deployment option** (Cloud vs Company Server)
2. **Set up database**
3. **Configure email service**
4. **Deploy application**
5. **Create admin account**
6. **Add employee accounts**
7. **Test with small group**
8. **Roll out to all 10 members**

---

## Support & Maintenance

### Weekly Tasks:
- Check application logs
- Monitor database size
- Review error reports

### Monthly Tasks:
- Update dependencies
- Review security patches
- Check backup integrity

### As Needed:
- Add/remove users
- Adjust settings
- Scale resources

---

## Need Help?

I can help you with:
1. Creating user registration/import scripts
2. Setting up email templates
3. Configuring specific deployment platforms
4. Writing backup/maintenance scripts
5. Creating admin utilities

Let me know which deployment option you prefer and I'll provide detailed step-by-step instructions!
