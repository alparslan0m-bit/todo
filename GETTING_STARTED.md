# 🎬 Getting Started - Step by Step

## ✅ Prerequisites Checklist

Before you start, make sure you have:

- [ ] Node.js installed (download from https://nodejs.org/)
- [ ] A code editor (VS Code recommended)
- [ ] A web browser (Chrome/Firefox recommended)
- [ ] PowerShell or Command Prompt
- [ ] 500MB free disk space

## 🚀 Installation (First Time Only)

### Step 1: Open PowerShell
```
Right-click on Desktop
→ Select "Open PowerShell here" (or Windows Terminal)
```

### Step 2: Navigate to Project Folder
```powershell
cd "c:\Users\METRO\Desktop\جماليات\tododo"
```

### Step 3: Install Dependencies
```powershell
npm install
```

**Wait 2-5 minutes** for all packages to download and install.

You'll see a message like:
```
added 200+ packages in 2m30s
```

**This only needs to be done ONCE!**

---

## 💻 Running Development Server

After installation is complete, always use this command to start developing:

```powershell
npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:5173/
  ➜  Press h + enter to show help
```

**The app will open automatically** in your default browser at `http://localhost:5173`

### Press Ctrl+C to Stop Server
When you're done developing, press `Ctrl+C` to stop the server.

---

## 🧪 Testing the App

### Test Features
1. **Add a task**
   - Click ➕ button
   - Enter task title
   - Select category
   - Choose intention
   - Click Save

2. **Complete a task**
   - Click ✓ button
   - See completion modal
   - Click OK

3. **Filter tasks**
   - Click category tabs

4. **Delete task**
   - Click 🗑️ button

5. **Test offline** (F12 → Network → Offline)
   - Refresh page
   - Should still work

### Test Mobile View
1. Press `F12` (Open DevTools)
2. Click device icon (top left)
3. Select mobile device
4. Test layout and buttons

---

## 🏗️ Building for Production

When ready to deploy:

```powershell
npm run build
```

This creates an optimized `dist` folder.

You should see:
```
dist/index.html           14.5 kB
dist/service-worker.js    2.8 kB
dist/manifest.json        1.2 kB
```

---

## 🌐 Deploying to the Web

### Option A: Vercel (Easiest - Recommended)

```powershell
npm install -g vercel
vercel
```

Follow the prompts - it's that easy!

### Option B: Netlify

```powershell
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Option C: Manual Upload

1. Run `npm run build`
2. Upload the `dist` folder to your hosting:
   - GitHub Pages
   - Firebase Hosting
   - Your own web server
   - Any static hosting service

**See DEPLOYMENT.md for detailed instructions**

---

## 📁 Project Folder Structure

```
tododo/
├── src/                    ← Edit these files for changes
│   ├── components/        ← UI pages (Dashboard, AddTask, etc.)
│   ├── hooks/            ← Data management
│   └── utils/            ← Storage functions
├── public/               ← PWA files
├── package.json          ← Dependencies
├── vite.config.js        ← Build config
└── index.html            ← Main page
```

---

## 🔧 Common Tasks

### Change Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#YOUR_COLOR',
  accent: '#YOUR_COLOR',
}
```

Then press `Ctrl+C` and `npm run dev` to restart.

### Add New Category

1. Edit `src/components/Dashboard.jsx` - add to CATEGORIES
2. Edit `src/components/AddTask.jsx` - add to CATEGORIES
3. Edit `src/components/TaskCard.jsx` - add icon and color
4. Save files - dev server auto-updates!

### Change App Name

Edit `public/manifest.json`:
```json
{
  "name": "Your New Name",
  "short_name": "Short Name"
}
```

---

## 🐛 Troubleshooting

### "npm is not found" Error
- Node.js not installed
- Download and install from https://nodejs.org/
- Close and reopen PowerShell after installing

### Blank White Screen
1. Press `F12` to open DevTools
2. Check Console tab for red errors
3. Refresh page: `Ctrl+R`
4. Clear cache: `Ctrl+Shift+Delete`

### Changes Not Showing
- Check that dev server is running
- Press `Ctrl+R` to refresh browser
- Check browser console for errors

### "Port 5173 already in use"
- Another instance is running
- Kill it with: `netstat -ano | findstr :5173`
- Then run `npm run dev` again

### LocalStorage Not Saving
- Check if browser is in private/incognito mode
- Check if localStorage is enabled
- Check available storage quota

---

## 📱 Installing as Mobile App

### On iPhone/iPad
1. Open app in Safari
2. Tap Share button (↑)
3. Scroll down → "Add to Home Screen"
4. Enter name: "تودو"
5. Tap "Add"

### On Android
1. Open app in Chrome
2. Tap menu (⋮)
3. Tap "Install app"
4. Confirm

### On Windows/Mac
1. Open in Chrome
2. Click install icon (usually in address bar)
3. Click "Install"

---

## 📚 Documentation

After setup, read these in order:
1. **README.md** - Full feature documentation
2. **QUICKSTART.md** - Quick reference
3. **DEVELOPMENT.md** - If you want to modify
4. **DEPLOYMENT.md** - If you want to deploy
5. **OVERVIEW.md** - Visual design system

---

## ✨ Pro Tips

💡 **Hot Reloading**: Changes save automatically while `npm run dev` is running

💡 **DevTools**: Press `F12` while app is running to open Developer Tools

💡 **Offline Mode**: Press `F12` → Network → Check "Offline" to test without internet

💡 **Mobile View**: Press `F12` → Click device icon to test mobile layout

💡 **Backup**: Regularly backup your data from Settings → Download

💡 **Performance**: The app is under 200KB - works on slow connections!

---

## 🎯 Next Steps

1. **Install dependencies**: `npm install`
2. **Start dev server**: `npm run dev`
3. **Test all features** in browser
4. **Test offline** (DevTools → Offline)
5. **Customize colors** (tailwind.config.js)
6. **Build for production**: `npm run build`
7. **Deploy** (see DEPLOYMENT.md)

---

## 🆘 Getting Help

**Error in browser?**
- Press F12 → Console tab
- Read the red error message
- Try a fresh page reload

**Git issue?**
- Check .gitignore for rules
- `git status` to see changes
- `git commit` to save changes

**Deployment issue?**
- See DEPLOYMENT.md
- Check Lighthouse audit
- Verify manifest.json

---

## 🎉 Success!

You're all set! Now:

1. Enjoy using the app
2. Customize it to your needs
3. Share with others
4. Deploy it online
5. Keep working on improvements

---

**Remember:**
- First setup: `npm install` (once only)
- Every development session: `npm run dev`
- Before deployment: `npm run build`

---

**Happy Coding!** 🚀

For more help, check:
- README.md - Features
- DEVELOPMENT.md - Architecture
- DEPLOYMENT.md - Going online
- QUICKSTART.md - Quick reference
