/**
 * App Component
 * Main application component with routing and state management
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Dashboard from './components/Dashboard';
import AddTask from './components/AddTask';
import Settings from './components/Settings';
import Navigation from './components/Navigation';
import TaskModal from './components/TaskModal';
import SplashScreen from './components/SplashScreen';
import InstallPrompt from './components/InstallPrompt';
import { initializeStorage } from './utils/storage';
import { initializeDynamicTheme, resetTheme } from './utils/dynamicTheme';
import { initializeScrollAnimations, initializeRevealOnScroll } from './utils/scrollAnimations';
import { addCapabilityClasses, installPolyfills } from './utils/modernCSS';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
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
    
    // Simulate app initialization
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      if (themeObserver) {
        themeObserver.disconnect();
      }
    };
  }, []);

  // Navigation handler with theme reset and view transitions
  const handleNavigate = (page) => {
    if (page === currentPage) return;

    // Phase 2: Use View Transitions API for smooth page morphing
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        // Reset theme and navigate
        resetTheme();
        setCurrentPage(page);
        window.scrollTo(0, 0);
      });
    } else {
      // Fallback for browsers without View Transitions API
      resetTheme();
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'add':
        return <AddTask onNavigateDashboard={() => handleNavigate('dashboard')} />;
      case 'settings':
        return <Settings onNavigateDashboard={() => handleNavigate('dashboard')} />;
      case 'dashboard':
      default:
        return (
          <Dashboard
            onNavigateToAdd={() => handleNavigate('add')}
            onShowModal={() => setShowModal(true)}
          />
        );
    }
  };

  if (!appReady) {
    return <SplashScreen onComplete={() => setAppReady(true)} />;
  }

  return (
    <div className="min-h-screen font-arabic text-text-main" dir="rtl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      <TaskModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <InstallPrompt />
    </div>
  );
}

export default App;
