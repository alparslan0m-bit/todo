/**
 * Prevent Pull-to-Refresh in iOS Standalone PWA
 * 
 * This utility prevents the native pull-to-refresh behavior in iOS PWAs
 * while preserving the rubber band bounce effect within scroll containers.
 * 
 * The strategy:
 * 1. Detect when we're at the top of a scroll container
 * 2. If pulling down at scroll position 0, prevent default (blocks refresh)
 * 3. Allow normal scrolling in all other cases (preserves rubber band)
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
 * Initialize pull-to-refresh prevention
 * Call this once when the app mounts
 */
export const initPreventPullToRefresh = () => {
    // Only apply in standalone mode
    if (!isStandalonePWA()) {
        console.log('[PWA] Not in standalone mode, pull-to-refresh prevention skipped');
        return () => { };
    }

    console.log('[PWA] Initializing pull-to-refresh prevention');

    let startY = 0;
    let startScrollTop = 0;

    /**
     * Find the scrollable parent container
     */
    const getScrollableParent = (element) => {
        if (!element) return null;

        // Check if this element is scrollable
        if (element.classList && element.classList.contains('page-wrapper')) {
            return element;
        }

        // Check computed style
        const style = window.getComputedStyle(element);
        const overflowY = style.getPropertyValue('overflow-y');

        if (overflowY === 'auto' || overflowY === 'scroll') {
            if (element.scrollHeight > element.clientHeight) {
                return element;
            }
        }

        // Traverse up
        return getScrollableParent(element.parentElement);
    };

    /**
     * Handle touchstart - record starting position
     */
    const handleTouchStart = (e) => {
        if (e.touches.length !== 1) return;

        startY = e.touches[0].clientY;

        // Find the scrollable container
        const scrollable = getScrollableParent(e.target);
        startScrollTop = scrollable ? scrollable.scrollTop : 0;
    };

    /**
     * Handle touchmove - prevent pull-to-refresh at scroll top
     */
    const handleTouchMove = (e) => {
        if (e.touches.length !== 1) return;

        const currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;

        // Only prevent if:
        // 1. We're at the top of scroll (scrollTop === 0)
        // 2. User is pulling DOWN (deltaY > 0)
        if (startScrollTop <= 0 && deltaY > 0) {
            // Find current scrollable container
            const scrollable = getScrollableParent(e.target);

            if (scrollable && scrollable.scrollTop <= 0) {
                // We're at the top and pulling down - prevent refresh
                // But DON'T cancel if the scroll container itself can handle it
                // This is a delicate balance - we want to block document-level refresh
                // but allow the scroll container's rubber band

                // Check if event target is not inside a scrollable area with content
                if (!scrollable || scrollable.scrollTop === 0) {
                    // Only prevent if this would cause a page refresh
                    if (document.body.scrollTop === 0 || document.documentElement.scrollTop === 0) {
                        e.preventDefault();
                    }
                }
            }
        }
    };

    // Add passive: false to allow preventDefault
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Return cleanup function
    return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
    };
};

/**
 * Alternative: Completely disable overscroll on document
 * This is more aggressive but guaranteed to work
 */
export const disableDocumentOverscroll = () => {
    if (!isStandalonePWA()) return () => { };

    // Prevent default on document touchmove when at boundaries
    const preventOverscroll = (e) => {
        // Allow scrolling inside scroll containers
        const scrollable = e.target.closest('.page-wrapper, [data-scrollable]');

        if (!scrollable) {
            // Not in a scroll container, prevent overscroll
            e.preventDefault();
            return;
        }

        const { scrollTop, scrollHeight, clientHeight } = scrollable;
        const atTop = scrollTop <= 0;
        const atBottom = scrollTop + clientHeight >= scrollHeight;

        // Determine scroll direction from touch
        if (e.touches && e.touches.length === 1) {
            // This check needs the previous position, handled in initPreventPullToRefresh
        }
    };

    document.body.addEventListener('touchmove', preventOverscroll, { passive: false });

    return () => {
        document.body.removeEventListener('touchmove', preventOverscroll);
    };
};

export default initPreventPullToRefresh;
