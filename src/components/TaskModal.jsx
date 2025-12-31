/**
 * TaskModal Component - Apple Native Edition
 * A premium feedback modal following iOS Alert patterns.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const TaskModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />

          {/* iOS Alert Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-[280px] bg-white/80 backdrop-blur-2xl rounded-[14px] overflow-hidden shadow-2xl border border-white/40"
          >
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#34C759] flex items-center justify-center text-white mb-4">
                <Check size={32} strokeWidth={3} />
              </div>
              <h2 className="text-[17px] font-bold text-black tracking-tight mb-1">تمت المهمة!</h2>
              <p className="text-[14px] font-medium text-black/60 leading-tight">
                نحتسبها عند الله 🌱<br />تقبل الله منك صالح الأعمال.
              </p>
            </div>

            {/* Apple Style Buttons */}
            <div className="border-t border-black/[0.05] flex">
              <button
                onClick={onClose}
                className="flex-1 py-3 text-[17px] font-bold text-[#007AFF] active:bg-black/[0.05] transition-colors"
                autoFocus
              >
                حسناً
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;
