# 🕌 تودو - Islamic To-Do List PWA

A production-ready Progressive Web App for managing daily tasks with Islamic-inspired design and offline-first functionality.

## 🌟 Features

- ✅ **Fully Offline**: Complete functionality without internet connection
- 💾 **Local Storage**: All data persists locally on your device
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🇸🇦 **Arabic Support**: Full RTL (Right-to-Left) support with Arabic-friendly interface
- 🎨 **Islamic Design**: Clean, minimal aesthetic with soft color palette
- 🚀 **PWA Ready**: Installable as a native app on your home screen
- 🔄 **Smart Sync**: Real-time updates across components
- 🎯 **Intentions (نيات)**: Set intentions for your tasks with expandable options
- 🏷️ **Task Categories**: Organize tasks in 6 meaningful categories
- 💬 **Completion Feedback**: Encouragement message when completing tasks
- 📦 **Backup & Restore**: Export and import your data

## 📋 Task Categories

1. **عبادات** 🕌 - Worship & Religious Acts
2. **علم** 📚 - Learning & Education
3. **عمل** 💼 - Work & Career
4. **أسرة** 👨‍👩‍👧‍👦 - Family & Relationships
5. **نفس** 🧠 - Self Development & Health
6. **خير** 🤝 - Charity & Helping Others

## 🎯 Default Intentions (Niyyah)

- رضا الله (Seeking Allah's Pleasure)
- طلب العلم (Seeking Knowledge)
- مساعدة الآخرين (Helping Others)

*Users can create custom intentions which automatically become available for future tasks.*

## 🛠️ Technology Stack

- **Frontend**: React 18.2.0
- **Styling**: TailwindCSS 3.3.6
- **Build Tool**: Vite 5.0.8
- **Storage**: Browser LocalStorage API
- **PWA**: Service Worker & Web App Manifest
- **State Management**: React Hooks

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Start

```bash
# Navigate to project directory
cd tododo

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
tododo/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── service-worker.js      # Service worker for offline support
│   └── favicon.svg            # App icon
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx      # Main task list page
│   │   ├── AddTask.jsx        # Task creation form
│   │   ├── TaskCard.jsx       # Individual task display
│   │   ├── TaskModal.jsx      # Completion acknowledgment modal
│   │   ├── Settings.jsx       # Settings & backup page
│   │   └── Navigation.jsx     # Bottom navigation bar
│   ├── hooks/
│   │   ├── useTasks.js        # Task management hook
│   │   └── useIntentions.js   # Intentions management hook
│   ├── utils/
│   │   └── storage.js         # LocalStorage utilities
│   ├── App.jsx                # Main app component
│   ├── index.css              # Global styles
│   └── main.jsx               # React entry point
├── index.html                 # HTML template
├── package.json               # Dependencies
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # TailwindCSS configuration
└── README.md                  # This file
```

## 🎨 Design Tokens

### Colors
- **Primary**: `#2d5016` (Deep Green)
- **Accent**: `#6b8e23` (Olive Green)
- **Light**: `#f5f3f0` (Warm Beige)
- **Sand**: `#e8dcc8` (Light Sand)
- **Blue**: `#4a5f8f` (Calm Blue)

### Typography
- **Font**: Segoe UI, Tahoma, Helvetica Neue, sans-serif
- **Direction**: RTL (Right-to-Left) for Arabic

## 🚀 Usage Guide

### Adding a Task
1. Tap the **➕ إضافة** button in navigation
2. Enter task title
3. Select a category
4. Choose or create an intention (نية)
5. Tap **✓ حفظ المهمة** to save

### Managing Tasks
- **Complete**: Tap ✓ button to mark complete
- **Delete**: Tap 🗑️ button to remove task
- **Filter**: Use category tabs to filter tasks
- **Undo**: Tap ✓ again to mark incomplete

### Settings
- **Backup**: Download JSON backup of your data
- **Restore**: Upload previously downloaded backup
- **Clear All**: Remove all tasks (use with caution!)

## 📱 Installing as PWA

### On Mobile (iOS/Android)
1. Open the app in your mobile browser
2. Tap the share button (usually at bottom)
3. Select "Add to Home Screen"
4. The app will appear on your home screen like a native app

### On Desktop (Chrome/Edge)
1. Click the install icon in the address bar
2. Confirm installation
3. App will open in its own window

## 🔒 Data Privacy

- **Local Storage Only**: All data stays on your device
- **No Cloud Sync**: No data is sent to external servers
- **Offline First**: Works completely without internet
- **User Control**: Full backup/restore capability

## 🛠️ Development

### Running Tests (Future)
```bash
npm run test
```

### Code Formatting
The project uses standard ES6+ syntax with proper comments for maintainability.

### Scalability Features
- Modular component architecture for easy feature additions
- Custom hooks for data management
- Separate utilities for storage operations
- Built-in support for custom intentions and categories

## 📈 Future Enhancement Ideas

- [ ] Task reminders and notifications
- [ ] Analytics and productivity insights
- [ ] Dark mode theme
- [ ] Multi-language support
- [ ] Task notes and descriptions
- [ ] Recurring tasks
- [ ] Cloud sync option
- [ ] Collaborative task lists
- [ ] Statistics dashboard
- [ ] Export to PDF

## 🐛 Troubleshooting

### Service Worker Not Registering
- Check browser console for errors
- Ensure HTTPS is used in production
- Clear browser cache and reload

### LocalStorage Full
- Modern browsers support 5-10MB
- Use backup feature to archive old tasks
- Delete completed tasks regularly

### RTL Layout Issues
- Ensure `dir="rtl"` is set on HTML element ✓
- Use `me-` (margin-end) instead of `mr-` in Tailwind ✓
- Check text direction in components ✓

## 📝 License

This project is open source and available for personal use.

## 💝 Credits

Developed with ❤️ for the Islamic community to help organize daily intentions and tasks.

---

**تطبيق تودو - Islamic To-Do List PWA**
*"اللهم اجعل نياتنا خالصة لوجهك الكريم"*
