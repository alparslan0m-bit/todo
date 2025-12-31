/**
 * TaskCard Component - Apple Native Edition
 * A refined list row following iOS patterns
 */

import React, { useState, useRef } from 'react';
import {
  Check,
  Trash2,
  Moon,
  BookOpen,
  Briefcase,
  Users,
  Smile,
  Heart,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGesture } from '@use-gesture/react';
import { triggerConfetti } from '../utils/confetti';

const CATEGORY_CONFIG = {
  'عبادات': { icon: Moon, color: '#5856D6', bg: 'bg-[#5856D6]/10' },
  'علم': { icon: BookOpen, color: '#30B0C7', bg: 'bg-[#30B0C7]/10' },
  'عمل': { icon: Briefcase, color: '#8E8E93', bg: 'bg-[#8E8E93]/10' },
  'أسرة': { icon: Users, color: '#FF2D55', bg: 'bg-[#FF2D55]/10' },
  'نفس': { icon: Smile, color: '#FF9500', bg: 'bg-[#FF9500]/10' },
  'خير': { icon: Heart, color: '#34C759', bg: 'bg-[#34C759]/10' }
};

const TaskCard = ({ task, onComplete, onDelete, index = 0 }) => {
  const config = CATEGORY_CONFIG[task.category] || { icon: Calendar, color: '#8E8E93', bg: 'bg-gray-100' };
  const Icon = config.icon;
  const [swipeAction, setSwipeAction] = useState(null); // 'complete' | 'delete' | null
  const cardRef = useRef(null);

  // Local state for drag/swipe position to ensure high-performance animation
  const [x, setX] = useState(0);

  // Swipe gestures
  const bind = useGesture({
    onDrag: ({ offset: [ox], velocity: [vx], down, movement: [mx] }) => {
      // In RTL, moving mouse Right is +x.
      const currentX = down ? mx : x; // if released, keep current x processing
      if (down) setX(mx);

      // Thresholds
      const TRIGGER_THRESHOLD = 60;

      if (down) {
        // Haptic feedback when crossing threshold
        if (currentX > TRIGGER_THRESHOLD && swipeAction !== 'complete') {
          if (navigator.vibrate) navigator.vibrate(10);
          setSwipeAction('complete');
        } else if (currentX < -TRIGGER_THRESHOLD && swipeAction !== 'delete') {
          if (navigator.vibrate) navigator.vibrate(10);
          setSwipeAction('delete');
        } else if (Math.abs(currentX) < TRIGGER_THRESHOLD && swipeAction !== null) {
          setSwipeAction(null);
        }
      } else {
        // Released
        if (currentX > TRIGGER_THRESHOLD || (currentX > 30 && vx > 0.5)) {
          // Commit Complete -> Slide Off Right
          setX(window.innerWidth); // Fly off
          if (navigator.vibrate) navigator.vibrate([15]);
          triggerConfetti(cardRef.current);

          // Delay callback slightly to allow animation start
          setTimeout(() => onComplete(task.id), 200);

        } else if (currentX < -TRIGGER_THRESHOLD || (currentX < -30 && vx > 0.5)) {
          // Commit Delete -> Slide Off Left
          setX(-window.innerWidth); // Fly off
          if (navigator.vibrate) navigator.vibrate([15]);

          setTimeout(() => onDelete(task.id), 200);

        } else {
          // Snap back
          setX(0);
        }
        setSwipeAction(null);
      }
    },
  }, {
    drag: {
      from: () => [x, 0],
      axis: 'x',
      bounds: { left: -window.innerWidth, right: window.innerWidth }, // Allow full swipe
      rubberband: true
    }
  });

  const handleComplete = (e) => {
    e.stopPropagation();
    if (navigator.vibrate) navigator.vibrate(5);
    if (!task.completed) {
      triggerConfetti(cardRef.current);
    }
    onComplete(task.id);
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="relative mb-3 group select-none"
    >
      {/* Background Container for Swipe Actions */}
      <div className="absolute inset-0 rounded-[18px] overflow-hidden flex">
        {/* Left Side (Revealed when swiping Right) -> Complete */}
        <div
          className="bg-[#34C759] flex items-center justify-start px-6 transition-all duration-300 w-full absolute left-0 h-full"
          style={{
            opacity: x > 0 ? 1 : 0,
            transform: `scale(${Math.min(1.2, 1 + x * 0.001)})`
          }}
        >
          <Check className="text-white" size={24} strokeWidth={3} />
        </div>

        {/* Right Side (Revealed when swiping Left) -> Delete */}
        <div
          className="bg-[#FF3B30] flex items-center justify-end px-6 transition-all duration-300 w-full absolute right-0 h-full"
          style={{
            opacity: x < 0 ? 1 : 0,
            transform: `scale(${Math.min(1.2, 1 + Math.abs(x) * 0.001)})`
          }}
        >
          <Trash2 className="text-white" size={24} />
        </div>
      </div>

      {/* Main Card Content */}
      <motion.div
        {...bind()}
        animate={{ x }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="relative bg-white p-4 rounded-[18px] flex items-center gap-4 border border-black/[0.03] shadow-sm active:shadow-[0_8px_16px_rgba(0,0,0,0.04)] active:scale-[0.99] transition-all z-10 touch-pan-y"
      >
        {/* iOS Style Checkbox */}
        <button
          onClick={handleComplete}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-[1.5px] transition-all duration-300 flex items-center justify-center ${task.completed
            ? 'bg-primary border-primary shadow-sm scale-105'
            : 'border-[#C7C7CC] bg-transparent hover:border-primary/50'
            }`}
        >
          <AnimatePresence>
            {task.completed && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <Check size={14} strokeWidth={4} className="text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Task Text Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <h3 className={`text-[16px] leading-snug font-semibold tracking-tight transition-all duration-300 ${task.completed ? 'text-text-secondary line-through decoration-black/20' : 'text-text-main'
              }`}>
              {task.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold"
              style={{ color: config.color, backgroundColor: `${config.color}15` }}
            >
              <Icon size={12} strokeWidth={2.5} />
              <span>{task.category}</span>
            </div>

            {task.intention && (
              <>
                <span className="text-black/10">•</span>
                <span className="text-[12px] text-text-secondary font-medium truncate italic max-w-[150px]">
                  {task.intention}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Drag Handle Indicator (Subtle) */}
        {!task.completed && (
          <div className="w-1 h-8 rounded-full bg-black/[0.03] ml-1" />
        )}
      </motion.div>
    </motion.div>
  );
};

export default TaskCard;
