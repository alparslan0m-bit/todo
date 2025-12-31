/**
 * App Component - True Single Page Application
 * No routing, no URL changes - pure internal state management
 * Single URL + internal view state = native app feel + perfect elastic bounce
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// Inner component - Single Page View Management (no React Router)
const AppContent = ({ showModal, setShowModal, appReady, currentView, setCurrentView }) => {
  const { triggerHaptic } = useHaptic();
  const [pullY, setPullY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const appShellRef = useRef(null);
  const hapticTriggeredRef = useRef(false);

  // Optimized Apple Rubberband Physics
  const calculateResistance = (movement) => {
    return (movement * 0.5) / (1 + (movement * 0.007));
  };

  useEffect(() => {
    setPullY(0);
    setIsDragging(false);
    hapticTriggeredRef.current = false;
  }, [currentView]);

  const bind = useGesture({
    onDrag: ({ movement: [, my], last, direction: [, dy], event, cancel }) => {
      const pageWrapper = appShellRef.current?.querySelector('.page-wrapper');
      const isAtTop = pageWrapper?.scrollTop === 0;

      if (!isAtTop || dy < 0) {
        if (isDragging) setIsDragging(false);
        return;
      }

      if (isAtTop && dy > 0 && !last) {
        event.preventDefault();
        setIsDragging(true);
        const stretchedY = calculateResistance(my);
        setPullY(stretchedY);

        if (stretchedY >= 35 && !hapticTriggeredRef.current) {
          hapticTriggeredRef.current = true;
          triggerHaptic(10);
        }
      }

      if (last) {
        setIsDragging(false);
        hapticTriggeredRef.current = false;
      }
    },
  });

  if (!appReady) {
    return <SplashScreen onComplete={() => { }} />;
  }

  return (
    <div className="app-viewport" dir="rtl" ref={appShellRef} {...bind()}>
      <motion.div
        className="flex-1 flex flex-col relative overflow-hidden"
        animate={{
          y: !isDragging ? 0 : pullY,
          scale: !isDragging ? 1 : Math.max(0.96, 1 - pullY * 0.0005),
          borderRadius: !isDragging ? '0px' : '38px',
        }}
        transition={isDragging ? { type: 'tween', duration: 0 } : { type: 'spring', damping: 25, stiffness: 200 }}
        style={{ transformOrigin: 'center top', backgroundColor: 'var(--bg-system)' }}
      >
        <div className="page-wrapper no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
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
      </motion.div>
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
