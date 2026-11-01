import React, { useState } from 'react';
import {
  GraduationCap,
  Globe,
  Sun,
  Moon,
  Bell,
  Smartphone,
  Monitor,
  Sparkles,
  ShieldCheck,
  User,
  LogOut,
  Code2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    theme,
    toggleTheme,
    viewMode,
    setViewMode,
    currentUser,
    logout,
    activeTab,
    setActiveTab,
    openPaymentModal,
    setIsAuthModalOpen,
    setIsFlutterModalOpen,
    notifications,
    markNotificationAsRead,
  } = useApp();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const handleLangSelect = (lang: Language) => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark with icon */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 whitespace-nowrap">
                {language === 'or' ? 'ମୋ ଶିକ୍ଷା ସାଥୀ' : language === 'hi' ? 'माई एजुकेशन साथी' : 'My Education Sathi'}
              </span>
              <span className="hidden sm:block text-[11px] font-medium text-blue-600 dark:text-blue-400 leading-none">
                {language === 'or' ? 'ଓଡ଼ିଶା ଓ ସର୍ବଭାରତୀୟ ଶିକ୍ଷା ପୋର୍ଟାଲ' : 'India\'s Smart Learning Companion'}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeTab === 'home'
                ? 'text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 dark:border-blue-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('home')}
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeTab === 'courses'
                ? 'text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 dark:border-blue-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('courses')}
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeTab === 'tests'
                ? 'text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 dark:border-blue-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('tests')}
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeTab === 'chat'
                ? 'text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 dark:border-blue-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('chat')}
          </button>
          {(currentUser.role === 'admin' || currentUser.role === 'superadmin' || currentUser.role === 'teacher') && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`transition-colors whitespace-nowrap py-1 text-amber-600 dark:text-amber-400 font-semibold ${
                activeTab === 'admin' ? 'border-b-2 border-amber-600' : 'hover:opacity-80'
              }`}
            >
              {t('adminDashboard')}
            </button>
          )}
        </nav>

        {/* Zone 3: Actions (Language, Theme, View Toggle, Flutter Code, Premium CTA / User Profile) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Flutter Source Code viewer button */}
          <button
            onClick={() => setIsFlutterModalOpen(true)}
            title="View Full Flutter App Source Code"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <Code2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Flutter Code</span>
          </button>

          {/* View Mode Toggle (Desktop vs Mobile Frame) */}
          <button
            onClick={() => setViewMode(viewMode === 'responsive' ? 'mobile_frame' : 'responsive')}
            title={viewMode === 'responsive' ? 'Switch to Smartphone Simulator Frame' : 'Switch to Full Desktop View'}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {viewMode === 'responsive' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4 text-blue-600" />}
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 p-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Select Language"
            >
              <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="uppercase text-[11px]">{language}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs">
                <button
                  onClick={() => handleLangSelect('en')}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 ${
                    language === 'en' ? 'font-bold text-blue-600' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>English</span>
                  {language === 'en' && <span>✓</span>}
                </button>
                <button
                  onClick={() => handleLangSelect('hi')}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 ${
                    language === 'hi' ? 'font-bold text-blue-600' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>हिन्दी (Hindi)</span>
                  {language === 'hi' && <span>✓</span>}
                </button>
                <button
                  onClick={() => handleLangSelect('or')}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 ${
                    language === 'or' ? 'font-bold text-blue-600' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>ଓଡ଼ିଆ (Odia)</span>
                  {language === 'or' && <span>✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-3 px-4 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</h4>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{unreadNotifs} unread</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700 mt-2">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`py-2.5 px-2 rounded-lg cursor-pointer transition-colors ${
                        notif.read ? 'opacity-70 hover:bg-slate-50 dark:hover:bg-slate-750' : 'bg-blue-50/50 dark:bg-blue-950/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-xs text-slate-900 dark:text-white line-clamp-1">{notif.title}</span>
                        {notif.badge && (
                          <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded">
                            {notif.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">{notif.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{notif.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Premium CTA Button */}
          {(!currentUser.planId || currentUser.planId === 'plan_free') && (
            <button
              onClick={() => openPaymentModal()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-lg shadow-sm shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>{t('upgradeNow')}</span>
            </button>
          )}

          {/* User Profile / Login Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs ring-2 ring-blue-600/20">
                {currentUser.name ? currentUser.name.charAt(0) : 'U'}
              </div>
              <div className="hidden md:block text-left pr-1">
                <span className="block text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-1 max-w-[100px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                  {currentUser.role}
                </span>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                  <p className="font-semibold text-slate-900 dark:text-white line-clamp-1">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{currentUser.email}</p>
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded font-medium text-[10px]">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Plan: {currentUser.planName || 'Free'}</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>My Profile & Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Switch Role / Account</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
