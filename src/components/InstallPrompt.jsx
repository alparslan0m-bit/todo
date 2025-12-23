/**
 * InstallPrompt Component
 * Beautiful, non-intrusive install prompt for PWA
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing
      e.preventDefault();
      // Stash the event for later use
      setDeferredPrompt(e);
      // Show custom install prompt after a short delay
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app is already installed
    if (window.navigator.standalone === true) {
      setShowPrompt(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && deferredPrompt && (
        <motion.div
          className="fixed bottom-24 left-4 right-4 z-40 md:left-auto md:right-8 md:w-80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 400 }}
        >
          <div className="glass rounded-2xl p-4 shadow-xl">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <motion.div
                className="p-2.5 bg-primary/10 rounded-lg flex-shrink-0"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Download size={20} className="text-primary" />
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-text-main text-sm mb-1">
                  ثبّت تطبيق تودو
                </h3>
                <p className="text-text-secondary text-xs">
                  احصل على وصول أسرع وتجربة أفضل على جهازك
                </p>
              </div>

              {/* Close button */}
              <motion.button
                onClick={handleDismiss}
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={16} className="text-text-secondary" />
              </motion.button>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-3">
              <motion.button
                onClick={handleDismiss}
                className="flex-1 px-3 py-2 text-xs font-medium text-text-secondary hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                لاحقاً
              </motion.button>
              <motion.button
                onClick={handleInstall}
                className="flex-1 px-3 py-2 text-xs font-bold text-white bg-primary hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download size={14} />
                ثبّت
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
