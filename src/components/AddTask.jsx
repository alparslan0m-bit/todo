/**
 * AddTask Component
 * Premium form for adding new tasks
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Moon,
  BookOpen,
  Briefcase,
  Users,
  Smile,
  Heart,
  Plus,
  Check
} from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { useIntentions } from '../hooks/useIntentions';

const CATEGORIES = [
  { name: 'عبادات', icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { name: 'علم', icon: BookOpen, color: 'text-teal-600', bg: 'bg-teal-50' },
  { name: 'عمل', icon: Briefcase, color: 'text-slate-600', bg: 'bg-slate-50' },
  { name: 'أسرة', icon: Users, color: 'text-rose-600', bg: 'bg-rose-50' },
  { name: 'نفس', icon: Smile, color: 'text-amber-600', bg: 'bg-amber-50' },
  { name: 'خير', icon: Heart, color: 'text-emerald-600', bg: 'bg-emerald-50' }
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
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!title.trim()) {
      setError('يرجى إدخال عنوان المهمة');
      return;
    }

    if (!intention && !newIntention.trim()) {
      setError('يرجى اختيار أو إضافة نية');
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
      intention: finalIntention
    };

    if (addTask(task)) {
      setSuccess(true);
      setTitle('');
      setCategory('عبادات');
      setIntention('');
      setNewIntention('');
      setShowNewIntentionInput(false);
      // Return to home after successful save
      setTimeout(() => {
        setSuccess(false);
        setCurrentView('home');
      }, 1500);
    } else {
      setError('فشل في إضافة المهمة');
    }
  };

  return (
    <div className="px-4 py-4 pb-24">
      {/* Header */}
      <div className="pt-safe-top sticky top-0 z-30">
        <div className="absolute inset-0 glass border-b border-white/20" />
        <div className="relative px-4 py-4 flex items-center justify-between">
          <motion.button
            onClick={() => setCurrentView('home')}
            className="p-2 -mr-2 text-gray-600 hover:text-primary transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowRight size={24} />
          </motion.button>
          <h1 className="text-xl font-bold text-gray-800">مهمة جديدة</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto px-5 py-6 space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Messages */}
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl flex items-center gap-3 ${success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
          >
            {success ? <Check size={20} /> : null}
            <span className="font-semibold">{error || 'تمت الإضافة بنجاح!'}</span>
          </motion.div>
        )}

        {/* Title */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">عنوان المهمة</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ماذا تود أن تنجز؟"
            className="w-full text-2xl font-bold bg-transparent border-none placeholder-gray-300 focus:ring-0 px-0 py-2"
            autoFocus
          />
          <div className="h-px bg-gray-200" />
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">الفئة</label>
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.name;
              return (
                <motion.button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  layout
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-colors ${isSelected
                    ? `${cat.bg} ${cat.color} border-current shadow-lg`
                    : 'bg-white border-transparent hover:bg-gray-50'
                    }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={24} strokeWidth={2} className="mb-2" />
                  <span className="text-xs font-bold">{cat.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Intentions */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">النية</label>
          <div className="flex flex-wrap gap-2">
            {intentions.map(int => (
              <motion.button
                key={int}
                type="button"
                onClick={() => {
                  setIntention(int);
                  setNewIntention('');
                  setShowNewIntentionInput(false);
                }}
                layout
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${intention === int && !showNewIntentionInput
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {int}
              </motion.button>
            ))}
            <motion.button
              type="button"
              onClick={() => setShowNewIntentionInput(true)}
              layout
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1 transition-colors ${showNewIntentionInput ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                }`}
            >
              <Plus size={16} />
              جديدة
            </motion.button>
          </div>

          {/* New Intention Input */}
          <AnimatePresence mode="wait">
            {showNewIntentionInput && (
              <motion.input
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 50 }}
                exit={{ opacity: 0, height: 0 }}
                type="text"
                value={newIntention}
                onChange={(e) => {
                  setNewIntention(e.target.value);
                  setIntention('');
                }}
                placeholder="اكتب نيتك هنا..."
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={!title}
          className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/30 disabled:opacity-50 disabled:shadow-none"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          حفظ المهمة
        </motion.button>

      </motion.form>
    </div>
  );
};

export default AddTask;
