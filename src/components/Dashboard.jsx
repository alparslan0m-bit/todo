/**
 * Dashboard Component - Apple Native Edition
 * Premium tasks view following iOS Human Interface Guidelines
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  CloudSun,
  ListTodo,
  Plus,
  ArrowLeft,
  Settings as SettingsIcon,
  Sparkles
} from 'lucide-react';
import TaskCard from './TaskCard';
import { useTaskContext } from '../context/TaskContext';

const CATEGORIES = [
  { name: 'عبادات', color: '#5856D6' },
  { name: 'علم', color: '#30B0C7' },
  { name: 'عمل', color: '#8E8E93' },
  { name: 'أسرة', color: '#FF2D55' },
  { name: 'نفس', color: '#FF9500' },
  { name: 'خير', color: '#34C759' }
];

const Dashboard = ({ onShowModal, setCurrentView }) => {
  const { tasks, updateTaskStatus, deleteTask } = useTaskContext();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [greeting, setGreeting] = useState({ text: 'صباح الخير', icon: CloudSun });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting({ text: 'صباح الخير', icon: CloudSun });
    else if (hour < 17) setGreeting({ text: 'طاب يومك', icon: Sun });
    else setGreeting({ text: 'مساء الخير', icon: Moon });
  }, []);

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

  const GreetingIcon = greeting.icon;

  return (
    <div className="bg-[#F2F2F7] pb-32">
      {/* iOS Status Bar & Top Actions */}
      <header className="sticky top-0 z-40 bg-[#F2F2F7]/80 backdrop-blur-xl border-b border-black/[0.03] pt-safe-top">
        <div className="h-14 px-5 flex items-center justify-between">
          <button
            onClick={() => setCurrentView('settings')}
            className="w-10 h-10 rounded-full bg-primary/[0.05] flex items-center justify-center text-text-secondary active:scale-90 transition-transform"
          >
            <SettingsIcon size={20} />
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/50 rounded-full border border-primary/[0.05]">
            <GreetingIcon size={14} className="text-[#FF9500]" />
            <span className="text-[13px] font-bold text-text-main/60">{greeting.text}</span>
          </div>

          <button
            onClick={() => setCurrentView('add')}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 active:scale-95 transition-transform"
          >
            <Plus size={24} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto py-6">
        {/* Large Title Section */}
        <section className="px-6 mb-6">
          <h1 className="text-[34px] font-bold tracking-tight text-primary">مهامي</h1>
          <p className="text-[15px] font-medium text-text-secondary">لديك {incompleteTasks.length} مهام متبقية</p>
        </section>

        {/* Category Filter Pills - Apple Style with Scroll Snap */}
        <section className="mb-8">
          <div className="overflow-x-auto no-scrollbar scroll-snap-x" style={{ overscrollBehaviorX: 'contain', touchAction: 'pan-x pan-y' }}>
            <div className="flex gap-2.5 min-w-max px-6">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-5 py-2 rounded-full text-[14px] font-semibold transition-all ${selectedCategory === null
                  ? 'bg-primary text-white'
                  : 'bg-white text-text-main border border-primary/[0.05]'
                  }`}
              >
                الكل
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-5 py-2 rounded-full text-[14px] font-semibold transition-all flex items-center gap-2 ${selectedCategory === cat.name
                    ? 'bg-white shadow-sm ring-1 ring-black/[0.05]'
                    : 'bg-white/50 text-[#8E8E93] border border-black/[0.02]'
                    }`}
                  style={{
                    color: selectedCategory === cat.name ? cat.color : '#8E8E93'
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Task List Section */}
        <section className="px-4">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 px-10 text-center space-y-4"
            >
              <div className="w-20 h-20 rounded-[22px] bg-white flex items-center justify-center shadow-sm border border-black/[0.05] text-[#007AFF]">
                <Sparkles size={40} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h2 className="text-[20px] font-bold text-black tracking-tight">لا توجد مهام</h2>
                <p className="text-[15px] font-medium text-[#8E8E93]">يومك هادئ وجميل، هل تود إضافة مهمة جديدة؟</p>
              </div>
              <button
                onClick={() => setCurrentView('add')}
                className="text-[#007AFF] font-semibold text-[17px] active:opacity-30 transition-opacity"
              >
                إضافة مهمة
              </button>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Incomplete Tasks Group */}
              {incompleteTasks.length > 0 && (
                <div className="space-y-4">
                  <h3 className="px-4 text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">المهام الجارية</h3>
                  <div className="bg-white rounded-[22px] overflow-hidden border border-black/[0.03] shadow-sm">
                    <AnimatePresence mode="popLayout">
                      {incompleteTasks.map((task, idx) => (
                        <React.Fragment key={task.id}>
                          {idx > 0 && <div className="h-[0.5px] bg-[#3C3C43]/[0.05] mr-16" />}
                          <TaskCard
                            task={task}
                            index={idx}
                            onComplete={(id) => {
                              updateTaskStatus(id, true);
                              onShowModal();
                            }}
                            onDelete={deleteTask}
                          />
                        </React.Fragment>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Completed Tasks Group */}
              {completedTasks.length > 0 && (
                <div className="space-y-4">
                  <h3 className="px-4 text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider text-right">المهام المنجزة</h3>
                  <div className="bg-white rounded-[22px] overflow-hidden border border-black/[0.03] shadow-sm opacity-60">
                    <AnimatePresence mode="popLayout">
                      {completedTasks.map((task, idx) => (
                        <React.Fragment key={task.id}>
                          {idx > 0 && <div className="h-[0.5px] bg-[#3C3C43]/[0.05] mr-16" />}
                          <TaskCard
                            task={task}
                            index={idx}
                            onComplete={(id) => updateTaskStatus(id, false)}
                            onDelete={deleteTask}
                          />
                        </React.Fragment>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
