#!/bin/bash

# Deployment Script for AnyHost
# Usage: ./deploy.sh

echo "🚀 Starting deployment to AnyHost..."

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Create deployment package
echo "📁 Creating deployment package..."
mkdir -p deploy
cp -r .next deploy/
cp -r public deploy/
cp package.json deploy/
cp package-lock.json deploy/
cp server.js deploy/
cp .htaccess deploy/

echo "✅ Deployment package created in 'deploy' folder!"

# Instructions for manual upload
echo ""
echo "📋 Manual Deployment Instructions:"
echo "1. Compress the 'deploy' folder"
echo "2. Upload to AnyHost via File Manager"
echo "3. Extract in your hosting directory"
echo "4. Run 'npm install' in SSH terminal"
echo "5. Run 'npm start' to start the application"
echo ""
echo "🌐 Your app will be available at your domain!"
echo ""
echo "🔧 For automatic deployment, use AnyHost's Git integration:"