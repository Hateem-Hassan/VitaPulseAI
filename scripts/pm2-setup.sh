#!/bin/bash

# PM2 Setup for VitaPulse AI Services
echo "Setting up PM2 for VitaPulse AI services..."

# Install PM2 globally if not already installed
npm install -g pm2

# Start AI server (if you have one)
# pm2 start /home/username/domains/vitapulse.fit/public_html/ai-server.js --name "vitapulse-ai"

# Save PM2 configuration
pm2 save

# Generate startup script
pm2 startup

echo "PM2 setup complete!"
echo "AI services are now managed by PM2"
echo "Run 'pm2 status' to check service status"
echo "Run 'pm2 logs' to view logs"
