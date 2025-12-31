/**
 * Navigation Component - iOS Tab Bar Edition
 * A refined tab bar following Apple Human Interface Guidelines
 */

import React from 'react';
import { Home, Plus, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const Navigation = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'home', label: 'مهامي', icon: Home },
    { id: 'add', label: 'إضافة', icon: Plus },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  const handleNavClick = (viewId) => {
    if (window.navigator.vibrate) window.navigator.vibrate(5);
    setCurrentView(viewId);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* iOS Tab Bar Material */}
      <div className="bg-[#F9F9F9]/80 backdrop-blur-2xl border-t border-primary/[0.05] pb-safe-bottom">
        <div className="h-14 flex items-center justify-around px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="flex flex-col items-center justify-center flex-1 transition-all"
              >
                <div className={`relative ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
                  <Icon
                    size={24}
                    strokeWidth={isActive ? 2.5 : 2}
                    className="transition-all"
                  />
                  {isActive && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    />
                  )}
                </div>
                <span className={`text-[10px] mt-1 font-medium transition-colors ${isActive ? 'text-primary' : 'text-text-secondary'
                  }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
