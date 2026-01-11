#!/bin/bash
set -e

echo "=== TASK MANAGER DEPLOYMENT ==="

# 1. Clone from GitHub
cd /var/www
rm -rf task-manager
git clone https://github.com/Manideepgadi1/Task-Manager.git task-manager
cd task-manager

# 2. Setup Backend
cd backend
npm install
cat > .env << EOF
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskmanager
PORT=8005
EOF

# 3. Setup Database
sudo -u postgres psql << EOF
DROP DATABASE IF EXISTS taskmanager;
CREATE DATABASE taskmanager;
EOF

npx prisma generate
npx prisma db push

# 4. Setup Frontend
cd ../frontend
npm install
npm run build

# 5. Start Backend with PM2
cd ../backend
pm2 delete task-manager-backend 2>/dev/null || true
pm2 start npm --name "task-manager-backend" -- start

# 6. Configure Nginx
cat > /etc/nginx/sites-available/taskmanager << 'EOF'
server {
    listen 80;
    server_name taskmanager.vsfintech.com;

    # Frontend
    location / {
        root /var/www/task-manager/frontend/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8005/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/taskmanager /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

pm2 save

echo "=== DEPLOYMENT COMPLETE ==="
echo "Access at: http://taskmanager.vsfintech.com"
