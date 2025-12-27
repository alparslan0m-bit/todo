/**
 * App Component
 * Main application component with routing and state management
 * Global Elastic Bounce Shell: Universal Apple-native physics across all pages
 */

import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useGesture } from '@use-gesture/react';
import Dashboard from './components/Dashboard';
import AddTask from './components/AddTask';
import Settings from './components/Settings';
import Navigation from './components/Navigation';
import TaskModal from './components/TaskModal';
import SplashScreen from './components/SplashScreen';
import InstallPrompt from './components/InstallPrompt';
import UpdateToast from './components/UpdateToast';
import { TaskProvider } from './context/TaskContext';
import { useHaptic } from './hooks/useHaptic';
import { initializeStorage } from './utils/storage';
import { initializeDynamicTheme, resetTheme } from './utils/dynamicTheme';
import { initializeScrollAnimations, initializeRevealOnScroll } from './utils/scrollAnimations';
import { addCapabilityClasses, installPolyfills } from './utils/modernCSS';
import './index.css';

// Route depth mapping for directional transitions
const ROUTE_DEPTH = {
  '/': 0,
  '/add': 1,
  '/settings': 1,
};

// Inner component that uses routing
const AppContent = ({ showModal, setShowModal, appReady }) => {
  const location = useLocation();
  const { triggerHaptic } = useHaptic();
  const [isMounted, setIsMounted] = useState(false);
  const [direction, setDirection] = useState(0);
  const [prevDepth, setPrevDepth] = useState(0);
  const [pullY, setPullY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const appShellRef = useRef(null);

  // Non-linear resistance curve: diminishing returns as you pull harder
  const calculateResistance = (movement) => {
    if (movement < 20) {
      return movement * 1.0; // 0-20px: full movement
    } else if (movement < 50) {
      return 20 + (movement - 20) * 0.5; // 20-50px: half movement
    } else {
      return 35 + (movement - 50) * 0.2; // 50+px: 20% movement (max resistance)
    }
  };

  // Global elastic bounce shell - works across all pages
  const bind = useGesture({
    onDrag: ({ movement: [, my], last, direction: [, dy], event, cancel }) => {
      // Get the active page wrapper
      const pageWrapper = appShellRef.current?.querySelector('.page-wrapper');
      const isAtTop = pageWrapper?.scrollTop === 0;

      // Cancel guard: if not at top OR dragging upward, let normal scrolling happen
      if (!isAtTop || dy < 0) {
        cancel();
        return;
      }

      // Only allow pull-down when at top of scroll across all pages
      if (isAtTop && dy > 0 && !last) {
        event.preventDefault();
        setIsDragging(true);

        // Non-linear resistance: easy at start, harder at end (Apple-like)
        const stretchedY = calculateResistance(my);
        setPullY(stretchedY);

        // Haptic feedback at 70% max stretch (107px pulls = 50px UI)
        if (stretchedY >= 50 * 0.7) {
          triggerHaptic(5);
        }
      }

      // On release, trigger spring animation back to zero
      if (last) {
        setIsDragging(false);
      }
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Track navigation direction based on route depth
  useEffect(() => {
    if (!isMounted) return;

    const currentDepth = ROUTE_DEPTH[location.pathname] || 0;
    setDirection(currentDepth > prevDepth ? 1 : -1); // 1 = push (right), -1 = pop (left)
    setPrevDepth(currentDepth);

    // Reset theme only when navigating to home
    if (location.pathname === '/') {
      resetTheme();
      window.scrollTo(0, 0);
    }
  }, [location.pathname, isMounted, prevDepth]);

  // Page transition variants with directional animation and z-index orchestration
  const pageVariants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100,  // Push: slide from right, Pop: slide from left
      zIndex: direction > 0 ? 2 : 0,  // Push: bring to front, Pop: stay behind
    }),
    animate: {
      opacity: 1,
      x: 0,
      zIndex: 2,  // Active page is always on top
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        zIndex: { duration: 0 },  // z-index change is instant
      },
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction > 0 ? -50 : 100,  // Push: fade out left, Pop: slide out right
      zIndex: direction > 0 ? 0 : 2,  // Push: go behind, Pop: stay on top to slide away
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        zIndex: { duration: 0 },
      },
    }),
  };

  if (!appReady) {
    return <SplashScreen onComplete={() => { }} />;
  }

  return (
    <div className="app-viewport" dir="rtl" ref={appShellRef} {...bind()}>
      {/* Global Elastic Bounce Shell - applies to entire app */}
      <motion.div
        animate={{ y: !isDragging ? 0 : pullY }}
        transition={isDragging ? { type: 'tween', duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
        style={{ height: '100%' }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={location.pathname}
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="page-wrapper"
          >
          <div className="font-arabic text-text-main">
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    onShowModal={() => setShowModal(true)}
                  />
                }
              />
              <Route path="/add" element={<AddTask />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </motion.div>
        </AnimatePresence>
        <Navigation />
        <TaskModal isOpen={showModal} onClose={() => setShowModal(false)} />
        <InstallPrompt />
        <UpdateToast />
      </motion.div>
    </div>
  );
};

// Outer App component that sets up providers
function App() {
  const [showModal, setShowModal] = useState(false);
  const [appReady, setAppReady] = useState(false);

  // Initialize storage and modern CSS features on app load
  useEffect(() => {
    initializeStorage();

    // Phase 4: Initialize dynamic theme synchronization
    const themeObserver = initializeDynamicTheme();

    // Phase 2: Initialize scroll-linked animations
    initializeScrollAnimations();
    initializeRevealOnScroll();

    // Modern CSS feature detection and polyfills
    installPolyfills();
    addCapabilityClasses();

    // Set app ready immediately after initialization (removed 3-second delay)
    setAppReady(true);

    // Phase IV: Listen for app installation
    const handleAppInstalled = () => {
      console.log('[PWA] App installed successfully');
      // Clear any temporary state, sync data, show welcome screen, etc.
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CACHE_UPDATE'
        });
      }
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (themeObserver) {
        themeObserver.disconnect();
      }
    };
  }, []);

  return (
    <Router>
      <TaskProvider>
        <AppContent showModal={showModal} setShowModal={setShowModal} appReady={appReady} />
      </TaskProvider>
    </Router>
  );
}

export default App;
