'use client';

import { Sun, Moon } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Navbar({ darkMode, onToggleDarkMode }: NavbarProps) {
  return (
    <nav className={`sticky top-0 z-50 border-b transition-colors ${
      darkMode
        ? 'bg-slate-900 border-slate-700'
        : 'bg-white border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
            <span className="text-xl">🌍</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">CarbonMind</h1>
            <p className={`text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Your personal carbon footprint analyzer</p>
          </div>
        </div>

        <button
          onClick={onToggleDarkMode}
          className={`p-2 rounded-lg transition-colors ${
            darkMode
              ? 'hover:bg-slate-800 text-gray-300'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
}
