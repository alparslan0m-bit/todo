# Build & Deployment Instructions

## 📦 Building the Project

### Development Build
```bash
npm install
npm run dev
```

The development server will start at `http://localhost:5173`

### Production Build
```bash
npm install
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

### Preview Production Build
```bash
npm run preview
```

## 🚀 Deployment Options

### Option 1: Static Hosting (Recommended)
Platforms: **Vercel, Netlify, GitHub Pages, Firebase Hosting**

```bash
npm run build
# Upload the 'dist' folder to your hosting platform
```

#### Vercel (Simplest)
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### GitHub Pages
1. Push code to GitHub
2. Go to Settings → Pages
3. Select `dist` folder as source
4. Enable GitHub Actions

### Option 2: Docker Deployment

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t tododo-pwa .
docker run -p 8080:80 tododo-pwa
```

### Option 3: Local HTTP Server
```bash
npm run build
npm run serve
# Visit http://localhost:8000
```

## ✅ Deployment Checklist

- [ ] All assets cached (Service Worker)
- [ ] manifest.json is valid
- [ ] HTTPS enabled (required for PWA)
- [ ] Icons are present (192x512px minimum)
- [ ] Service worker registered
- [ ] No console errors
- [ ] LocalStorage working offline
- [ ] PWA installable
- [ ] Mobile responsive tested
- [ ] RTL layout verified

## 🔍 Testing PWA Features

### Test Offline Functionality
1. Build and deploy: `npm run build`
2. Open in Chrome DevTools (F12)
3. Go to Application → Service Workers
4. Check "Offline" checkbox
5. Refresh page - should work offline

### Test Installation
1. Open app in browser
2. Chrome: Click install icon in address bar
3. iOS: Share → Add to Home Screen
4. Android: Menu → Install app

### Lighthouse Audit
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Run audit
4. Should score 90+ for PWA

## 📊 Performance Optimization

The app is already optimized with:
- Service Worker caching
- Code splitting via Vite
- TailwindCSS tree-shaking
- Minimal bundle size (~150KB gzipped)
- Lazy loading

## 🔐 Security Considerations

1. **HTTPS Only**: Always use HTTPS in production
2. **CSP Headers**: Add Content Security Policy headers
3. **No Third-party Scripts**: All code is self-hosted
4. **LocalStorage Only**: No external API calls by default

### Example nginx.conf for security:
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    location / {
        root /usr/share/nginx/html;
        try_files $uri /index.html;
    }
}
```

## 🆘 Troubleshooting Deployment

### PWA Not Installing
- Ensure HTTPS is enabled
- Check manifest.json is accessible
- Verify Service Worker registration
- Test with Lighthouse audit

### Service Worker Not Updating
- Clear browser cache
- Update cache version in service-worker.js
- Check Service Workers tab in DevTools

### White Screen After Deploy
- Check browser console for errors
- Verify all asset paths are correct
- Ensure index.html is served for all routes

## 📈 Monitoring

### Recommended Tools
- **Google Analytics**: Track user engagement
- **Sentry**: Error tracking
- **Lighthouse**: Regular performance checks
- **Chrome DevTools**: Local testing

---

**Questions or Issues?** Check the main README.md or create an issue in the repository.
