/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
    );
  }

  const themes = [
    { 
      value: 'light', 
      label: 'Light', 
      icon: '☀️',
      description: 'Light mode'
    },
    { 
      value: 'dark', 
      label: 'Dark', 
      icon: '🌙',
      description: 'Dark mode'
    },
    { 
      value: 'system', 
      label: 'System', 
      icon: '💻',
      description: 'Follow system'
    }
  ];

  return (
    <div className="relative">
      {/* Button Style Toggle */}
      <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/20 dark:border-gray-700/50">
        {themes.map((themeOption) => (
          <motion.button
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value as any)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              theme === themeOption.value
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={themeOption.description}
          >
            <div className="flex items-center space-x-1">
              <span className="text-xs">{themeOption.icon}</span>
              <span className="hidden sm:inline">{themeOption.label}</span>
            </div>
            
            {theme === themeOption.value && (
              <motion.div
                layoutId="activeTheme"
                className="absolute inset-0 bg-blue-500 rounded-lg -z-10"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

   
    </div>
  );
}
