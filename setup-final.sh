#!/bin/bash
set -e

cd /var/www/task-manager/backend

# Create .env
cat > .env << 'EOF'
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskmanager
JWT_SECRET=vsfintech_task_manager_secret_key_2026_production_secure_random_string_123456789
PORT=8005
NODE_ENV=production
FRONTEND_URL=http://taskmanager.vsfintech.com
EOF

# Create database
psql -U postgres -h localhost << 'EOSQL'
DROP DATABASE IF EXISTS taskmanager;
CREATE DATABASE taskmanager;
EOSQL

# Restart backend (it will auto-create tables via Sequelize)
pm2 restart task-manager-backend
pm2 save

echo "✅ Task Manager backend configured and restarted!"
echo "Backend running on port 8005"
