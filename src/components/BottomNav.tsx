import React from 'react';
import { Home, BookOpen, ClipboardCheck, MessageSquareQuote, UserCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t, currentUser } = useApp();

  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'superadmin' || currentUser.role === 'teacher';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe shadow-lg transition-colors">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all ${
            activeTab === 'home'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Home className={`w-5 h-5 transition-transform ${activeTab === 'home' ? 'scale-110' : ''}`} />
          <span className="text-[10px] tracking-tight mt-1 truncate">{t('home')}</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all ${
            activeTab === 'courses'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <BookOpen className={`w-5 h-5 transition-transform ${activeTab === 'courses' ? 'scale-110' : ''}`} />
          <span className="text-[10px] tracking-tight mt-1 truncate">{t('courses')}</span>
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all relative ${
            activeTab === 'tests'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <ClipboardCheck className={`w-5 h-5 transition-transform ${activeTab === 'tests' ? 'scale-110' : ''}`} />
          <span className="text-[10px] tracking-tight mt-1 truncate">{t('tests')}</span>
          <span className="absolute top-2 right-4 w-1.5 h-1.5 bg-amber-500 rounded-full" />
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all ${
            activeTab === 'chat'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <MessageSquareQuote className={`w-5 h-5 transition-transform ${activeTab === 'chat' ? 'scale-110' : ''}`} />
          <span className="text-[10px] tracking-tight mt-1 truncate">{t('chat')}</span>
        </button>

        <button
          onClick={() => setActiveTab(isAdmin ? 'admin' : 'profile')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all ${
            activeTab === 'profile' || activeTab === 'admin'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          {isAdmin ? (
            <ShieldCheck className={`w-5 h-5 transition-transform text-amber-500 ${activeTab === 'admin' ? 'scale-110' : ''}`} />
          ) : (
            <UserCircle className={`w-5 h-5 transition-transform ${activeTab === 'profile' ? 'scale-110' : ''}`} />
          )}
          <span className="text-[10px] tracking-tight mt-1 truncate">{isAdmin ? 'Admin' : t('profile')}</span>
        </button>
      </div>
    </nav>
  );
};
