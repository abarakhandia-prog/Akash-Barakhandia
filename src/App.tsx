import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SplashScreen } from './components/SplashScreen';
import { HomeTab } from './components/HomeTab';
import { CoursesTab } from './components/CoursesTab';
import { MockTestsTab } from './components/MockTestsTab';
import { ChatTab } from './components/ChatTab';
import { ProfileTab } from './components/ProfileTab';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { PdfReaderModal } from './components/PdfReaderModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { PaymentModal } from './components/PaymentModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { FlutterSourceModal } from './components/FlutterSourceModal';
import { Smartphone, Download, Sparkles, Layers } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeTab,
    viewMode,
    setViewMode,
    activePdf,
    setActivePdf,
    activeVideo,
    setActiveVideo,
    isFlutterModalOpen,
    setIsFlutterModalOpen,
  } = useApp();

  const [showSplash, setShowSplash] = useState(true);
  const [showApkModal, setShowApkModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans">
      {/* Splash Screen */}
      {showSplash && <SplashScreen onDismiss={() => setShowSplash(false)} />}

      {/* Floating APK Download Banner on Top for Android Users */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-4 py-2 text-xs flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 max-w-2xl truncate">
          <Smartphone className="w-4 h-4 text-emerald-200 shrink-0" />
          <span className="truncate">
            <strong>Install My Education Sathi App:</strong> Direct Android APK, offline study materials & instant mock tests.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowApkModal(true)}
            className="py-1 px-3 bg-white text-emerald-800 hover:bg-emerald-50 rounded-lg font-bold text-[11px] shadow-sm transition-all"
          >
            Get APK File
          </button>
        </div>
      </div>

      {/* Header */}
      <Header />

      {/* MAIN VIEWPORT CONTAINER */}
      {viewMode === 'mobile_frame' ? (
        /* Smartphone Simulation Frame */
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-200 dark:bg-slate-900">
          <div className="mb-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Smartphone Simulator (Android 15 Viewport)</span>
            <button
              onClick={() => setViewMode('responsive')}
              className="text-blue-600 dark:text-blue-400 font-semibold underline"
            >
              Switch to Full Desktop View
            </button>
          </div>

          <div className="relative w-full max-w-[410px] h-[820px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 flex flex-col overflow-hidden ring-8 ring-slate-900/40">
            {/* Phone Notch / Dynamic Island */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-700" />
            </div>

            {/* Inner Phone Screen */}
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[38px] overflow-hidden flex flex-col relative pt-6">
              {/* Mobile Status Bar */}
              <div className="px-6 py-1 flex items-center justify-between text-[11px] font-mono text-slate-500 shrink-0">
                <span>9:41 AM</span>
                <div className="flex items-center gap-1.5">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Scrollable Mobile Content */}
              <div className="flex-1 overflow-y-auto px-4 pt-2 pb-20">
                {activeTab === 'home' && <HomeTab />}
                {activeTab === 'courses' && <CoursesTab />}
                {activeTab === 'tests' && <MockTestsTab />}
                {activeTab === 'chat' && <ChatTab />}
                {activeTab === 'profile' && <ProfileTab onOpenApkModal={() => setShowApkModal(true)} />}
                {activeTab === 'admin' && <AdminDashboard />}
              </div>

              {/* Phone Bottom Nav */}
              <div className="absolute bottom-0 left-0 right-0">
                <BottomNav />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Full Desktop & Tablet Responsive View */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
          {activeTab === 'home' && <HomeTab />}
          {activeTab === 'courses' && <CoursesTab />}
          {activeTab === 'tests' && <MockTestsTab />}
          {activeTab === 'chat' && <ChatTab />}
          {activeTab === 'profile' && <ProfileTab onOpenApkModal={() => setShowApkModal(true)} />}
          {activeTab === 'admin' && <AdminDashboard />}
        </main>
      )}

      {/* Mobile Bottom Navigation (shown on mobile viewports) */}
      <div className="lg:hidden">
        {viewMode !== 'mobile_frame' && <BottomNav />}
      </div>

      {/* Global Modals */}
      <AuthModal />
      <PaymentModal />
      {showApkModal && <ApkDownloadModal onClose={() => setShowApkModal(false)} />}
      {isFlutterModalOpen && <FlutterSourceModal onClose={() => setIsFlutterModalOpen(false)} />}
      {activePdf && <PdfReaderModal material={activePdf} onClose={() => setActivePdf(null)} />}
      {activeVideo && <VideoPlayerModal material={activeVideo} onClose={() => setActiveVideo(null)} />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
