/**
 * Scroll-Linked Animations Manager
 * Phase 2: Implements scroll-timeline effects for header blur/scale sync
 * Creates smooth, physics-based scroll-linked animations
 */

export const initializeScrollAnimations = () => {
  // Check for CSS scroll-timeline support
  const hasScrollTimeline = CSS.supports('animation-timeline: scroll()');

  if (hasScrollTimeline) {
    initializeNativeScrollTimeline();
  } else {
    initializeJavaScriptScrollAnimations();
  }
};

/**
 * Native CSS scroll-timeline implementation (cutting-edge)
 */
const initializeNativeScrollTimeline = () => {
  const style = document.createElement('style');
  style.textContent = `
    @supports (animation-timeline: scroll()) {
      .scroll-header {
        animation: headerShift linear;
        animation-timeline: view();
      }

      @keyframes headerShift {
        0% {
          background-color: var(--primary);
          backdrop-filter: blur(0px);
          transform: translateY(0);
        }
        100% {
          background-color: var(--primary);
          backdrop-filter: blur(20px);
          transform: translateY(-10px);
        }
      }

      .scroll-title {
        animation: titleScale linear;
        animation-timeline: view();
      }

      @keyframes titleScale {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        100% {
          transform: scale(0.8);
          opacity: 0.8;
        }
      }
    }
  `;
  document.head.appendChild(style);
};

/**
 * JavaScript fallback for scroll-linked animations
 */
const initializeJavaScriptScrollAnimations = () => {
  const header = document.querySelector('[data-scroll-header]');
  const title = document.querySelector('[data-scroll-title]');

  if (!header && !title) return;

  let ticking = false;

  const updateScrollAnimations = () => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

    // Header blur animation
    if (header) {
      const blurAmount = Math.min(scrollY / 100, 20);
      const slideAmount = Math.min(scrollY / 10, 10);

      header.style.backdropFilter = `blur(${blurAmount}px)`;
      header.style.webkitBackdropFilter = `blur(${blurAmount}px)`;
      header.style.transform = `translateY(-${slideAmount}px)`;
    }

    // Title scale animation
    if (title) {
      const scale = Math.max(1 - scrollProgress * 0.2, 0.8);
      const opacity = Math.max(1 - scrollProgress * 0.2, 0.8);

      title.style.transform = `scale(${scale})`;
      title.style.opacity = opacity;
    }

    ticking = false;
  };

  const requestScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollAnimations);
      ticking = true;
    }
  };

  window.addEventListener('scroll', requestScroll, { passive: true });
  
  // Initial call
  updateScrollAnimations();
};

/**
 * Parallax scroll effect utility
 * Use on elements with data-parallax attribute
 */
export const initializeParallaxEffect = () => {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length === 0) return;

  let ticking = false;

  const updateParallax = () => {
    parallaxElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const speed = parseFloat(element.dataset.parallax) || 0.5;
      const yPos = -(rect.top * speed);

      element.style.transform = `translateY(${yPos}px)`;
    });

    ticking = false;
  };

  const requestParallax = () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  window.addEventListener('scroll', requestParallax, { passive: true });
  updateParallax();
};

/**
 * Reveal on scroll animation
 * Elements fade in as they enter viewport
 */
export const initializeRevealOnScroll = () => {
  const revealElements = document.querySelectorAll('[data-reveal]');

  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealElements.forEach((element) => observer.observe(element));
};

/**
 * Smooth scroll to element with spring easing
 */
export const smoothScrollTo = (element, offset = 0) => {
  if (!element) return;

  const targetPosition = element.offsetTop - offset;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  const duration = 1000;
  let start = null;

  const easeOutQuad = (t) => t * (2 - t);

  const animation = (currentTime) => {
    if (start === null) start = currentTime;
    const elapsed = currentTime - start;
    const run = easeOutQuad(elapsed / duration);

    window.scrollTo(0, startPosition + distance * run);

    if (elapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

export default {
  initializeScrollAnimations,
  initializeParallaxEffect,
  initializeRevealOnScroll,
  smoothScrollTo,
};
