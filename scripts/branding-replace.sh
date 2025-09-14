#!/bin/bash

# VitaPulse Branding Enforcement Script
# This script replaces all instances of "VitalVibe" with "VitaPulse"

echo "Starting VitaPulse branding enforcement..."

# Find and replace in all HTML files
find /home/username/domains/vitapulse.fit/public_html/ -name "*.html" -type f -exec sed -i 's/VitalVibe/VitaPulse/g' {} \;

# Find and replace in all PHP files
find /home/username/domains/vitapulse.fit/public_html/ -name "*.php" -type f -exec sed -i 's/VitalVibe/VitaPulse/g' {} \;

# Find and replace in all CSS files
find /home/username/domains/vitapulse.fit/public_html/ -name "*.css" -type f -exec sed -i 's/VitalVibe/VitaPulse/g' {} \;

# Find and replace in all JavaScript files
find /home/username/domains/vitapulse.fit/public_html/ -name "*.js" -type f -exec sed -i 's/VitalVibe/VitaPulse/g' {} \;

# Remove premium bloatware references
find /home/username/domains/vitapulse.fit/public_html/ -name "*.html" -type f -exec sed -i 's/SuperGrok//g' {} \;
find /home/username/domains/vitapulse.fit/public_html/ -name "*.php" -type f -exec sed -i 's/SuperGrok//g' {} \;
find /home/username/domains/vitapulse.fit/public_html/ -name "*.html" -type f -exec sed -i 's/x\.com subscriptions//g' {} \;
find /home/username/domains/vitapulse.fit/public_html/ -name "*.php" -type f -exec sed -i 's/x\.com subscriptions//g' {} \;

echo "Branding enforcement complete!"
echo "All instances of 'VitalVibe' have been replaced with 'VitaPulse'"
echo "Premium bloatware references have been removed"
