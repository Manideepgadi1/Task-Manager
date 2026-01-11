#!/bin/bash
cd /var/www/task-manager/backend

# Create .env
cat > .env << 'EOF'
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskmanager
PORT=8005
EOF

# Setup database
psql -U postgres -c "DROP DATABASE IF EXISTS taskmanager;"
psql -U postgres -c "CREATE DATABASE taskmanager;"

# Run Prisma
npx prisma generate
npx prisma db push

# Restart backend
pm2 restart task-manager-backend

echo "✅ Task Manager database setup complete!"
