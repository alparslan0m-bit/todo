/**
 * App Component - True Single Page Application
 * No routing, no URL changes - pure internal state management
 * Single URL + internal view state = native app feel + native iOS elastic bounce
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { initializeDynamicTheme } from './utils/dynamicTheme';
import { initializeScrollAnimations, initializeRevealOnScroll } from './utils/scrollAnimations';
import { addCapabilityClasses, installPolyfills } from './utils/modernCSS';
import './index.css';

// Inner component - Single Page View Management (no React Router)
// Uses native iOS scrolling with elastic bounce - no custom gestures needed
const AppContent = ({ showModal, setShowModal, appReady, currentView, setCurrentView }) => {
  const appShellRef = useRef(null);

  if (!appReady) {
    return <SplashScreen onComplete={() => { }} />;
  }

  return (
    <div className="app-viewport" dir="rtl" ref={appShellRef}>
      <div
        className="flex-1 flex flex-col relative overflow-hidden"
        style={{ backgroundColor: 'var(--bg-system)' }}
      >
        <div className="page-wrapper no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: currentView === 'home' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: currentView === 'home' ? 20 : -20 }}
              transition={{
                duration: 0.35,
                ease: [0.32, 0.72, 0, 1] // Apple's default ease curve
              }}
              className="min-h-full"
            >
              {currentView === 'add' && <AddTask setCurrentView={setCurrentView} />}
              {currentView === 'settings' && <Settings setCurrentView={setCurrentView} />}
              {currentView === 'home' && <Dashboard onShowModal={() => setShowModal(true)} setCurrentView={setCurrentView} />}
            </motion.div>
          </AnimatePresence>
        </div>
        <Navigation currentView={currentView} setCurrentView={setCurrentView} />
        <TaskModal isOpen={showModal} onClose={() => setShowModal(false)} />
        <InstallPrompt />
        <UpdateToast />
      </div>
    </div>
  );
};

// Outer App component that sets up providers
function App() {
  const [showModal, setShowModal] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // Internal state for view management

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

    // Set app ready immediately after initialization
    setAppReady(true);

    // Phase IV: Listen for app installation
    const handleAppInstalled = () => {
      console.log('[PWA] App installed successfully');
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
    <TaskProvider>
      <AppContent
        showModal={showModal}
        setShowModal={setShowModal}
        appReady={appReady}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
    </TaskProvider>
  );
}

export default App;
