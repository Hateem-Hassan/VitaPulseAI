# 🚀 **VitaPulse Setup Instructions**

## **Step 1: Install Node.js**

### **Download Node.js:**
1. Go to: https://nodejs.org/
2. Download the **LTS version** (recommended)
3. Run the installer and follow the setup wizard
4. **Restart your terminal/PowerShell** after installation

### **Verify Installation:**
```powershell
node --version
npm --version
```

## **Step 2: Install Dependencies**

```powershell
# Navigate to your project directory
cd E:\VitaPulseAi

# Install all dependencies
npm install
```

## **Step 3: Start Development Server**

```powershell
# Start the Next.js development server
npm run dev
```

## **Step 4: Access Your App**

- **Local URL:** http://localhost:3000
- **Network URL:** http://[your-ip]:3000

---

## **Option 2: Use the Simple HTML Server (Quick Test)**

If you want to test the homepage immediately without Node.js:

```powershell
# Start Python server
python -m http.server 3000

# Then visit: http://localhost:3000/simple-server.html
```

---

## **Option 3: Deploy to Production Server**

If you want to deploy to your production server (vitapulse.fit):

### **Prerequisites:**
- Node.js installed on server
- Git repository set up
- Domain configured

### **Deployment Commands:**
```bash
# On your server
git clone [your-repo-url]
cd VitaPulseAi
npm install
npm run build
npm start
```

---

## **Troubleshooting**

### **If Node.js installation fails:**
1. Run PowerShell as Administrator
2. Try: `winget install OpenJS.NodeJS`
3. Or download from: https://nodejs.org/

### **If npm install fails:**
```powershell
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### **If port 3000 is busy:**
```powershell
# Use different port
npm run dev -- -p 3001
```

---

## **Expected Results**

After successful setup:
- ✅ **Homepage loads** at http://localhost:3000
- ✅ **Mobile responsive** design
- ✅ **All links clickable** with animations
- ✅ **Fast loading** (2-3 seconds)
- ✅ **No JavaScript errors**
- ✅ **Professional appearance**

---

## **Need Help?**

If you encounter any issues:
1. Check the error messages
2. Verify Node.js installation
3. Try the simple HTML server as backup
4. Check the troubleshooting section above
