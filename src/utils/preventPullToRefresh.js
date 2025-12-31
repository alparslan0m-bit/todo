/**
 * Prevent Pull-to-Refresh in iOS Standalone PWA
 * 
 * Note: Modern iOS handles this well with CSS `overscroll-behavior-y: contain`
 * This file now only adds a body class for CSS targeting and logs status.
 * 
 * The actual prevention is done via CSS in index.css:
 * - overscroll-behavior-y: contain on .page-wrapper
 * - This allows rubber band bounce but blocks refresh navigation
 */

/**
 * Check if running as standalone iOS PWA
 */
export const isStandalonePWA = () => {
    // iOS standalone mode
    const isIOSStandalone = window.navigator.standalone === true;

    // Android/Chrome standalone mode
    const isStandaloneDisplayMode = window.matchMedia('(display-mode: standalone)').matches;

    return isIOSStandalone || isStandaloneDisplayMode;
};

/**
 * Initialize PWA mode detection
 * Adds classes to body for CSS targeting - no touch event blocking
 */
export const initPreventPullToRefresh = () => {
    const isStandalone = isStandalonePWA();

    if (isStandalone) {
        console.log('[PWA] Running in standalone mode - CSS will handle pull-to-refresh prevention');
        document.body.classList.add('standalone-pwa');
        document.documentElement.classList.add('standalone-pwa');
    } else {
        console.log('[PWA] Running in browser mode');
        document.body.classList.add('browser-mode');
    }

    // Return cleanup function
    return () => {
        document.body.classList.remove('standalone-pwa', 'browser-mode');
        document.documentElement.classList.remove('standalone-pwa');
    };
};

export default initPreventPullToRefresh;
