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
  const hapticTriggeredRef = useRef(false);

  // Enhanced logarithmic rubberband formula: ultra-smooth resistance
  // Feels premium and organic, not robotic
  const calculateResistance = (movement) => {
    // More aggressive initial response, then smooth decay
    return (movement * 0.6) / (1 + (movement * 0.008));
  };

  // Reset bounce state when view changes (important for SPA)
  useEffect(() => {
    setPullY(0);
    setIsDragging(false);
    hapticTriggeredRef.current = false;
    
    // Scroll to top when switching views
    const pageWrapper = appShellRef.current?.querySelector('.page-wrapper');
    if (pageWrapper) {
      pageWrapper.scrollTop = 0;
    }
  }, [currentView]);

  // Global elastic bounce gesture - Optimized for SPA
  const bind = useGesture({
    onDrag: ({ movement: [, my], last, direction: [, dy], event, cancel }) => {
      // Detect scroll position in single page wrapper
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

        // Enhanced logarithmic resistance: premium smooth physics
        const stretchedY = calculateResistance(my);
        setPullY(stretchedY);

        // Single haptic trigger at optimal stretch point (not repeated)
        if (stretchedY >= 25 && !hapticTriggeredRef.current) {
          hapticTriggeredRef.current = true;
          triggerHaptic(8); // Stronger haptic for premium feel
        }
      }

      // On release, trigger spring animation back to zero
      if (last) {
        setIsDragging(false);
        hapticTriggeredRef.current = false; // Reset for next gesture
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
      {/* Global Elastic Bounce Shell with Enhanced Cinematic Effects */}
      <motion.div
        animate={{
          y: !isDragging ? 0 : pullY,
          scale: !isDragging ? 1 : Math.max(0.97, 1 - pullY * 0.008), // Stronger scale effect
          boxShadow: !isDragging
            ? '0 0 0 rgba(0, 0, 0, 0)'
            : `0 ${Math.min(pullY * 0.6, 25)}px ${Math.min(pullY * 2, 60)}px rgba(0, 0, 0, ${Math.min(pullY * 0.025, 0.4)})` // Enhanced depth shadow
        }}
        transition={isDragging ? { type: 'tween', duration: 0 } : { type: 'spring', stiffness: 140, damping: 22 }} // Even smoother spring
        style={{ 
          height: '100%', 
          transformOrigin: 'center top', 
          position: 'relative', 
          zIndex: 10,
          WebkitUserSelect: 'none',
          userSelect: 'none'
        }}
      >
        {/* Single page wrapper - optimized for SPA */}
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
