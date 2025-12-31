/**
 * SplashScreen Component - Apple Native Edition
 * A minimal, premium splash screen mirroring official iOS boot experiences.
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const SplashScreen = ({ onComplete = () => { }, duration = 2500 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F2F2F7]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
    >
      {/* Central Branding Container */}
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
      >
        {/* iOS Style Glass Icon */}
        <motion.div
          className="w-24 h-24 bg-primary rounded-[22px] flex items-center justify-center text-white shadow-[0_10px_40px_rgba(16,185,129,0.3)]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
        >
          <Activity size={48} strokeWidth={2.5} />
        </motion.div>

        <div className="text-center">
          <motion.h1
            className="text-[32px] font-bold text-text-main tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            تودو
          </motion.h1>
          <motion.p
            className="text-[15px] font-medium text-text-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            بنية صالحة، نحو غدٍ أفضل
          </motion.p>
        </div>
      </motion.div>

      {/* Apple-style Activity Indicator */}
      <div className="absolute bottom-20">
        <div className="w-6 h-6 border-2 border-text-secondary/20 border-t-text-secondary rounded-full animate-spin" />
      </div>
    </motion.div>
  );
};

export default SplashScreen;
