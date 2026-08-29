import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    const root = document.documentElement;
    if (nextDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { isDark: nextDark } }));
  };

  useEffect(() => {
    const root = document.documentElement;
    const currentIsDark = root.classList.contains('dark');
    if (currentIsDark !== isDark) {
      setIsDark(currentIsDark);
    }

    const handleThemeChange = (e: any) => {
      if (e.detail && typeof e.detail.isDark === 'boolean') {
        setIsDark(e.detail.isDark);
      }
    };
    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  return (
    <button
      onClick={toggleTheme}
      type="button"
      style={{ direction: 'ltr' }}
      aria-label={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
      title={isDark ? "تفعيل الوضع النهاري ☀️" : "تفعيل الوضع الليلي 🌙"}
      className={`relative inline-flex items-center w-[84px] h-[36px] p-[3px] rounded-full cursor-pointer select-none shrink-0 transition-all duration-300 bg-slate-200 dark:bg-[#101744] border border-slate-300 dark:border-[#D4F800]/30 shadow-inner hover:border-[#D4F800] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4F800] ${className}`}
    >
      {/* Background Track Icons (Sun on Left, Moon on Right) */}
      <div className="absolute inset-0 flex items-center justify-between px-[10px] pointer-events-none">
        {/* Sun on left */}
        <span className="w-[26px] h-[26px] flex items-center justify-center">
          <Sun
            className={`w-[17px] h-[17px] transition-all duration-300 ${
              isDark ? 'text-slate-400 opacity-60 scale-90' : 'opacity-0 scale-75'
            }`}
          />
        </span>

        {/* Moon on right */}
        <span className="w-[26px] h-[26px] flex items-center justify-center">
          <Moon
            className={`w-[17px] h-[17px] transition-all duration-300 ${
              !isDark ? 'text-slate-500 opacity-60 scale-90' : 'opacity-0 scale-75'
            }`}
          />
        </span>
      </div>

      {/* Active Sliding Knob */}
      <div
        className={`relative z-10 w-[30px] h-[30px] bg-white dark:bg-[#0A102E] rounded-full flex items-center justify-center shadow-md border border-[#D4F800]/40 transition-transform duration-300 ease-out pointer-events-none ${
          isDark ? 'translate-x-[48px]' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <Moon className="w-[17px] h-[17px] text-[#D4F800] fill-[#D4F800] stroke-[1.8]" />
        ) : (
          <Sun className="w-[17px] h-[17px] text-amber-500 fill-amber-500 stroke-[2]" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
