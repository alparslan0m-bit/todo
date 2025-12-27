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

  // Page transition variants with directional animation
  const pageVariants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100,  // Push: slide from right, Pop: slide from left
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction > 0 ? -50 : 100,  // Push: fade out left, Pop: slide out right
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  if (!appReady) {
    return <SplashScreen onComplete={() => {}} />;
  }

  return (
    <div className="min-h-screen font-arabic text-text-main" dir="rtl">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={location.pathname}
          custom={direction}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
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
        </motion.div>
      </AnimatePresence>
      <Navigation />
      <TaskModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <InstallPrompt />
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
    
    return () => {
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
