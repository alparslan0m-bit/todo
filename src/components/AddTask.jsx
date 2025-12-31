/**
 * AddTask Component - Apple Native Edition
 * A premium, iOS-inspired task creation interface following Human Interface Guidelines.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Check,
  Moon,
  BookOpen,
  Briefcase,
  Users,
  Smile,
  Heart,
  Type,
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { useIntentions } from '../hooks/useIntentions';

const CATEGORIES = [
  { name: 'عبادات', icon: Moon, color: '#5856D6', bg: '#F2F2F7' },
  { name: 'علم', icon: BookOpen, color: '#30B0C7', bg: '#F2F2F7' },
  { name: 'عمل', icon: Briefcase, color: '#8E8E93', bg: '#F2F2F7' },
  { name: 'أسرة', icon: Users, color: '#FF2D55', bg: '#F2F2F7' },
  { name: 'نفس', icon: Smile, color: '#FF9500', bg: '#F2F2F7' },
  { name: 'خير', icon: Heart, color: '#34C759', bg: '#F2F2F7' }
];

const AddTask = ({ setCurrentView }) => {
  const { addTask } = useTaskContext();
  const { intentions, addIntention } = useIntentions();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('عبادات');
  const [intention, setIntention] = useState('');
  const [newIntention, setNewIntention] = useState('');
  const [showNewIntentionInput, setShowNewIntentionInput] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      setError('يرجى إدخال عنوان المهمة');
      return;
    }
    if (!intention && !newIntention.trim()) {
      setError('يرجى اختيار نية');
      return;
    }

    const finalIntention = newIntention.trim() || intention;

    if (newIntention.trim() && !intentions.includes(newIntention)) {
      if (!addIntention(newIntention)) {
        setError('فشل إضافة النية');
        return;
      }
    }

    const task = {
      title: title.trim(),
      category,
      intention: finalIntention,
      createdAt: new Date().toISOString()
    };

    if (addTask(task)) {
      setSuccess(true);
      if (window.navigator.vibrate) window.navigator.vibrate([10, 30, 10]); // Premium haptic sequence

      setTimeout(() => {
        setCurrentView('home');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col">
      {/* iOS Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#F2F2F7]/80 backdrop-blur-xl border-b border-primary/[0.05]">
        <div className="h-14 px-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentView('home')}
            className="text-primary text-[17px] active:opacity-40 transition-opacity"
          >
            إلغاء
          </button>
          <h1 className="text-[17px] font-semibold text-text-main">مهمة جديدة</h1>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="text-primary text-[17px] font-semibold disabled:opacity-30 active:opacity-40 transition-opacity"
          >
            إضافة
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8 space-y-7 max-w-xl mx-auto w-full">
        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-xl p-3 border border-red-100 flex items-center gap-2"
            >
              <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px]">
                <X size={12} />
              </div>
              <span className="text-red-600 text-[14px] font-medium">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section: Title */}
        <div className="space-y-2">
          <h2 className="px-4 text-[13px] font-medium text-text-secondary uppercase tracking-tight">ما هي المهمة؟</h2>
          <div className="bg-white rounded-[12px] overflow-hidden border border-primary/[0.02] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Type size={18} />
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError('');
                }}
                placeholder="مثلاً: صلاة الضحى"
                className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-[17px] placeholder:text-text-tertiary text-text-main"
              />
              {title && (
                <button onClick={() => setTitle('')} className="bg-text-tertiary text-white rounded-full p-0.5">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Section: Category */}
        <div className="space-y-2">
          <h2 className="px-4 text-[13px] font-medium text-[#8E8E93] uppercase">الفئة</h2>
          <div className="bg-white rounded-2xl overflow-hidden border border-black/[0.02] p-4">
            <div className="grid grid-cols-3 gap-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className={`w-14 h-14 rounded-[14px] flex items-center justify-center transition-all duration-200 ${category === cat.name
                      ? 'scale-110 shadow-lg'
                      : 'opacity-40 grayscale-[0.2]'
                      }`}
                    style={{ backgroundColor: cat.color }}
                  >
                    <cat.icon size={28} color="white" strokeWidth={2.5} />
                  </div>
                  <span className={`text-[12px] font-semibold transition-colors ${category === cat.name ? 'text-black' : 'text-[#8E8E93]'
                    }`}>
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section: Intention */}
        <div className="space-y-2">
          <h2 className="px-4 text-[13px] font-medium text-text-secondary uppercase">النية</h2>
          <div className="bg-white rounded-2xl border border-primary/[0.02] p-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {intentions.map((int) => (
                <button
                  key={int}
                  onClick={() => {
                    setIntention(int);
                    setNewIntention('');
                    setShowNewIntentionInput(false);
                  }}
                  className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all ${intention === int && !showNewIntentionInput
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-[#F2F2F7] text-text-main active:bg-[#E5E5EA]'
                    }`}
                >
                  {int}
                </button>
              ))}
              <button
                onClick={() => setShowNewIntentionInput(!showNewIntentionInput)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${showNewIntentionInput
                  ? 'bg-primary text-white rotate-45'
                  : 'bg-primary/10 text-primary'
                  }`}
              >
                <Plus size={20} />
              </button>
            </div>

            <AnimatePresence>
              {showNewIntentionInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-2 border-t border-[#F2F2F7]"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-[#FF9500]" />
                    <input
                      type="text"
                      placeholder="أضف نية جديدة..."
                      value={newIntention}
                      onChange={(e) => {
                        setNewIntention(e.target.value);
                        setIntention('');
                      }}
                      className="flex-1 bg-transparent border-none focus:ring-0 p-2 text-[15px]"
                      autoFocus
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Success Feedback */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
            >
              <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[30px] shadow-2xl flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white">
                  <Check size={32} strokeWidth={3} />
                </div>
                <span className="text-[17px] font-bold text-text-main tracking-tight">تم الحفظ</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Quote */}
      <footer className="p-6 text-center">
        <p className="text-[13px] text-[#8E8E93] font-medium leading-relaxed italic">
          "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى"
        </p>
      </footer>
    </div>
  );
};

export default AddTask;
