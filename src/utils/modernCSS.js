/**
 * Modern CSS Features Detection & Polyfills
 * Phase 2 & 3: View Transitions API and Container Queries support
 */

/**
 * Detect browser support for modern CSS features
 */
export const featureSupport = {
  viewTransitions: () => {
    return document.startViewTransition !== undefined;
  },

  containerQueries: () => {
    return CSS.supports('container-type: inline-size');
  },

  scrollTimeline: () => {
    return CSS.supports('animation-timeline: scroll()');
  },

  maskImage: () => {
    return CSS.supports('mask-image: linear-gradient(to bottom, black, transparent)');
  },

  backdropFilter: () => {
    return CSS.supports('backdrop-filter: blur(10px)') ||
           CSS.supports('-webkit-backdrop-filter: blur(10px)');
  },

  conicGradient: () => {
    return CSS.supports('background: conic-gradient(from 0deg, red, blue)');
  },

  logicalProperties: () => {
    return CSS.supports('padding-inline-start: 1rem');
  },
};

/**
 * Enhanced page transition with View Transitions API
 * Provides smooth morphing between page states
 */
export const transitionToPage = async (callback, name = 'page-transition') => {
  if (featureSupport.viewTransitions()) {
    try {
      document.documentElement.style.viewTransitionName = name;
      
      await new Promise((resolve) => {
        if (!document.startViewTransition) {
          callback();
          resolve();
          return;
        }

        const transition = document.startViewTransition(() => {
          callback();
        });

        transition.finished.finally(() => {
          document.documentElement.style.viewTransitionName = 'none';
          resolve();
        });
      });
    } catch (e) {
      console.warn('View transition failed, falling back to standard transition', e);
      callback();
    }
  } else {
    callback();
  }
};

/**
 * Transition a specific element (like a task card)
 */
export const transitionElement = async (element, callback, name = 'element-transition') => {
  if (featureSupport.viewTransitions()) {
    try {
      element.style.viewTransitionName = name;

      const transition = document.startViewTransition(() => {
        callback();
      });

      await transition.finished;
      element.style.viewTransitionName = 'none';
    } catch (e) {
      console.warn('Element transition failed', e);
      callback();
    }
  } else {
    callback();
  }
};

/**
 * Setup viewport-based element detection
 * Useful for debugging container queries
 */
export const debugContainerQueries = () => {
  if (!featureSupport.containerQueries()) {
    console.warn('Container Queries not supported - layout may not be responsive');
    return;
  }

  const containerElements = document.querySelectorAll('[style*="container-type"]');
  console.log(`Found ${containerElements.length} container elements`, containerElements);

  containerElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    console.log('Container:', el, {
      width: rect.width,
      height: rect.height,
      type: window.getComputedStyle(el).containerType,
    });
  });
};

/**
 * Polyfill for older browsers missing certain features
 */
export const installPolyfills = () => {
  // View Transitions polyfill indicator
  if (!featureSupport.viewTransitions()) {
    console.info('View Transitions API not available - using fallback animations');
  }

  // Container Queries polyfill indicator
  if (!featureSupport.containerQueries()) {
    console.info('Container Queries not available - using media queries');
  }

  // Add data attributes for feature detection in CSS
  const root = document.documentElement;
  
  if (featureSupport.viewTransitions()) {
    root.dataset.supportsViewTransitions = 'true';
  }
  
  if (featureSupport.containerQueries()) {
    root.dataset.supportsContainerQueries = 'true';
  }
  
  if (featureSupport.scrollTimeline()) {
    root.dataset.supportsScrollTimeline = 'true';
  }

  if (featureSupport.maskImage()) {
    root.dataset.supportsMaskImage = 'true';
  }
};

/**
 * Get feature support summary
 */
export const getFeatureSupportSummary = () => {
  return {
    viewTransitions: featureSupport.viewTransitions(),
    containerQueries: featureSupport.containerQueries(),
    scrollTimeline: featureSupport.scrollTimeline(),
    maskImage: featureSupport.maskImage(),
    backdropFilter: featureSupport.backdropFilter(),
    conicGradient: featureSupport.conicGradient(),
    logicalProperties: featureSupport.logicalProperties(),
  };
};

/**
 * Browser capability class for conditional styling
 */
export const addCapabilityClasses = () => {
  const support = getFeatureSupportSummary();
  const root = document.documentElement;

  if (support.viewTransitions) root.classList.add('supports-view-transitions');
  if (support.containerQueries) root.classList.add('supports-container-queries');
  if (support.scrollTimeline) root.classList.add('supports-scroll-timeline');
  if (support.maskImage) root.classList.add('supports-mask-image');
  if (support.backdropFilter) root.classList.add('supports-backdrop-filter');
  if (support.conicGradient) root.classList.add('supports-conic-gradient');
  if (support.logicalProperties) root.classList.add('supports-logical-properties');
};

export default {
  featureSupport,
  transitionToPage,
  transitionElement,
  debugContainerQueries,
  installPolyfills,
  getFeatureSupportSummary,
  addCapabilityClasses,
};
