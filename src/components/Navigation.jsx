/**
 * Navigation Component
 * Phase 5: Enhanced with edge-to-edge floating glass dock and spring physics
 * Uses CSS Grid and safe-area-inset for perfect mobile adaptation
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Plus, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHaptic } from '../hooks/useHaptic';

const Navigation = () => {
  const navigate = useNavigate();
  const { triggerHaptic } = useHaptic();
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', path: '/', label: 'الرئيسية', icon: Home },
    { id: 'add', path: '/add', label: 'إضافة', icon: Plus },
    { id: 'settings', path: '/settings', label: 'الإعدادات', icon: Settings },
  ];

  const handleNavClick = (path) => {
    triggerHaptic(10); // Light tap
    navigate(path, { replace: true });
  };

  return (
    <nav className="fixed inset-0 pointer-events-none z-50" style={{ insetBlockEnd: 0, insetInlineStart: 0, insetInlineEnd: 0 }}>
      <div className="flex justify-center px-4 absolute inset-x-0 bottom-0 pointer-events-none" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
        {/* Phase 5: Edge-to-edge navigation dock with safe-area support */}
        <motion.div
          className="nav-dock pointer-events-auto"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.2 }}
        >
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                style={{
                  background: isActive ? 'var(--primary)' : 'transparent',
                  transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: 'spring',
                  damping: 20,
                  stiffness: 300,
                  delay: index * 0.05,
                }}
              >
                <Icon size={20} strokeWidth={2.5} />

                {/* Phase 5: Subtle glow for active item */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      boxShadow: '0 0 20px var(--primary)',
                      opacity: 0.3,
                    }}
                    initial={{ opacity: 0, scale: 1.5 }}
                    animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </nav>
  );
};

export default Navigation;
