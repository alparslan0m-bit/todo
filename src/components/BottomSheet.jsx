/**
 * BottomSheet Component
 * Draggable bottom sheet for native-like mobile experience
 */

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronUp } from 'lucide-react';
import { useGesture } from '@use-gesture/react';

const BottomSheet = ({ isOpen, onClose, children, title = 'تفاصيل' }) => {
  const [y, setY] = useState(0);
  const sheetRef = useRef(null);

  const bind = useGesture({
    onDrag: ({ offset: [, oy], velocity: [, vy], last }) => {
      if (!last) {
        setY(Math.max(0, oy));
      } else {
        // Snap back or close based on velocity and position
        if (oy > 100 || vy > 0.5) {
          onClose();
        } else {
          setY(0);
        }
      }
    },
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl glass max-h-[90vh] overflow-y-auto touch-pan-y pb-safe"
            initial={{ y: 500 }}
            animate={{ y: 0 }}
            exit={{ y: 500 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{ y }}
            {...bind()}
          >
            {/* Handle and Title */}
            <div className="sticky top-0 bg-inherit rounded-t-3xl pt-4 px-4 pb-3 border-b border-gray-100 cursor-grab active:cursor-grabbing">
              <div className="flex items-center justify-between gap-3">
                <motion.div
                  className="w-12 h-1 bg-gray-300 rounded-full mx-auto"
                  whileHover={{ backgroundColor: '#9CA3AF' }}
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <h2 className="text-lg font-bold text-text-main">{title}</h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors min-h-11 min-w-11 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 py-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
