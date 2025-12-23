/**
 * Dynamic Theme Manager
 * Phase 4: Syncs CSS var(--primary) color with <meta name="theme-color"> in real-time
 * Creates a premium native-app-like experience with responsive browser chrome
 */

export const initializeDynamicTheme = () => {
  // Get or create theme-color meta tag
  let metaTheme = document.querySelector('meta[name="theme-color"]');
  if (!metaTheme) {
    metaTheme = document.createElement('meta');
    metaTheme.name = 'theme-color';
    document.head.appendChild(metaTheme);
  }

  // Initialize with current primary color
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

  // Option 2: Watch for system theme changes
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  prefersDark.addEventListener('change', () => {
    updateMetaTheme();
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
  'عبادات': '#6366F1', // Indigo
  'علم': '#14B8A6',    // Teal
  'عمل': '#64748B',    // Slate
  'أسرة': '#F43F5E',   // Rose
  'نفس': '#F59E0B',    // Amber
  'خير': '#10B981',    // Emerald
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
 * Reset to default theme
 */
export const resetTheme = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultColor = prefersDark ? '#4ADE80' : '#1A4D2E';
  changePrimaryColor(defaultColor);
};
