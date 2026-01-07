#!/bin/bash

# Deploy Script untuk AnyHost cPanel
# Catatan Harian Komisi Treatment OREA 85

echo "🚀 Starting deployment..."

# Navigate to public_html
cd public_html

# Remove old folder if exists
rm -rf komisi-temp

# Clone repository
echo "📥 Cloning repository..."
git clone https://github.com/FahrulKun/Logbook-new.git komisi-temp

# Copy static files
echo "📁 Copying static files..."
mkdir -p komisi
cp -r komisi-temp/ready-for-upload/* komisi/

# Set permissions
echo "🔐 Setting permissions..."
chmod -R 755 komisi
find komisi -type f -exec chmod 644 {} \;

# Cleanup
echo "🧹 Cleaning up..."
rm -rf komisi-temp

echo "✅ Deployment complete!"
echo "🌐 Access your app at: https://$(basename $PWD)/komisi/"