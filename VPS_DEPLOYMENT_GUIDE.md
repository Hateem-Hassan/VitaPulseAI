# VitaPulse VPS Deployment Guide

## 🚀 Git-Based Deployment Workflow

### Prerequisites
- Git installed on local machine
- SSH access to Hostinger VPS
- Node.js and npm on VPS

### Step 1: SSH Connection
```bash
ssh username@your-server-ip-address
```

### Step 2: Server Setup (One-time)
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install ufw nginx git nodejs npm -y

# Create bare Git repository
mkdir -p /home/username/vitapulse.git
cd /home/username/vitapulse.git
git init --bare

# Create deployment directory
mkdir -p /home/username/domains/vitapulse.fit/public_html
```

### Step 3: Create Auto-Deploy Hook
```bash
# Create post-receive hook
nano /home/username/vitapulse.git/hooks/post-receive
```

Add this content:
```bash
#!/bin/bash
TARGET="/home/username/domains/vitapulse.fit/public_html"
GIT_DIR="/home/username/vitapulse.git"
BRANCH="main"

while read oldrev newrev ref
do
    if [[ $ref = refs/heads/$BRANCH ]];
    then
        echo "Deploying to production..."
        git --work-tree=$TARGET --git-dir=$GIT_DIR checkout -f $BRANCH
        
        cd $TARGET
        npm install
        npm run build
        
        chown -R www-data:www-data $TARGET
        chmod -R 755 $TARGET
        
        echo "✅ Deployment complete."
    fi
done
```

Make executable:
```bash
chmod +x /home/username/vitapulse.git/hooks/post-receive
```

### Step 4: Local Git Setup
```bash
# Initialize repository
git init
git add .
git commit -m "Initial commit"

# Add remote
git remote add production ssh://username@server-ip/home/username/vitapulse.git

# Deploy
git push production main
```

## 🔧 Firewall Configuration
```bash
# Configure UFW
sudo ufw allow 'OpenSSH'
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

## 📊 Monitoring Commands
```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Check disk space
df -h

# Check memory usage
free -h

# Check running processes
htop
```

## 🛡️ Security Hardening Checklist

### Basic Security
- [ ] Change SSH port from 22 to non-standard port
- [ ] Disable SSH password authentication
- [ ] Use SSH key-based authentication only
- [ ] Enable automatic security updates
- [ ] Install and configure Fail2Ban

### Commands
```bash
# Install unattended upgrades
sudo apt install unattended-upgrades

# Install Fail2Ban
sudo apt install fail2ban

# Configure Fail2Ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 🚨 Troubleshooting

### Common Issues
1. **Permission denied**: Check file ownership with `ls -la`
2. **Build fails**: Check Node.js version with `node --version`
3. **Nginx errors**: Check config with `sudo nginx -t`
4. **SSL issues**: Verify certificate with `sudo certbot certificates`

### Log Locations
- Nginx error log: `/var/log/nginx/error.log`
- Nginx access log: `/var/log/nginx/access.log`
- System log: `/var/log/syslog`
- Auth log: `/var/log/auth.log`

## 📞 Support
For issues, check logs first, then contact support with:
- Error messages
- Log excerpts
- System information (`uname -a`)
- Disk space (`df -h`)
