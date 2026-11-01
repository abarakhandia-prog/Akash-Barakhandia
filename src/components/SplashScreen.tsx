import React, { useState, useEffect } from 'react';
import { GraduationCap, ArrowRight, BookOpen, Award, CheckCircle2, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';

export const SplashScreen: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  const { language, setLanguage, t } = useApp();
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 15;
      });
    }, 180);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white p-6 overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <img
          src="/src/assets/images/hero_education_banner_1793505372269.jpg"
          alt="Education background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-[2px]" />
      </div>

      {/* Top language selector pill */}
      <div className="relative z-10 w-full flex justify-between items-center max-w-md pt-4">
        <div className="flex items-center gap-1.5 text-xs text-blue-200 font-medium">
          <Globe className="w-3.5 h-3.5" />
          <span>Language:</span>
        </div>
        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded transition-colors ${
              language === 'en' ? 'bg-white text-blue-900 shadow-sm' : 'text-blue-100 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2.5 py-1 rounded transition-colors ${
              language === 'hi' ? 'bg-white text-blue-900 shadow-sm' : 'text-blue-100 hover:text-white'
            }`}
          >
            हिन्दी
          </button>
          <button
            onClick={() => setLanguage('or')}
            className={`px-2.5 py-1 rounded transition-colors ${
              language === 'or' ? 'bg-white text-blue-900 shadow-sm' : 'text-blue-100 hover:text-white'
            }`}
          >
            ଓଡ଼ିଆ
          </button>
        </div>
      </div>

      {/* Main Center Branding & Value Proposition */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md my-auto px-4">
        {/* Animated Icon Glow */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-500 to-amber-400 p-1 shadow-2xl shadow-blue-500/40">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center">
              <GraduationCap className="w-12 h-12 text-blue-400 animate-pulse" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
          {language === 'or' ? 'ମୋ ଶିକ୍ଷା ସାଥୀ' : language === 'hi' ? 'माई एजुकेशन साथी' : 'My Education Sathi'}
        </h1>
        <p className="text-blue-200 text-sm sm:text-base font-normal max-w-xs mb-8">
          {t('tagline')}
        </p>

        {/* Feature Pills (No mechanical badges, clean editorial bullets) */}
        <div className="grid grid-cols-2 gap-3 text-left w-full mb-8 text-xs text-blue-100 bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>School Class 1–12</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>+2 & +3 UG College</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Govt Exam (OSSC/Police)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>IGNOU DECE 1–4</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs bg-white/15 h-1.5 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-amber-400 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[11px] text-blue-300 font-medium">
          {progress < 100 ? 'Loading courses, notes & mock tests...' : 'Ready! Welcome aboard'}
        </span>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 w-full max-w-md pb-6 flex flex-col items-center">
        <button
          onClick={onDismiss}
          className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-[0.98] transition-all"
        >
          <span>{language === 'or' ? 'ଅଧ୍ୟୟନ ଆରମ୍ଭ କରନ୍ତୁ' : language === 'hi' ? 'पढ़ाई शुरू करें' : 'Start Learning Now'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <span className="text-[11px] text-blue-300/80 mt-3">
          Trusted by over 50,000+ students across Odisha & India
        </span>
      </div>
    </div>
  );
};
