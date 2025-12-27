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

// Inner component that uses routing
const AppContent = ({ showModal, setShowModal, appReady }) => {
  const location = useLocation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset theme only when navigating between specific routes
  useEffect(() => {
    // Only reset theme on route changes, not on initial mount
    if (isMounted && location.pathname === '/') {
      resetTheme();
      window.scrollTo(0, 0);
    }
  }, [location.pathname, isMounted]);

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  if (!appReady) {
    return <SplashScreen onComplete={() => {}} />;
  }

  return (
    <div className="min-h-screen font-arabic text-text-main" dir="rtl">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
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
