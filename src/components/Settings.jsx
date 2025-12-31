/**
 * Settings Component - Apple Native Edition
 * iOS-inspired settings interface with grouped sections and material design.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Trash2,
  ShieldAlert,
  BadgeInfo,
  ChevronRight,
  Info,
  Database,
  User,
  Activity
} from 'lucide-react';
import { clearAllData } from '../utils/storage';

const Settings = ({ setCurrentView }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [backupMessage, setBackupMessage] = useState('');

  const handleClearAll = () => {
    if (clearAllData()) {
      setShowConfirmDelete(false);
      setBackupMessage('✓ تم حذف جميع البيانات');
      if (window.navigator.vibrate) window.navigator.vibrate([50, 50, 50]);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  const SettingRow = ({ icon: Icon, label, value, onClick, destructive, last }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 bg-white active:bg-gray-100 transition-colors ${!last ? 'border-b border-primary/[0.05]' : ''
        }`}
    >
      <div className={`p-1.5 rounded-md ${destructive ? 'bg-red-500 text-white' : 'bg-gray-100 text-text-secondary'}`}>
        <Icon size={18} strokeWidth={destructive ? 3 : 2} />
      </div>
      <span className={`text-[17px] font-medium flex-1 text-right ${destructive ? 'text-red-500' : 'text-text-main'}`}>
        {label}
      </span>
      {value && <span className="text-[17px] text-text-secondary mr-2">{value}</span>}
      {!value && !destructive && <ChevronLeft size={16} className="text-text-tertiary" />}
    </button>
  );

  return (
    <div className="bg-[#F2F2F7] flex flex-col pb-32">
      {/* iOS Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#F2F2F7]/80 backdrop-blur-xl border-b border-primary/[0.05] pt-safe-top">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="w-16" /> {/* Spacer */}
          <h1 className="text-[17px] font-semibold text-text-main">الإعدادات</h1>
          <button
            onClick={() => setCurrentView('home')}
            className="text-primary text-[17px] font-semibold active:opacity-30 transition-opacity w-16 text-left"
          >
            تم
          </button>
        </div>
      </header>

      <main className="flex-1 pt-6 pb-20 max-w-xl mx-auto w-full">
        {/* Success Message */}
        <AnimatePresence>
          {backupMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-6 mb-6"
            >
              <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                <span>{backupMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="space-y-8">
          {/* Section: About */}
          <div className="space-y-2">
            <h2 className="px-6 text-[13px] font-medium text-text-secondary uppercase tracking-tight">عن التطبيق</h2>
            <div className="bg-white rounded-[12px] overflow-hidden border border-primary/[0.02] shadow-sm mx-4">
              <div className="p-6 flex flex-col items-center text-center gap-3 border-b border-primary/[0.05]">
                <div className="w-20 h-20 rounded-[22px] bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Activity size={40} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-[20px] font-bold text-text-main tracking-tight">تودو</h3>
                  <p className="text-[14px] font-medium text-text-secondary max-w-[200px]">
                    أن تكون أعمالنا كلها لله. تطبيق لإدارة مهامك بنيّة صالحة.
                  </p>
                </div>
              </div>
              <SettingRow icon={Info} label="الإصدار" value="1.2.0" last />
              <SettingRow icon={User} label="المطور" value="محمد عبد العزيز" last />
            </div>
          </div>

          {/* Section: Data Management */}
          <div className="space-y-2">
            <h2 className="px-6 text-[13px] font-medium text-text-secondary uppercase tracking-tight">إدارة البيانات</h2>
            <div className="bg-white rounded-[12px] overflow-hidden border border-primary/[0.02] shadow-sm mx-4">
              {!showConfirmDelete ? (
                <SettingRow
                  icon={Trash2}
                  label="حذف جميع البيانات"
                  destructive
                  last
                  onClick={() => setShowConfirmDelete(true)}
                />
              ) : (
                <div className="p-6 flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in duration-200">
                  <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <ShieldAlert size={28} />
                  </div>
                  <div>
                    <h4 className="text-[17px] font-bold text-text-main">هل أنت متأكد؟</h4>
                    <p className="text-[13px] text-text-secondary px-4">سيتم حذف جميع المهام والنيات نهائياً</p>
                  </div>
                  <div className="flex w-full gap-3 mt-2">
                    <button
                      onClick={() => setShowConfirmDelete(false)}
                      className="flex-1 py-3 bg-gray-100 rounded-xl text-[15px] font-bold text-text-main active:bg-gray-200 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="flex-1 py-3 bg-red-500 rounded-xl text-[15px] font-bold text-white active:bg-red-600 shadow-lg shadow-red-500/20 transition-colors"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              )}
            </div>
            <p className="px-8 text-[12px] text-text-secondary font-medium leading-tight">
              يتم تخزين جميع البيانات محلياً على جهازك لضمان الخصوصية.
            </p>
          </div>
        </section>

        {/* Footer Credit */}
        <footer className="mt-12 mb-8 text-center px-6">
          <p className="text-[13px] text-text-secondary font-medium">صُنع بإحسان لخدمة المسلمين</p>
          <div className="mt-2 flex items-center justify-center gap-1 text-[13px] text-text-tertiary font-medium">
            <span> 🤲❤️ To the pure soul of my mother  </span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Settings;
