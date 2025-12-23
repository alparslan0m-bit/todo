# Modern CSS Features - Usage Examples & Best Practices

## Quick Start Guide

### 1. Initialize in Your Component

```javascript
import { initializeDynamicTheme } from './utils/dynamicTheme';
import { initializeScrollAnimations } from './utils/scrollAnimations';
import { addCapabilityClasses, installPolyfills } from './utils/modernCSS';

useEffect(() => {
  // Setup dynamic theme sync
  const themeObserver = initializeDynamicTheme();
  
  // Setup scroll animations
  initializeScrollAnimations();
  
  // Feature detection
  installPolyfills();
  addCapabilityClasses();
  
  return () => themeObserver?.disconnect();
}, []);
```

---

## Phase 1: Texture & Depth

### Using Grain Texture

Add the `.glass` or `.glass-card` classes to elements that need premium texture:

```jsx
<div className="glass rounded-2xl p-4">
  Premium content here
</div>
```

**Customization:**
```css
/* Stronger grain for dark themes */
@media (prefers-color-scheme: dark) {
  .glass::before {
    opacity: 0.7;  /* Increase from 0.5 */
  }
}
```

### Creating Layered Shadows

The 6-layer shadow system is automatically applied. To customize:

```css
.custom-depth {
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.02),
    0 4px 8px rgba(0, 0, 0, 0.03),
    0 8px 16px rgba(0, 0, 0, 0.04),
    0 16px 32px rgba(0, 0, 0, 0.05),
    0 32px 64px rgba(0, 0, 0, 0.06),
    0 64px 128px rgba(0, 0, 0, 0.04);
}
```

---

## Phase 2: Motion & Animations

### Scroll-Linked Header

Add to your header component:

```jsx
<header data-scroll-header className="transition-all duration-300">
  <h1 data-scroll-title>My App</h1>
</header>
```

The header will automatically:
- Increase blur as user scrolls
- Scale title down smoothly
- Stay perfectly synced with scroll position

### Custom Scroll Animation

```javascript
import { initializeParallaxEffect, smoothScrollTo } from './utils/scrollAnimations';

// Add parallax to images
<img src="hero.jpg" data-parallax="0.5" />

// Smooth scroll on button click
<button onClick={() => smoothScrollTo(targetElement, 100)}>
  Scroll to target
</button>
```

### Spring Physics on Buttons

Automatically applied with `cubic-bezier(0.34, 1.56, 0.64, 1)`:

```jsx
<motion.button
  whileTap={{ scale: 0.9 }}
  style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
>
  Click me!
</motion.button>
```

**Create spring effect without Framer Motion:**
```css
button {
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
  transition-duration: 0.3s;
}

button:active {
  transform: scale(0.95);
}
```

### View Transitions

For page navigations:

```javascript
import { transitionToPage } from './utils/modernCSS';

const handleNavigate = async (page) => {
  await transitionToPage(() => {
    setCurrentPage(page);
  }, 'page-transition');
};
```

For specific elements:

```javascript
import { transitionElement } from './utils/modernCSS';

const handleCardClick = async (card) => {
  await transitionElement(cardRef.current, () => {
    showDetailView(card);
  }, 'card-morph');
};
```

---

## Phase 3: Container Queries & Layouts

### Create Responsive Component

```jsx
<div className="container-responsive task-grid">
  {tasks.map((task) => (
    <div key={task.id} className="task-item">
      {/* Content */}
    </div>
  ))}
</div>
```

**CSS automatically adapts:**
- **Narrow** (< 400px) → Single column list
- **Medium** (400-600px) → 2-3 column grid
- **Wide** (> 600px) → Bento layout

### Custom Container Queries

```css
.adaptive-card {
  container-type: inline-size;
}

@container (min-width: 300px) {
  .adaptive-card {
    display: grid;
    grid-template-columns: auto 1fr;
  }
}

@container (max-width: 299px) {
  .adaptive-card {
    display: flex;
    flex-direction: column;
  }
}
```

### Masked Progressive Blur

```jsx
<div className="masked-blur rounded-lg backdrop-blur-lg">
  Content with frosted glass effect
</div>
```

The mask automatically creates a gradient effect:
- Strong blur at top
- Transparent at bottom
- Perfectly smooth transition

---

## Phase 4: Dynamic Theme

### Change Theme by Category

```javascript
import { applyCategoryTheme, resetTheme } from './utils/dynamicTheme';

// When user selects a task category
const handleCategorySelect = (category) => {
  applyCategoryTheme(category);
  // Browser chrome color updates automatically!
};

// Navigate away
const handleNavigateHome = () => {
  resetTheme();
};
```

