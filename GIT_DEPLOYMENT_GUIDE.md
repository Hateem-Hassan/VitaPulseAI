# VitaPulse Git Deployment Guide

## **🚀 Complete Git-Based Deployment Workflow**

This guide provides a complete Git-based deployment workflow for VitaPulse, eliminating the need for manual FileZilla uploads.

---

## **📋 Prerequisites**

### **Server Requirements**
- Ubuntu 22.04 LTS (or similar)
- Root/sudo access
- Internet connection
- At least 2GB RAM
- 10GB free disk space

### **Local Machine Requirements**
- Git installed
- SSH key pair generated
- Access to your VitaPulse codebase

---

## **🔧 Server Setup (Run on Ubuntu Server)**

### **Step 1: Download and Run Setup Script**

```bash
# Download the setup script
wget https://raw.githubusercontent.com/your-repo/vitapulse/main/scripts/git-deployment-setup.sh

# Make it executable
chmod +x git-deployment-setup.sh

# Run the setup script
./git-deployment-setup.sh
```

### **Step 2: Add Your SSH Key**

After the script completes, add your SSH public key:

```bash
# Copy your public key
cat ~/.ssh/id_rsa.pub

# Add it to the git user (replace YOUR_PUBLIC_KEY)
echo 'YOUR_PUBLIC_KEY' | sudo -u git tee -a /home/git/.ssh/authorized_keys
```

### **Step 3: Verify Setup**

```bash
# Test SSH connection
ssh git@your-server-ip

# Check repository
ls -la /home/git/vitapulse.git/

# Check web root
ls -la /var/www/vitapulse.fit/public_html/
```

---

## **💻 Local Machine Setup**

### **Step 1: Configure Local Script**

Edit `scripts/local-git-setup.sh` and update the server IP:

```bash
# Replace with your actual server IP
SERVER_IP="your-server-ip-here"
```

### **Step 2: Run Local Setup**

```bash
# Make script executable
chmod +x scripts/local-git-setup.sh

# Run the setup
./scripts/local-git-setup.sh
```

### **Step 3: Deploy**

```bash
# Deploy to server
git push production main
```

---

## **🪝 Post-Receive Hook Details**

The post-receive hook automatically:

### **1. Creates Backups**
- Backs up current deployment before updating
- Stores backups in `/home/git/backups/`
- Automatic cleanup of old backups

### **2. Builds Application**
- Installs Node.js dependencies
- Runs `npm run build`
- Creates production build

### **3. Deploys Files**
- Copies built files to web root
- Sets proper file permissions
- Maintains security standards

### **4. Manages Process**
- Stops existing PM2 process
- Starts new application
- Saves PM2 configuration

### **5. Validates Deployment**
- Tests application response
- Logs deployment status
- Provides success/failure feedback

---

## **🔐 Security Features**

### **File Permissions**
```bash
# Web files: 755 (readable/executable by all, writable by owner)
# Scripts: 755 (executable)
# Config files: 644 (readable by all, writable by owner)
# .env file: 600 (readable/writable by owner only)
```

### **User Isolation**
- Git operations run as `git` user
- Web files owned by `www-data`
- Proper user separation maintained

### **Backup Strategy**
- Automatic backups before each deployment
- Timestamped backup directories
- Easy rollback capability

---

## **📊 Monitoring & Logs**

### **Deployment Logs**
```bash
# View deployment history
sudo tail -f /var/log/vitapulse-deployments.log

# Check recent deployments
sudo grep "$(date +%Y-%m-%d)" /var/log/vitapulse-deployments.log
```

### **Application Logs**
```bash
# PM2 logs
ssh git@your-server-ip 'pm2 logs vitapulse'

# PM2 status
ssh git@your-server-ip 'pm2 status'

# PM2 monitoring
ssh git@your-server-ip 'pm2 monit'
```

### **System Logs**
```bash
# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

---

## **🔄 Deployment Workflow**

### **Daily Development**
```bash
# Make changes to your code
# ...

# Add and commit changes
git add .
git commit -m "Feature: Add new calculator"

# Deploy to server
git push production main
```

### **Rollback Process**
```bash
# List available backups
ssh git@your-server-ip 'ls -la /home/git/backups/'

# Restore from backup
ssh git@your-server-ip 'sudo cp -r /home/git/backups/backup-YYYYMMDD-HHMMSS/* /var/www/vitapulse.fit/public_html/'

# Restart application
ssh git@your-server-ip 'pm2 restart vitapulse'
```

---

## **🛠️ Troubleshooting**

### **Common Issues**

#### **SSH Connection Failed**
```bash
# Check SSH key
ssh-add -l

# Test connection
ssh -v git@your-server-ip

# Regenerate SSH key if needed
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
```

#### **Deployment Failed**
```bash
# Check deployment logs
sudo tail -f /var/log/vitapulse-deployments.log

# Check PM2 status
ssh git@your-server-ip 'pm2 status'

# Check application logs
ssh git@your-server-ip 'pm2 logs vitapulse --lines 50'
```

#### **Permission Issues**
```bash
# Fix web root permissions
sudo chown -R www-data:www-data /var/www/vitapulse.fit/public_html
sudo chmod -R 755 /var/www/vitapulse.fit/public_html

# Fix git repository permissions
sudo chown -R git:git /home/git/vitapulse.git
```

#### **Node.js Issues**
```bash
# Check Node.js version
node --version

# Reinstall Node.js if needed
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## **📈 Performance Optimization**

### **PM2 Configuration**
```bash
# Scale application
ssh git@your-server-ip 'pm2 scale vitapulse 2'

# Set memory limit
ssh git@your-server-ip 'pm2 start server.js --name vitapulse --max-memory-restart 1G'

# Enable clustering
ssh git@your-server-ip 'pm2 start server.js --name vitapulse -i max'
```

### **Nginx Configuration**
```nginx
# Add to /etc/nginx/sites-available/vitapulse.fit
upstream vitapulse {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name vitapulse.fit www.vitapulse.fit;
    
    location / {
        proxy_pass http://vitapulse;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## **🔧 Maintenance Commands**

### **Regular Maintenance**
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Clean old backups (keep last 7 days)
ssh git@your-server-ip 'find /home/git/backups -type d -mtime +7 -exec rm -rf {} \;'

# Check disk space
df -h

# Check memory usage
free -h

# Restart services
sudo systemctl restart nginx
ssh git@your-server-ip 'pm2 restart vitapulse'
```

### **Backup Strategy**
```bash
# Create manual backup
ssh git@your-server-ip 'sudo cp -r /var/www/vitapulse.fit/public_html /home/git/backups/manual-backup-$(date +%Y%m%d)'

# Database backup (if using database)
# Add database backup commands here
```

---

## **✅ Verification Checklist**

After setup, verify:

- [ ] SSH connection works: `ssh git@your-server-ip`
- [ ] Git repository exists: `/home/git/vitapulse.git`
- [ ] Web root is accessible: `/var/www/vitapulse.fit/public_html`
- [ ] PM2 is running: `pm2 status`
- [ ] Application responds: `curl http://localhost:3000`
- [ ] Nginx is configured and running
- [ ] SSL certificate is installed (if using HTTPS)
- [ ] Domain points to server IP
- [ ] Deployment logs are working

---

## **🎉 Success!**

Your Git-based deployment workflow is now complete! You can:

1. **Develop locally** with your favorite tools
2. **Commit changes** with Git
3. **Deploy instantly** with `git push production main`
4. **Monitor deployments** through logs
5. **Rollback easily** if needed

**No more FileZilla uploads!** 🚀
