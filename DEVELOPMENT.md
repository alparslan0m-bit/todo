# Development Guide

## 🏗️ Architecture Overview

### Component Hierarchy
```
App (Main)
├── Dashboard (Task List View)
│   ├── TaskCard (Repeating)
│   └── TaskModal (Modal)
├── AddTask (Form View)
│   └── IntentionInput (Form Section)
├── Settings (Settings View)
└── Navigation (Bottom Bar)
```

### Data Flow
```
LocalStorage (Persistent)
    ↓
Storage Utils (storage.js)
    ↓
Custom Hooks (useTasks.js, useIntentions.js)
    ↓
React Components (State & Effects)
    ↓
UI Updates (JSX Rendering)
```

## 🔧 Adding New Features

### Adding a New Task Category

1. **Update CATEGORIES array** in relevant components:
```javascript
// In Dashboard.jsx and AddTask.jsx
const CATEGORIES = [
  'عبادات', 'علم', 'عمل', 'أسرة', 'نفس', 'خير',
  'سفر' // New category
];
```

2. **Add icon and color** in TaskCard.jsx:
```javascript
const CATEGORY_ICONS = {
  // ... existing
  'سفر': '✈️'
};

const CATEGORY_COLORS = {
  // ... existing
  'سفر': 'bg-indigo-100 text-indigo-800'
};
```

### Adding a New Default Intention

Edit `src/utils/storage.js`:
```javascript
const DEFAULT_INTENTIONS = [
  'رضا الله',
  'طلب العلم',
  'مساعدة الآخرين',
  'شكر الله' // New intention
];
```

### Adding Task Editing Capability

1. Create `EditTask.jsx`:
```javascript
const EditTask = ({ task, onSave, onCancel }) => {
  // Component code
};
```

2. Add to `App.jsx` navigation
3. Create `updateTask()` function in `storage.js`
4. Add hook method in `useTasks.js`

## 📚 Component API Reference

### Dashboard Props
```javascript
{
  onNavigateToAdd: () => void,    // Navigate to add task page
  onShowModal: () => void         // Show completion modal
}
```

### TaskCard Props
```javascript
{
  task: Object,                   // Task object {id, title, category, intention, completed}
  onComplete: (taskId) => void,   // Handle task completion toggle
  onDelete: (taskId) => void      // Handle task deletion
}
```

### AddTask Props
```javascript
{
  onNavigateDashboard: () => void // Navigate back to dashboard
}
```

### useTasks Hook Return
```javascript
{
  tasks: Task[],                  // All tasks
  loading: boolean,               // Loading state
  addTask: (task) => Task,        // Add new task
  updateTaskStatus: (id, status) => Task,
  deleteTask: (id) => boolean,
  getTasksByCategory: (cat) => Task[],
  getTodaysTasks: () => Task[],
  getIncompleteTasks: () => Task[],
  getCompletedTasks: () => Task[]
}
```

## 🎨 Customizing Styling

### TailwindCSS Configuration
Edit `tailwind.config.js` to modify:
- Colors
- Font families
- Spacing
- Breakpoints

Example: Change primary color
```javascript
theme: {
  extend: {
    colors: {
      primary: '#1a4d2e', // New green
    }
  }
}
```

### Global Styles
Edit `src/index.css` for:
- Custom animations
- Global class utilities
- CSS variables
- Print styles

## 🧪 Testing Approach

### Manual Testing Checklist
- [ ] Add task with all categories
- [ ] Create custom intention
- [ ] Complete task - verify modal
- [ ] Delete task
- [ ] Filter by category
- [ ] Test offline (DevTools → Network → Offline)
- [ ] Test on mobile resolution
- [ ] Test RTL layout
- [ ] Test backup/restore
- [ ] Test PWA installation

### Browser Testing
- Chrome/Chromium
- Firefox
- Safari (iOS)
- Edge

## 🐛 Debugging Tips

### LocalStorage Issues
```javascript
// In browser console:
localStorage.getItem('tododo_tasks')
localStorage.getItem('tododo_intentions')
localStorage.clear() // Clear all
```

### React Component Debugging
```javascript
// Add in any component
console.log('Current state:', state);
console.log('Component props:', props);
```

### Service Worker Debugging
```javascript
// In DevTools: Application → Service Workers
// Check registration, cache storage, scope
```

## 📦 Dependencies Management

### Adding a New Package
```bash
npm install package-name
# Update import in relevant files
```

### Current Dependencies
- **react**: UI framework
- **react-dom**: DOM rendering
- **tailwindcss**: Styling
- **vite**: Build tool
- **autoprefixer**: CSS compatibility

### Why No Other Libraries?
- ✅ LocalStorage is built-in
- ✅ React Hooks for state management
- ✅ CSS for animations
- ✅ Vite for bundling
- ✅ TailwindCSS for styling

Keep dependencies minimal for fast loading and offline-first capability.

## 🔄 Update Flow

When updating features:

1. **Modify Component** (e.g., Dashboard.jsx)
2. **Update Hooks** if needed (useTasks.js)
3. **Update Storage Utils** if needed (storage.js)
4. **Test Offline** (DevTools → Offline)
5. **Test on Mobile** (Chrome DevTools → Device Mode)
6. **Check LocalStorage** persistence
7. **Run `npm run build`** to verify no errors

## 📈 Performance Best Practices

### What's Already Done
- ✅ Code splitting via Vite
- ✅ Tree-shaking for TailwindCSS
- ✅ Service Worker caching
- ✅ Minimal re-renders with hooks

### Future Optimizations
- [ ] Image optimization (when adding images)
- [ ] Lazy route loading
- [ ] Memoized components for lists
- [ ] Web Workers for heavy tasks

## 🚀 Deployment Checklist

Before deploying:
1. [ ] `npm run build` succeeds
2. [ ] No console errors
3. [ ] Offline mode works
4. [ ] All features tested
5. [ ] Mobile responsive
6. [ ] PWA installable
7. [ ] Service worker cached
8. [ ] HTTPS enabled

---

**Happy Coding!** 🎉

For questions about architecture or implementation, refer to code comments throughout the project.
