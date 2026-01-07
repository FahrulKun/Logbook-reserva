#!/bin/bash

# Auto-update script for AnyHost
# Place this in /home/username/cron-scripts/update-app.sh

cd /home/username/public_html/komisi-treatment-app

echo "🔄 Starting auto-update..."

# Pull latest changes
git pull origin master

# Install new dependencies if any
npm install

# Build application
npm run build

# Restart application with PM2
pm2 restart komisi-treatment

echo "✅ Auto-update completed at $(date)"

# Log the update
echo "$(date): Auto-update completed" >> /home/username/logs/auto-update.log