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
    if (window.deferredPrompt) {
      setDeferredPrompt(window.deferredPrompt);
      setTimeout(() => setShowPrompt(true), 2000);
    }

    const handleCapture = () => {
      if (window.deferredPrompt) {
        setDeferredPrompt(window.deferredPrompt);
        setTimeout(() => setShowPrompt(true), 1500);
      }
    };

    window.addEventListener('pwa-prompt-available', handleCapture);
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowPrompt(true), 2000);
    });

    if (window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('pwa-prompt-available', handleCapture);
    };
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
          className="fixed bottom-28 left-4 right-4 z-40 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 400 }}
        >
          <div className="bg-white/80 backdrop-blur-2xl rounded-[22px] p-5 shadow-2xl border border-white/40">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Download size={24} strokeWidth={2.5} />
              </div>

              <div className="flex-1">
                <h3 className="text-[17px] font-bold text-text-main tracking-tight leading-tight">ثبّت تودو</h3>
                <p className="text-[13px] font-medium text-text-main/50 leading-tight mt-0.5">احصل على التجربة الكاملة</p>
              </div>

              <button
                onClick={handleDismiss}
                className="p-1 text-text-main/20 hover:text-text-main/40"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleDismiss}
                className="flex-1 py-3 text-[15px] font-bold text-text-main/60 bg-primary/5 rounded-xl active:bg-primary/10 transition-colors"
              >
                ليس الآن
              </button>
              <button
                onClick={handleInstall}
                className="flex-1 py-3 text-[15px] font-bold text-white bg-primary rounded-xl active:opacity-60 shadow-lg shadow-primary/20 transition-opacity"
              >
                تثبيت
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
