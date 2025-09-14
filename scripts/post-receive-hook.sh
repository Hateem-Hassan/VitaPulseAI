#!/bin/bash

# VitaPulse Post-Receive Hook
# This script runs after code is pushed to the repository

set -e  # Exit on any error

# Configuration
PROJECT_NAME="vitapulse"
GIT_USER="git"
WEB_USER="www-data"
WEB_ROOT="/var/www/vitapulse.fit/public_html"
BACKUP_DIR="/home/$GIT_USER/backups"
TEMP_DIR="/tmp/vitapulse-deploy-$$"
NODE_VERSION="18"
PM2_APP_NAME="vitapulse"

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

# Start deployment
log "🚀 Starting VitaPulse deployment..."

# Read the ref that was pushed
while read oldrev newrev ref; do
    if [[ $ref =~ .*/main$ ]]; then
        log "📥 Received push to main branch"
        
        # Create backup of current deployment
        if [ -d "$WEB_ROOT" ] && [ "$(ls -A $WEB_ROOT)" ]; then
            log "💾 Creating backup..."
            BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
            sudo -u $GIT_USER mkdir -p $BACKUP_DIR/$BACKUP_NAME
            sudo cp -r $WEB_ROOT/* $BACKUP_DIR/$BACKUP_NAME/ 2>/dev/null || true
            log "✅ Backup created: $BACKUP_NAME"
        fi
        
        # Create temporary directory for deployment
        log "📁 Creating temporary deployment directory..."
        sudo -u $GIT_USER mkdir -p $TEMP_DIR
        cd $TEMP_DIR
        
        # Clone the repository
        log "📦 Cloning repository..."
        sudo -u $GIT_USER git clone /home/$GIT_USER/vitapulse.git .
        
        # Set up Node.js environment
        log "🔧 Setting up Node.js environment..."
        
        # Check if Node.js is installed
        if ! command -v node &> /dev/null; then
            log "📥 Installing Node.js..."
            curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
            sudo apt-get install -y nodejs
        fi
        
        # Check Node.js version
        NODE_CURRENT=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_CURRENT" -lt "$NODE_VERSION" ]; then
            warning "Node.js version $NODE_CURRENT is below required $NODE_VERSION"
        fi
        
        # Install dependencies
        log "📦 Installing dependencies..."
        sudo -u $GIT_USER npm ci --silent
        
        # Build the application
        log "🔨 Building application..."
        sudo -u $GIT_USER npm run build
        
        # Stop PM2 process if running
        if command -v pm2 &> /dev/null; then
            log "⏹️ Stopping PM2 process..."
            sudo -u $GIT_USER pm2 stop $PM2_APP_NAME 2>/dev/null || true
        fi
        
        # Clear web root
        log "🧹 Clearing web root..."
        sudo rm -rf $WEB_ROOT/*
        
        # Copy built files
        log "📋 Copying built files..."
        sudo cp -r .next/standalone/* $WEB_ROOT/
        sudo cp -r .next/static $WEB_ROOT/.next/ 2>/dev/null || true
        sudo cp -r public $WEB_ROOT/ 2>/dev/null || true
        
        # Copy additional files
        sudo cp -r calculators $WEB_ROOT/ 2>/dev/null || true
        sudo cp -r pro-calculators $WEB_ROOT/ 2>/dev/null || true
        sudo cp -r medical-content-generator $WEB_ROOT/ 2>/dev/null || true
        sudo cp -r includes $WEB_ROOT/ 2>/dev/null || true
        sudo cp -r assets $WEB_ROOT/ 2>/dev/null || true
        sudo cp -r scripts $WEB_ROOT/ 2>/dev/null || true
        
        # Set proper permissions
        log "🔐 Setting file permissions..."
        sudo chown -R $WEB_USER:$WEB_USER $WEB_ROOT
        sudo chmod -R 755 $WEB_ROOT
        sudo chmod -R 644 $WEB_ROOT/*.html $WEB_ROOT/*.css $WEB_ROOT/*.js 2>/dev/null || true
        sudo chmod -R 644 $WEB_ROOT/**/*.html $WEB_ROOT/**/*.css $WEB_ROOT/**/*.js 2>/dev/null || true
        
        # Set executable permissions for scripts
        sudo chmod +x $WEB_ROOT/scripts/*.sh 2>/dev/null || true
        
        # Create .env file if it doesn't exist
        if [ ! -f "$WEB_ROOT/.env" ]; then
            log "📝 Creating .env file..."
            sudo -u $WEB_USER tee $WEB_ROOT/.env > /dev/null << 'ENVEOF'
# VitaPulse Environment Variables
NODE_ENV=production
PORT=3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://nbzpkeyzodcafbgupxne.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ienBrZXl6b2RjYWZiZ3VweG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzU4OTAsImV4cCI6MjA3MjgxMTg5MH0.ByI2oD8H9ZH9Kw9BZy3VEqsQA6YSCUbHUng7-n01hBA

# App Configuration
NEXT_PUBLIC_APP_NAME=VitaPulse
NEXT_PUBLIC_APP_URL=https://vitapulse.fit
CUSTOM_KEY=vitapulse_custom_key_2024

# AI Configuration (Add your keys)
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Security
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://vitapulse.fit
ENVEOF
            sudo chown $WEB_USER:$WEB_USER $WEB_ROOT/.env
            sudo chmod 600 $WEB_ROOT/.env
        fi
        
        # Start PM2 process
        if command -v pm2 &> /dev/null; then
            log "▶️ Starting PM2 process..."
            cd $WEB_ROOT
            sudo -u $WEB_USER pm2 start server.js --name $PM2_APP_NAME --env production
            sudo -u $WEB_USER pm2 save
        else
            log "📥 Installing PM2..."
            sudo npm install -g pm2
            cd $WEB_ROOT
            sudo -u $WEB_USER pm2 start server.js --name $PM2_APP_NAME --env production
            sudo -u $WEB_USER pm2 startup
            sudo -u $WEB_USER pm2 save
        fi
        
        # Clean up temporary directory
        log "🧹 Cleaning up..."
        sudo rm -rf $TEMP_DIR
        
        # Test deployment
        log "🧪 Testing deployment..."
        sleep 10
        if curl -f -s http://localhost:3000 > /dev/null; then
            success "✅ Deployment successful! Application is running."
        else
            warning "⚠️ Application may still be starting up. Check PM2 status."
            # Don't exit on failure, just warn
        fi
        
        # Log deployment
        log "📝 Logging deployment..."
        echo "$(date): Deployment successful - $(git log -1 --pretty=format:'%h - %s')" | sudo tee -a /var/log/vitapulse-deployments.log
        
        success "🎉 VitaPulse deployment completed successfully!"
        
    else
        log "ℹ️ Push to non-main branch ignored: $ref"
    fi
done
