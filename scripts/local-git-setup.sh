#!/bin/bash

# VitaPulse Local Git Setup Script
# Run this script on your local machine to set up Git deployment

set -e  # Exit on any error

# Configuration
SERVER_IP="your-server-ip-here"  # Replace with your actual server IP
GIT_USER="git"
PROJECT_NAME="vitapulse"
GIT_REPO="/home/$GIT_USER/$PROJECT_NAME.git"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo "🚀 Setting up VitaPulse Git Deployment (Local Machine)..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    log "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: VitaPulse platform"
fi

# Check if remote already exists
if git remote get-url production >/dev/null 2>&1; then
    log "🔄 Updating existing production remote..."
    git remote set-url production $GIT_USER@$SERVER_IP:$GIT_REPO
else
    log "➕ Adding production remote..."
    git remote add production $GIT_USER@$SERVER_IP:$GIT_REPO
fi

# Set up main branch if it doesn't exist
if ! git branch --list | grep -q "main"; then
    log "🌿 Creating main branch..."
    git branch -M main
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    log "📝 Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Next.js
.next/
out/
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
*.log
logs/

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Temporary files
tmp/
temp/
EOF
fi

# Add all files to git
log "📋 Adding files to Git..."
git add .

# Check if there are changes to commit
if ! git diff --staged --quiet; then
    log "💾 Committing changes..."
    git commit -m "Update: $(date +'%Y-%m-%d %H:%M:%S')"
else
    log "ℹ️ No changes to commit"
fi

# Test SSH connection
log "🔑 Testing SSH connection to server..."
if ssh -o ConnectTimeout=10 -o BatchMode=yes $GIT_USER@$SERVER_IP exit 2>/dev/null; then
    success "✅ SSH connection successful"
else
    error "❌ SSH connection failed. Please ensure:"
    echo "   1. Your SSH key is added to the server"
    echo "   2. The server IP is correct: $SERVER_IP"
    echo "   3. The git user exists on the server"
    echo ""
    echo "To add your SSH key to the server, run:"
    echo "   ssh-copy-id $GIT_USER@$SERVER_IP"
    echo "   OR"
    echo "   cat ~/.ssh/id_rsa.pub | ssh $GIT_USER@$SERVER_IP 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys'"
    exit 1
fi

# Deploy to server
log "🚀 Deploying to server..."
git push production main

success "🎉 Deployment completed successfully!"

echo ""
echo "📋 Deployment Summary:"
echo "   Server: $SERVER_IP"
echo "   Repository: $GIT_REPO"
echo "   Web Root: /var/www/vitapulse.fit/public_html"
echo "   Remote: production"
echo ""
echo "🔧 Useful Commands:"
echo "   Deploy: git push production main"
echo "   Check status: ssh $GIT_USER@$SERVER_IP 'pm2 status'"
echo "   View logs: ssh $GIT_USER@$SERVER_IP 'pm2 logs vitapulse'"
echo "   Restart app: ssh $GIT_USER@$SERVER_IP 'pm2 restart vitapulse'"
echo ""
echo "🌐 Your app should be available at: http://$SERVER_IP:3000"
