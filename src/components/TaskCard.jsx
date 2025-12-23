/**
 * TaskCard Component
 * Phase 1-5: Enhanced with glowing borders, spring physics, and container responsiveness
 * Includes premium glassmorphism, swipe gestures, and confetti
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
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGesture } from '@use-gesture/react';
import { triggerConfetti } from '../utils/confetti';

// Category icons mapping with Lucide icons
const CATEGORY_CONFIG = {
  'عبادات': { icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  'علم': { icon: BookOpen, color: 'text-teal-600', bg: 'bg-teal-50' },
  'عمل': { icon: Briefcase, color: 'text-slate-600', bg: 'bg-slate-50' },
  'أسرة': { icon: Users, color: 'text-rose-600', bg: 'bg-rose-50' },
  'نفس': { icon: Smile, color: 'text-amber-600', bg: 'bg-amber-50' },
  'خير': { icon: Heart, color: 'text-emerald-600', bg: 'bg-emerald-50' }
};

const TaskCard = ({ task, onComplete, onDelete, index = 0 }) => {
  const config = CATEGORY_CONFIG[task.category] || { icon: Calendar, color: 'text-gray-600', bg: 'bg-gray-50' };
  const Icon = config.icon;
  const [isDeleting, setIsDeleting] = useState(false);
  const [swipeAction, setSwipeAction] = useState(null);
  const cardRef = useRef(null);
  const [x, setX] = React.useState(0);

  // Swipe gestures
  const bind = useGesture({
    onDrag: ({ offset: [ox], direction: [dx], velocity: [vx], last }) => {
      if (Math.abs(ox) > 20) {
        setX(ox);
        if (ox > 50) setSwipeAction('complete');
        if (ox < -50) setSwipeAction('delete');
      }

      if (last) {
        if (Math.abs(ox) > 80 && Math.abs(vx) > 0.5) {
          if (ox > 80) {
            // Swipe right to complete
            if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
            triggerConfetti(cardRef.current);
            onComplete(task.id);
          } else if (ox < -80) {
            // Swipe left to delete
            if (navigator.vibrate) navigator.vibrate([50]);
            setIsDeleting(true);
            setTimeout(() => onDelete(task.id), 300);
          }
        }
        setX(0);
        setSwipeAction(null);
      }
    },
  });

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(task.id), 300);
  };

  const handleComplete = () => {
    if (navigator.vibrate) navigator.vibrate([20]);
    if (!task.completed) {
      triggerConfetti(cardRef.current);
    }
    onComplete(task.id);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 300,
        delay: index * 0.05,
      }}
      className={`mb-3 relative group touch-pan-y task-item ${task.inProgress ? 'task-in-progress' : ''} ${task.completed ? '' : 'task-active'}`}
      {...bind()}
    >
      {/* Swipe indicator background */}
      <AnimatePresence>
        {swipeAction === 'complete' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl opacity-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
          />
        )}
        {swipeAction === 'delete' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-400 to-rose-500 rounded-2xl opacity-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`glass-card masked-blur rounded-2xl p-4 transition-all duration-300 ${task.completed ? 'opacity-75 bg-slate-50' : 'bg-white/80'
          }`}
        whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
        animate={{ x }}
        layout
        style={{ touchAction: 'pan-y' }}
      >
        <div className="flex items-center gap-4">

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}>
                <Icon size={12} strokeWidth={2.5} />
                {task.category}
              </span>
              <span className="text-xs text-gray-400 font-medium px-2 py-0.5 bg-gray-50 rounded-full border border-gray-100">
                {task.intention || 'نية عامة'}
              </span>
            </div>

            <h3 className={`text-base font-bold truncate leading-relaxed ${task.completed ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-800'
              }`}>
              {task.title}
            </h3>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Delete Button - Phase 2: Spring physics */}
            <motion.button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 min-h-11 min-w-11 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              aria-label="Delete task"
            >
              <Trash2 size={18} strokeWidth={2} />
            </motion.button>

            {/* Checkbox Button - Phase 2: Spring physics with phase 4 glow */}
            <motion.button
              onClick={handleComplete}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 min-h-11 min-w-11 ${task.completed
                  ? 'bg-primary border-primary shadow-lg shadow-emerald-200'
                  : 'bg-transparent border-gray-300 hover:border-primary'
                }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={task.completed ? { scale: [1, 0.8, 1.1, 1] } : {}}
              style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              <AnimatePresence>
                {task.completed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <Check size={16} strokeWidth={3} className="text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TaskCard;
