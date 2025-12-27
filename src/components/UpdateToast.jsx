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
            console.log('[UpdateToast] Sending SKIP_WAITING to service worker');
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            // The page will reload automatically when the new SW takes control
        }
        setShow(false);
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed bottom-24 left-4 right-4 z-[60] flex justify-center"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                >
                    <div className="glass-card flex items-center gap-4 px-5 py-3 rounded-2xl border border-primary/20 shadow-xl shadow-primary/10">
                        <div className="flex items-center gap-3">
                            <motion.div 
                                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <RefreshCw size={20} />
                            </motion.div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-800">تحديث جديد متاح</span>
                                <span className="text-xs text-gray-500">قم بالتحديث للحصول على آخر المميزات</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pr-2 border-r border-gray-100">
                            <button
                                onClick={handleUpdate}
                                className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors"
                            >
                                تحديث الآن
                            </button>
                            <button
                                onClick={() => setShow(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UpdateToast;
