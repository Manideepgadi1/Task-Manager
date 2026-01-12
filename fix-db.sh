#!/bin/bash
cd /var/www/task-manager/backend

cat > .env << 'EOF'
PORT=8005
DB_NAME=taskmanager
DB_USER=postgres
DB_PASSWORD=VSFintech2026
DB_HOST=127.0.0.1
DB_PORT=5432
JWT_SECRET=vsfintech_task_manager_2026_production
NODE_ENV=production
EMAIL_DEMO_MODE=false
EMAIL_FROM=VS Task Manager <vsfintech@gmail.com>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=vsfintech@gmail.com
EMAIL_PASSWORD=gluzofcihcnkiwmn
EOF

echo "ALTER USER postgres WITH PASSWORD 'VSFintech2026';" | sudo -u postgres psql

pm2 restart task-manager-backend

echo "✅ Database configured!"
