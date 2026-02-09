
import React from 'react';
import { AppScreen } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  hideNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeScreen, setScreen, hideNav }) => {
  const navItems = [
    { id: AppScreen.HOME, label: 'Главная', icon: '🏠' },
    { id: AppScreen.REWARDS, label: 'Награды', icon: '🎁' },
    { id: AppScreen.ASSISTANT, label: 'ИИ', icon: '🤖' },
    { id: AppScreen.PROFILE, label: 'Профиль', icon: '👤' },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 overflow-hidden shadow-2xl relative">
      <header className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          LoyaltyPro
        </h1>
        <div className="flex items-center space-x-2">
           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
           <span className="text-xs text-gray-400 font-medium">Online</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>

      {!hideNav && (
        <nav className="fixed bottom-0 w-full max-w-md bg-white/80 backdrop-blur-lg border-t border-gray-100 px-4 py-2 flex justify-around items-center z-20">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`flex flex-col items-center p-2 transition-all duration-200 ${
                activeScreen === item.id ? 'text-indigo-600 scale-110' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};

export default Layout;
