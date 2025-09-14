# 🚀 **Complete NPM Install Guide for VitaPulse**

## **Step 1: Open New Terminal (IMPORTANT!)**

### **Why you need a new terminal:**
- Your current terminal is running the Python server
- npm install needs a fresh terminal session
- Administrator privileges may be required

### **How to open new terminal:**
1. **Close current PowerShell** (or open new one)
2. **Right-click on PowerShell** → "Run as Administrator"
3. **Navigate to project:**
   ```powershell
   cd E:\VitaPulseAi
   ```

## **Step 2: Verify Node.js Setup**

```powershell
# Check Node.js version
node --version

# Check npm version  
npm --version

# If commands not found, add to PATH:
$env:PATH += ";C:\Program Files\nodejs\"
```

## **Step 3: Run npm install (Choose ONE method)**

### **Method 1: Standard Install (Recommended)**
```powershell
npm install
```

### **Method 2: Skip Optional Dependencies (Faster)**
```powershell
npm install --omit=optional
```

### **Method 3: Legacy Peer Deps (If conflicts)**
```powershell
npm install --legacy-peer-deps
```

### **Method 4: Force Install (If errors)**
```powershell
npm install --force
```

## **Step 4: Wait for Completion**

### **What to expect:**
- ⏳ **5-10 minutes** for first install
- 📦 **Downloads ~200MB** of packages
- 🔄 **Progress indicators** will show
- ✅ **"added X packages"** when complete

### **Signs it's working:**
```
npm WARN deprecated some-package@1.0.0
added 1234 packages in 2m 30s
```

## **Step 5: Verify Installation**

```powershell
# Check if node_modules exists
Test-Path "node_modules"

# Should return: True
```

## **Step 6: Start Development Server**

```powershell
# Start Next.js development server
npm run dev

# Should show:
# ▲ Next.js 14.0.4
# - Local:        http://localhost:3000
# - Network:      http://192.168.1.100:3000
```

## **Step 7: Access Your App**

- **Main App:** http://localhost:3000
- **Simple Server:** http://localhost:3000/simple-server.html

---

## **Troubleshooting**

### **If npm install fails:**

#### **Error: "npm is not recognized"**
```powershell
# Add Node.js to PATH
$env:PATH += ";C:\Program Files\nodejs\"

# Or reinstall Node.js from: https://nodejs.org/
```

#### **Error: "Permission denied"**
```powershell
# Run PowerShell as Administrator
# Or try:
npm install --no-optional --legacy-peer-deps
```

#### **Error: "Network timeout"**
```powershell
# Clear cache and retry
npm cache clean --force
npm install --registry https://registry.npmjs.org/
```

#### **Error: "EACCES" or "EPERM"**
```powershell
# Change npm directory
npm config set prefix %APPDATA%\npm
npm install
```

### **If installation is slow:**
```powershell
# Use different registry
npm install --registry https://registry.npmjs.org/

# Or skip optional dependencies
npm install --omit=optional
```

---

## **Alternative: Use Yarn (If npm fails)**

```powershell
# Install Yarn
npm install -g yarn

# Install dependencies with Yarn
yarn install

# Start development server
yarn dev
```

---

## **Expected Results**

### **After successful npm install:**
- ✅ **node_modules folder** created
- ✅ **package-lock.json** generated
- ✅ **No error messages**
- ✅ **Ready to run** `npm run dev`

### **After running npm run dev:**
- ✅ **Next.js server** starts on port 3000
- ✅ **Hot reload** enabled
- ✅ **Full VitaPulse app** accessible
- ✅ **All features** working

---

## **Quick Commands Summary**

```powershell
# 1. Open new PowerShell as Administrator
# 2. Navigate to project
cd E:\VitaPulseAi

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

# 5. Visit: http://localhost:3000
```

---

## **Need Help?**

If you still have issues:
1. **Try Method 2** (skip optional deps)
2. **Run as Administrator**
3. **Use Yarn instead** of npm
4. **Check antivirus** isn't blocking
5. **Try different terminal** (Command Prompt)
