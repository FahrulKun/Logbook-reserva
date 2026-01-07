#!/bin/bash

# Create GitHub Repository Script
# Usage: ./create-github-repo.sh

echo "🚀 Creating GitHub repository for Komisi Treatment App..."

REPO_NAME="komisi-treatment-app"
REPO_DESCRIPTION="Aplikasi pencatatan komisi treatment therapist dengan fitur PWA (Progressive Web App)"
REPO_VISIBILITY="public"

# Check if GitHub CLI is available
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not found. Please install GitHub CLI:"
    echo "   npm install -g @github/cli"
    echo "   Or download from: https://cli.github.com/"
    exit 1
fi

# Create repository
echo "📁 Creating repository: $REPO_NAME"
gh repo create "$REPO_NAME" --description "$REPO_DESCRIPTION" --public --clone=false

if [ $? -eq 0 ]; then
    echo "✅ Repository created successfully!"
    echo "🔗 Repository URL: https://github.com/$(gh config get user.login)/$REPO_NAME"
    
    # Add remote origin
    cd "$REPO_NAME" || exit 1
    git remote add origin "git@github.com:$(gh config get user.login)/$REPO_NAME.git"
    
    echo "📤 Pushing code to GitHub..."
    git add .
    git commit -m "Initial commit: Add Komisi Treatment PWA application

- Complete Next.js application with PWA support
- 35 treatment options with pricing
- Real-time WIB clock and date management
- Offline functionality with service worker
- Responsive design for all devices
- PWA icons and splash screens
- Instagram integration for OREA_85

📱 Developer: OREA 85
🌐 Repository: https://github.com/$(gh config get user.login)/$REPO_NAME"

📋 Features:
📝 Manajemen komisi treatment dengan real-time tracking
📊 Dashboard analytics dan export data
📱 PWA installable dengan offline support
📱 Responsive design untuk semua device
📱 35+ treatment options dengan harga kompetitif
📱 WhatsApp dan Telegram sharing
📱 WIB timezone support (GMT+7)
📱 Cache-first performance strategy
📱 Modern UI dengan Tailwind CSS dan shadcn/ui

🔧 Ready for deployment to Vercel, Netlify, atau hosting lainnya"