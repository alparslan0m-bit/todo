/**
 * Dashboard Component
 * Premium tasks view with physics-based elastic bounce (Apple native feel)
 * Phase 4: Category theme switching with applyCategoryTheme
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { applyCategoryTheme, resetTheme } from '../utils/dynamicTheme';
import {
  Sun,
  Moon,
  CloudSun,
  ListTodo,
  Plus,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { useGesture } from '@use-gesture/react';
import { useHaptic } from '../hooks/useHaptic';
import TaskCard from './TaskCard';
import { useTaskContext } from '../context/TaskContext';

const CATEGORIES = ['عبادات', 'علم', 'عمل', 'أسرة', 'نفس', 'خير'];

const Dashboard = ({ onShowModal }) => {
  const navigate = useNavigate();
  const { triggerHaptic } = useHaptic();
  const { tasks, updateTaskStatus, deleteTask } = useTaskContext();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [greeting, setGreeting] = useState({ text: 'صباح الخير', icon: Sun });
  const [pullY, setPullY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const maxStretch = 60; // Maximum stretch before haptic feedback
  const resistanceFactor = 0.3; // Stretch 100px pull = 30px UI movement

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting({ text: 'صباح الخير', icon: CloudSun });
    else if (hour < 17) setGreeting({ text: 'طاب يومك', icon: Sun });
    else setGreeting({ text: 'مساء الخير', icon: Moon });
  }, []);

  // Physics-based elastic bounce gesture (Apple native feel)
  const bind = useGesture({
    onDrag: ({ offset: [, oy], velocity: [, vy], last, direction: [, dy] }) => {
      // Only allow pull-down when at top of scroll
      if (containerRef.current?.scrollTop === 0 && dy > 0) {
        setIsDragging(!last);
        
        // Apply resistance factor: pulling 100px only moves UI 30px
        const stretchedY = Math.min(oy * resistanceFactor, maxStretch);
        setPullY(stretchedY);

        // Haptic feedback at max stretch point
        if (stretchedY >= maxStretch * 0.9 && !last) {
          triggerHaptic(5); // Light impact
        }

        // On release, trigger spring animation back to zero
        if (last) {
          setIsDragging(false);
          // Spring will handle the bounce-back via Framer Motion
        }
      }
    },
  });

  // Memoize filtered tasks for performance optimization
  const filteredTasks = useMemo(() =>
    selectedCategory
      ? tasks.filter(task => task.category === selectedCategory)
      : tasks,
    [tasks, selectedCategory]
  );

  const incompleteTasks = useMemo(() =>
    filteredTasks.filter(t => !t.completed),
    [filteredTasks]
  );

  const completedTasks = useMemo(() =>
    filteredTasks.filter(t => t.completed),
    [filteredTasks]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const GreetingIcon = greeting.icon;

  return (
    <div 
      ref={containerRef}
      className="px-4 py-4 pb-32"
      {...bind()}
    >
      {/* Elastic bounce wrapper - Apple native physics */}
      <motion.div
        animate={{ y: !isDragging ? 0 : pullY }}
        transition={isDragging ? { type: 'tween', duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
      >
      <header className="sticky top-0 z-30 pt-safe-top">
        <div className="absolute inset-0 glass border-b border-white/20" />
        <div className="relative px-6 py-6 flex justify-between items-end">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 text-primary/80 mb-1">
              <GreetingIcon size={18} />
              <span className="text-sm font-medium opacity-90">{greeting.text}</span>
            </div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">مهامي</h1>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-xs text-primary/60 font-semibold mb-1">المتبقي</div>
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-primary text-white font-bold text-lg shadow-glow min-h-11 min-w-11">
              {incompleteTasks.length}
            </div>
          </motion.div>
        </div>

        {/* Categories Scroller */}
        <div className="relative px-6 pb-6 overflow-x-auto no-scrollbar mask-gradient-right">
          <div className="flex gap-3 min-w-max">
            <button
              onClick={() => {
                setSelectedCategory(null);
                resetTheme(); // Reset to default theme when showing all categories
              }}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${selectedCategory === null
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                  : 'bg-white/60 text-gray-600 hover:bg-white'
                }`}
            >
              الكل
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  applyCategoryTheme(cat); // Phase 4: Sync browser chrome color to category
                }}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${selectedCategory === cat
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                    : 'bg-white/60 text-gray-600 hover:bg-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 mt-4 max-w-3xl mx-auto">
        {filteredTasks.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 bg-gradient-to-tr from-emerald-100 to-teal-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <ListTodo size={48} className="text-primary/40" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedCategory ? `لا توجد مهام في ${selectedCategory}` : 'يومك فارغ!'}
            </h2>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto leading-relaxed">
              استثمر وقتك وأضف مهاماً جديدة لزيادة إنتاجيتك اليوم.
            </p>
            <motion.button
              onClick={() => navigate('/add', { replace: true })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/30 transition-all hover:shadow-primary/40"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              إضافة مهمة جديدة
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="task-grid space-y-8"
          >
            {/* Incomplete - Phase 3: Container-responsive bento grid */}
            <AnimatePresence mode="popLayout">
              {incompleteTasks.map((task, idx) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={idx}
                  onComplete={(id) => {
                    updateTaskStatus(id, true);
                    onShowModal();
                  }}
                  onDelete={deleteTask}
                />
              ))}
            </AnimatePresence>

            {/* Completed */}
            {completedTasks.length > 0 && (
              <motion.div layout>
                <div className="flex items-center gap-4 my-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">منجزة</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                </div>
                <div className="opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                  {completedTasks.map((task, idx) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      index={idx}
                      onComplete={(id) => updateTaskStatus(id, false)}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>
      </motion.div>
    </div>
  );
};

export default Dashboard;
