# 🚀 Quick Start Guide

## 📦 One-Time Setup (First Time Only)

Open PowerShell and run:

```powershell
# Navigate to project folder
cd "c:\Users\METRO\Desktop\جماليات\tododo"

# Install all dependencies (one time only)
npm install

# Start development server
npm run dev
```

The app will open automatically at `http://localhost:5173` 🎉

## 💻 Daily Development

To continue development after setup:

```powershell
cd "c:\Users\METRO\Desktop\جماليات\tododo"
npm run dev
```

## 🏗️ Build for Production

When you're ready to deploy:

```powershell
cd "c:\Users\METRO\Desktop\جماليات\tododo"
npm run build
```

This creates an optimized `dist` folder ready to upload to hosting.

## 📱 Test on Mobile

### Testing on Local Mobile
1. Find your computer's IP address (Windows: `ipconfig` → look for IPv4 Address)
2. On mobile, visit: `http://YOUR_IP:5173`
3. To install: Use "Add to Home Screen" option

### Testing Offline Mode
1. Open DevTools (F12)
2. Go to Application → Service Workers
3. Check "Offline" checkbox
4. Refresh page - app should work fully offline

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#YOUR_COLOR',
    }
  }
}
```

### Add New Category
1. Edit `src/components/Dashboard.jsx` - add to CATEGORIES array
2. Edit `src/components/AddTask.jsx` - add to CATEGORIES array
3. Edit `src/components/TaskCard.jsx` - add icon and color

### Change App Name
Edit `public/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "Short Name"
}
```

## 📁 Project Structure at a Glance

```
tododo/
├── src/
│   ├── components/     ← UI Components
│   ├── hooks/          ← Custom React Hooks
│   ├── utils/          ← Storage & Utilities
│   ├── App.jsx         ← Main App Component
│   └── index.css       ← Global Styles
├── public/
│   ├── manifest.json   ← PWA Configuration
│   └── service-worker.js  ← Offline Support
├── package.json        ← Dependencies
└── README.md           ← Full Documentation
```

## 🆘 Common Issues

### "npm not found" Error
- Install Node.js from https://nodejs.org/
- Close and reopen PowerShell after installation

### Blank White Screen
- Check browser console (F12) for errors
- Clear cache: Ctrl+Shift+Delete
- Restart dev server: Stop (Ctrl+C), then `npm run dev`

### Service Worker Not Updating
- In DevTools → Application → Service Workers
- Click "Unregister"
- Refresh page

### LocalStorage Not Persisting
- Check if localStorage is enabled in browser
- Not in private/incognito mode
- Storage quota available

## 📱 Installing as App

### On iPhone/iPad (iOS)
1. Open app in Safari
2. Tap Share button (↑)
3. Scroll down and tap "Add to Home Screen"
4. Name: تودو
5. Tap "Add"

### On Android
1. Open app in Chrome
2. Tap menu (⋮)
3. Tap "Install app"
4. Confirm

### On Windows/Mac
1. Open app in Chrome/Edge
2. Click install icon in address bar (if available)
3. Click "Install"

## 🎯 Next Steps

1. **Test all features** offline
2. **Customize colors** and design
3. **Deploy to hosting** (see DEPLOYMENT.md)
4. **Share with others** - it's a PWA, no app store needed!

## 📚 More Information

- [Full README](README.md) - Complete feature documentation
- [Development Guide](DEVELOPMENT.md) - Architecture & extending
- [Deployment Guide](DEPLOYMENT.md) - Deploy to production

## 💡 Pro Tips

✅ **Backup your data**: Settings → Download backup regularly
✅ **Test offline**: Press F12 → Network → Offline
✅ **Mobile responsive**: F12 → Toggle device toolbar
✅ **Fast development**: `npm run dev` with hot reloading

---

**Happy task managing!** 🌱

Any questions? Check the documentation files or the code comments.
