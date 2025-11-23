import React from 'react';
import { BookOpen, Brain, Settings as SettingsIcon, Clock } from 'lucide-react';
import { Settings } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  settings: Settings;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, settings }) => {
  const getFontSize = () => {
    switch (settings.fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${getFontSize()} bg-sand-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200`}>
      {/* Top Header */}
      <header className="bg-emerald-700 dark:bg-emerald-900 text-white p-4 shadow-md sticky top-0 z-20">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-300" />
            <h1 className="text-xl font-bold font-serif tracking-wide">Quran WordMaster</h1>
          </div>
          {settings.lockScreenEnabled && (
             <button 
             onClick={() => onTabChange('standby')}
             className="text-xs bg-emerald-800 dark:bg-emerald-950 px-2 py-1 rounded-full flex items-center gap-1 hover:bg-emerald-900 dark:hover:bg-black transition"
           >
             <Clock size={12} /> Standby
           </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto p-4 pb-24 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-2 z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] transition-colors duration-300">
        <div className="max-w-3xl mx-auto flex justify-around items-center">
          <NavButton 
            active={activeTab === 'bank'} 
            onClick={() => onTabChange('bank')} 
            icon={<BookOpen size={24} />} 
            label="Word Bank" 
          />
          <NavButton 
            active={activeTab === 'quiz'} 
            onClick={() => onTabChange('quiz')} 
            icon={<Brain size={24} />} 
            label="Quiz" 
          />
          <NavButton 
            active={activeTab === 'settings'} 
            onClick={() => onTabChange('settings')} 
            icon={<SettingsIcon size={24} />} 
            label="Settings" 
          />
        </div>
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${
      active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'
    }`}
  >
    {icon}
    <span className="text-xs font-medium mt-1">{label}</span>
  </button>
);

export default Layout;