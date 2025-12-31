/**
 * Dynamic Theme Manager
 * Phase 4: Syncs CSS var(--primary) color with <meta name="theme-color"> in real-time
 * Creates a premium native-app-like experience with responsive browser chrome
 * Light Mode Only: Removed all dark mode detection
 */

export const initializeDynamicTheme = () => {
  // Get or create theme-color meta tag
  let metaTheme = document.querySelector('meta[name="theme-color"]');
  if (!metaTheme) {
    metaTheme = document.createElement('meta');
    metaTheme.name = 'theme-color';
    document.head.appendChild(metaTheme);
  }

  // Initialize with light theme color
  updateMetaTheme();

  // Watch for changes to CSS variables
  // Option 1: Use MutationObserver for style changes
  const observer = new MutationObserver(() => {
    updateMetaTheme();
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['style', 'class'],
  });

  return observer;
};

/**
 * Update meta theme-color based on current CSS variable
 */
export const updateMetaTheme = () => {
  const computedStyle = getComputedStyle(document.documentElement);
  const primaryColor = computedStyle.getPropertyValue('--primary').trim();

  // Convert hex to proper format if needed
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme && primaryColor) {
    metaTheme.setAttribute('content', primaryColor);
  }
};

/**
 * Change primary color dynamically
 * Useful for category-specific theming
 */
export const changePrimaryColor = (color) => {
  document.documentElement.style.setProperty('--primary', color);
  updateMetaTheme();
};

/**
 * Get current primary color as hex string
 */
export const getPrimaryColor = () => {
  const computedStyle = getComputedStyle(document.documentElement);
  return computedStyle.getPropertyValue('--primary').trim();
};

/**
 * Category color mapping with dynamic meta theme sync
 */
export const CATEGORY_COLORS = {
  'عبادات': '#5856D6',
  'علم': '#30B0C7',
  'عمل': '#8E8E93',
  'أسرة': '#FF2D55',
  'نفس': '#FF9500',
  'خير': '#34C759',
};

/**
 * Apply category theme to browser chrome
 */
export const applyCategoryTheme = (category) => {
  const color = CATEGORY_COLORS[category];
  if (color) {
    changePrimaryColor(color);
  }
};

/**
 * Reset to default light theme
 */
export const resetTheme = () => {
  changePrimaryColor('#007AFF');
};
