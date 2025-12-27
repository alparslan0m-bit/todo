/**
 * Settings Component
 * Backup, restore, and about information
 * Includes animations and transitions
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Trash2, ShieldAlert, BadgeInfo } from 'lucide-react';
import { clearAllData } from '../utils/storage';

const Settings = () => {
  const navigate = useNavigate();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [backupMessage, setBackupMessage] = useState('');



  // Handle clear all data
  const handleClearAll = () => {
    if (clearAllData()) {
      setShowConfirmDelete(false);
      setBackupMessage('✓ تم حذف جميع البيانات');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="px-4 py-4 pb-20">
      {/* Header */}
      <div className="pt-safe-top sticky top-0 z-30">
        <div className="absolute inset-0 glass border-b border-white/20" />
        <div className="relative px-4 py-4 flex items-center justify-between">
          <motion.button
            onClick={() => navigate('/')}
            className="p-2 -mr-2 text-gray-600 hover:text-primary transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowRight size={24} />
          </motion.button>
          <h1 className="text-xl font-bold text-gray-800">الإعدادات</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Messages */}
      {backupMessage && (
        <motion.div
          className="max-w-2xl mx-auto px-4 mt-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className={`px-4 py-3 rounded-2xl flex items-center gap-2 ${backupMessage.includes('✓')
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
            }`}>
            <span className="font-bold">{backupMessage}</span>
          </div>
        </motion.div>
      )}

      {/* Settings Content */}
      <motion.div
        className="max-w-2xl mx-auto px-5 py-6 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >


        {/* About Section */}
        <motion.div
          className="glass-card rounded-3xl p-6"
          whileHover={{ y: -2 }}
        >
          <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <BadgeInfo className="text-primary" />
            عن التطبيق
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p className="font-bold text-gray-900">تودو - تطبيق إدارة المهام الإسلامي</p>
            <p>
              تطبيق ويب تقدمي (PWA) يساعدك على إدارة مهامك اليومية مع التركيز على النيات والقصد الديني.
            </p>
            <div className="flex gap-4 text-sm bg-slate-50 p-4 rounded-2xl">
              <div>
                <strong>الإصدار:</strong><br />1.0.0
              </div>
              <div className="h-full w-px bg-gray-200" />
              <div>
                <strong>المطور:</strong><br />فريق جماليات
              </div>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          className="border border-red-100 rounded-3xl p-6 bg-red-50/50"
        >
          <h2 className="text-lg font-bold text-red-700 mb-2 flex items-center gap-2">
            <ShieldAlert className="text-red-600" />
            منطقة الخطر
          </h2>
          <p className="text-red-600/80 text-sm mb-6">
            هذه الإجراءات لا يمكن التراجع عنها
          </p>
          {!showConfirmDelete ? (
            <motion.button
              onClick={() => setShowConfirmDelete(true)}
              className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-4 px-4 rounded-2xl transition-colors duration-200 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 size={20} />
              حذف جميع البيانات
            </motion.button>
          ) : (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="font-bold text-center text-red-700 mb-2">هل أنت متأكد تماماً؟</p>
              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-xl transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  إلغاء
                </motion.button>
                <motion.button
                  onClick={handleClearAll}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  حذف
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Settings;
