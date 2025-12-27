/**
 * App Component
 * Main application component with routing and state management
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Dashboard from './components/Dashboard';
import AddTask from './components/AddTask';
import Settings from './components/Settings';
import Navigation from './components/Navigation';
import TaskModal from './components/TaskModal';
import SplashScreen from './components/SplashScreen';
import InstallPrompt from './components/InstallPrompt';
import UpdateToast from './components/UpdateToast';
import { TaskProvider } from './context/TaskContext';
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
  const [isMounted, setIsMounted] = useState(false);
  const [direction, setDirection] = useState(0);
  const [prevDepth, setPrevDepth] = useState(0);

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
    <div className="app-viewport" dir="rtl">
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
