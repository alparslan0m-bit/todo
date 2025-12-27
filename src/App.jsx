/**
 * App Component - True Single Page Application
 * No routing, no URL changes - pure internal state management
 * Single URL + internal view state = native app feel + perfect elastic bounce
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
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

  // Logarithmic rubberband formula: smooth, natural resistance
  const calculateResistance = (movement) => {
    return (movement * 0.5) / (1 + (movement * 0.005));
  };

  // Global elastic bounce gesture - Single page, simple scroll detection
  const bind = useGesture({
    onDrag: ({ movement: [, my], last, direction: [, dy], event, cancel }) => {
      // Simple single-page scroll detection
      const pageWrapper = appShellRef.current?.querySelector('.page-wrapper');
      const isAtTop = pageWrapper?.scrollTop === 0;

      // Cancel guard: if not at top OR dragging upward, let normal scrolling happen
      if (!isAtTop || dy < 0) {
        cancel();
        return;
      }

      // Only allow pull-down when at top of scroll
      if (isAtTop && dy > 0 && !last) {
        event.preventDefault();
        setIsDragging(true);

        // Logarithmic resistance: smooth, natural, Apple-authentic physics
        const stretchedY = calculateResistance(my);
        setPullY(stretchedY);

        // Haptic feedback at ~35px max stretch (gentle trigger point)
        if (stretchedY >= 35 * 0.7) {
          triggerHaptic(5);
        }
      }

      // On release, trigger spring animation back to zero
      if (last) {
        setIsDragging(false);
      }
    },
  });

  if (!appReady) {
    return <SplashScreen onComplete={() => { }} />;
  }

  // Render the appropriate view based on currentView state (no routing)
  const renderView = () => {
    switch (currentView) {
      case 'add':
        return <AddTask setCurrentView={setCurrentView} />;
      case 'settings':
        return <Settings setCurrentView={setCurrentView} />;
      case 'home':
      default:
        return <Dashboard onShowModal={() => setShowModal(true)} setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="app-viewport" dir="rtl" ref={appShellRef} {...bind()}>
      {/* Global Elastic Bounce Shell with Cinematic Effects */}
      <motion.div
        animate={{
          y: !isDragging ? 0 : pullY,
          scale: !isDragging ? 1 : Math.max(0.98, 1 - pullY * 0.005), // 0.98 scale at max pull
          boxShadow: !isDragging
            ? '0 0 0 rgba(0, 0, 0, 0)'
            : `0 ${Math.min(pullY * 0.5, 20)}px ${Math.min(pullY * 1.5, 40)}px rgba(0, 0, 0, ${Math.min(pullY * 0.02, 0.3)})` // Dynamic shadow
        }}
        transition={isDragging ? { type: 'tween', duration: 0 } : { type: 'spring', stiffness: 150, damping: 20 }} // Softer spring for buttery settle
        style={{ height: '100%', transformOrigin: 'center top', position: 'relative', zIndex: 10 }}
      >
        {/* Single page wrapper - no animation, no routes */}
        <div className="page-wrapper">
          <div className="font-arabic text-text-main">
            {renderView()}
          </div>
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
