/**
 * UpdateToast Component
 * Displays a non-intrusive notification when a new version of the app is available.
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';

const UpdateToast = () => {
    const [show, setShow] = useState(false);
    const [registration, setRegistration] = useState(null);

    useEffect(() => {
        const handleUpdate = (e) => {
            setRegistration(e.detail);
            setShow(true);
        };

        window.addEventListener('sw-update-available', handleUpdate);
        return () => window.removeEventListener('sw-update-available', handleUpdate);
    }, []);

    const handleUpdate = () => {
        if (registration && registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        setShow(false);
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed bottom-28 left-4 right-4 z-[60] flex justify-center"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                >
                    <div className="bg-white/80 backdrop-blur-2xl px-5 py-3 rounded-[20px] shadow-2xl border border-white/40 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <RefreshCw size={20} className="animate-spin-slow" />
                        </div>

                        <div className="flex flex-col flex-1 pl-4">
                            <span className="text-[15px] font-bold text-text-main tracking-tight">تحديث متوفر</span>
                            <span className="text-[12px] font-medium text-text-main/50 leading-tight">اضغط للحصول على النسخة الأحدث</span>
                        </div>

                        <button
                            onClick={handleUpdate}
                            className="bg-primary text-white text-[13px] font-bold px-4 py-2 rounded-full active:opacity-60 transition-opacity"
                        >
                            تحديث
                        </button>

                        <button
                            onClick={() => setShow(false)}
                            className="p-1 text-text-main/20 hover:text-text-main/40 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UpdateToast;