### Custom Category Colors

Extend in `dynamicTheme.js`:

```javascript
export const CATEGORY_COLORS = {
  'عبادات': '#6366F1',  // Indigo
  // Add more...
  'custom': '#FF5733',  // Your color
};
```

### Monitor Theme Changes

```javascript
import { getPrimaryColor, updateMetaTheme } from './utils/dynamicTheme';

const currentColor = getPrimaryColor();
console.log('Current theme:', currentColor);

// Manual update if needed
updateMetaTheme();
```

### In-Progress Task Glow

```jsx
<div className={`task-card ${task.inProgress ? 'task-in-progress' : ''}`}>
  {/* Task content */}
</div>
```

The glow automatically uses the primary color:

```css
.task-in-progress {
  box-shadow: 
    0 0 20px var(--primary),
    0 0 40px var(--primary);
}
```

---

## Phase 5: PWA Polish

### Navigation Dock

Already implemented in `Navigation.jsx`. Automatically:
- Floats at bottom with safe-area support
- Responds to notch/dynamic island
- Uses logical properties for RTL

### Safe Area Support

Use these classes for notch/safe-area awareness:

```jsx
<header className="pt-safe">
  Header with top safe-area padding
</header>

<footer className="pb-safe px-safe">
  Footer with bottom & horizontal safe-areas
</footer>
```

### Logical Properties (RTL-Aware)

Instead of `left/right/margin-left`:

```css
/* Bad - breaks in RTL */
.sidebar {
  margin-left: 20px;
}

/* Good - works in all directions */
.sidebar {
  margin-inline-start: 20px;
}
```

**Common translations:**
```css
left/right          → inline-start/inline-end
top/bottom          → block-start/block-end
margin-left/right   → margin-inline-start/end
padding-left/right  → padding-inline-start/end
```

### Custom Selection Styling

```jsx
<div className="interactive">
  Text will have intelligent selection highlighting
</div>
```

---

## Performance Tips

### 1. Defer Scroll Animations
```javascript
// Load after page is interactive
setTimeout(() => {
  initializeScrollAnimations();
}, 1000);
```

### 2. Lazy Load Theme System
```javascript
import { initializeDynamicTheme } from './utils/dynamicTheme';

// Only if user has viewing preferences
if (localStorage.getItem('theme-aware')) {
  initializeDynamicTheme();
}
```

### 3. Container Query Optimization
```css
/* Only container query when needed */
.task-grid {
  container-type: inline-size;
}

/* Not every nested element */
.task-item {
  /* Don't add container-type here */
}
```

### 4. Reduce Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Browser Compatibility Check

```javascript
import { getFeatureSupportSummary } from './utils/modernCSS';

const support = getFeatureSupportSummary();
console.table(support);
```

**Output:**
```
{
  viewTransitions: true,
  containerQueries: true,
  scrollTimeline: false,  // Fallback active
  maskImage: true,
  backdropFilter: true,
  conicGradient: true,
  logicalProperties: true
}
```

---

## Debugging

### Check Grain Texture
```javascript
// In DevTools console
document.querySelector('.glass::before').style.opacity = '0.5';
```

### Verify Theme Color
```javascript
const meta = document.querySelector('meta[name="theme-color"]');
console.log('Current theme color:', meta.getAttribute('content'));
```

### Test Container Queries
```javascript
import { debugContainerQueries } from './utils/modernCSS';
debugContainerQueries();
```

### Monitor Scroll State
```javascript
window.addEventListener('scroll', () => {
  console.log('Scroll progress:', window.scrollY / window.innerHeight);
});
```

---

## Common Issues & Solutions

### Issue: Grain too visible
**Solution:** Reduce opacity in `.glass::before` from 0.5 to 0.2

### Issue: Spring physics feels sluggish
**Solution:** Adjust easing: `cubic-bezier(0.25, 1.8, 0.5, 1)` for more bounce

### Issue: Container queries not working
**Solution:** Ensure `container-type: inline-size` is set, check browser support

### Issue: Theme color not updating
**Solution:** Call `updateMetaTheme()` after color change, check MutationObserver

### Issue: Navigation dock overlaps content
**Solution:** Add `pb-safe` to main content or use CSS `margin-block-end`

---

## Next Steps

1. Test on target devices (iOS, Android)
2. Measure performance with Lighthouse
3. Gather user feedback on spring physics feel
4. Adjust grain intensity based on device capabilities
5. Monitor browser support for new features
