#!/bin/bash

# VitaPulse Git Deployment Setup Script
# Run this script on your Ubuntu server to set up Git-based deployment

set -e  # Exit on any error

# Configuration
PROJECT_NAME="vitapulse"
GIT_USER="git"
WEB_USER="www-data"
WEB_ROOT="/var/www/vitapulse.fit/public_html"
GIT_REPO="/home/$GIT_USER/$PROJECT_NAME.git"
BACKUP_DIR="/home/$GIT_USER/backups"

echo "🚀 Setting up VitaPulse Git Deployment Workflow..."

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "❌ Please don't run this script as root. Use sudo for specific commands."
    exit 1
fi

# Create git user if it doesn't exist
if ! id "$GIT_USER" &>/dev/null; then
    echo "📝 Creating git user..."
    sudo adduser --system --shell /bin/bash --gecos 'Git Version Control' --group --disabled-password --home /home/$GIT_USER $GIT_USER
    sudo usermod -aG sudo $GIT_USER
fi

# Create directories
echo "📁 Creating directories..."
sudo mkdir -p $WEB_ROOT
sudo mkdir -p $BACKUP_DIR
sudo mkdir -p $GIT_REPO

# Set ownership
echo "🔐 Setting ownership..."
sudo chown -R $GIT_USER:$GIT_USER /home/$GIT_USER
sudo chown -R $WEB_USER:$WEB_USER $WEB_ROOT

# Initialize bare repository
echo "📦 Initializing Git repository..."
cd $GIT_REPO
sudo -u $GIT_USER git init --bare

# Create post-receive hook
echo "🪝 Creating post-receive hook..."
sudo tee $GIT_REPO/hooks/post-receive > /dev/null << 'EOF'
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
        sudo -u $GIT_USER git clone $GIT_REPO .
        
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
        sudo -u $GIT_USER npm ci --production --silent
        
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
        sleep 5
        if curl -f -s http://localhost:3000 > /dev/null; then
            success "✅ Deployment successful! Application is running."
        else
            error "❌ Deployment failed! Application is not responding."
            exit 1
        fi
        
        # Log deployment
        log "📝 Logging deployment..."
        echo "$(date): Deployment successful - $(git log -1 --pretty=format:'%h - %s')" | sudo tee -a /var/log/vitapulse-deployments.log
        
        success "🎉 VitaPulse deployment completed successfully!"
        
    else
        log "ℹ️ Push to non-main branch ignored: $ref"
    fi
done
EOF

# Make post-receive hook executable
sudo chmod +x $GIT_REPO/hooks/post-receive
sudo chown $GIT_USER:$GIT_USER $GIT_REPO/hooks/post-receive

# Set up SSH key for git user
echo "🔑 Setting up SSH key for git user..."
sudo -u $GIT_USER mkdir -p /home/$GIT_USER/.ssh
sudo -u $GIT_USER chmod 700 /home/$GIT_USER/.ssh

# Create authorized_keys file
sudo -u $GIT_USER touch /home/$GIT_USER/.ssh/authorized_keys
sudo -u $GIT_USER chmod 600 /home/$GIT_USER/.ssh/authorized_keys

echo "📋 SSH Key Setup Instructions:"
echo "1. Copy your public SSH key:"
echo "   cat ~/.ssh/id_rsa.pub"
echo ""
echo "2. Add it to the git user's authorized_keys:"
echo "   sudo -u $GIT_USER nano /home/$GIT_USER/.ssh/authorized_keys"
echo ""
echo "3. Or run this command (replace YOUR_PUBLIC_KEY):"
echo "   echo 'YOUR_PUBLIC_KEY' | sudo -u $GIT_USER tee -a /home/$GIT_USER/.ssh/authorized_keys"

# Create deployment log file
sudo touch /var/log/vitapulse-deployments.log
sudo chown $GIT_USER:$GIT_USER /var/log/vitapulse-deployments.log

# Set up log rotation
sudo tee /etc/logrotate.d/vitapulse > /dev/null << 'EOF'
/var/log/vitapulse-deployments.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 git git
}
EOF

echo ""
echo "✅ Git deployment setup completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Add your SSH public key to /home/$GIT_USER/.ssh/authorized_keys"
echo "2. Test the connection: ssh $GIT_USER@your-server-ip"
echo "3. Add remote to your local repository:"
echo "   git remote add production $GIT_USER@your-server-ip:$GIT_REPO"
echo "4. Deploy: git push production main"
echo ""
echo "🔧 Repository URL: $GIT_USER@$(hostname -I | awk '{print $1}'):$GIT_REPO"
echo "🌐 Web Root: $WEB_ROOT"
echo "📝 Deployment Logs: /var/log/vitapulse-deployments.log"
