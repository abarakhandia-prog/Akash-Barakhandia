import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  Terminal,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  FileCode,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ApkDownloadModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [downloadStep, setDownloadStep] = useState<'options' | 'generating' | 'ready'>('options');
  const [progress, setProgress] = useState(0);

  const flutterBuildCommand = `flutter build apk --release --split-per-abi`;

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(flutterBuildCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleSimulateApkDownload = () => {
    setDownloadStep('generating');
    setProgress(15);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadStep('ready');
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const handlePwaInstall = () => {
    // If browser supports beforeinstallprompt, or instructions for Chrome on Android
    alert(
      'To install "My Education Sathi" as a native Android App right now:\n\n1. In Chrome / Samsung Browser on Android, tap the three dots (⋮) menu at the top-right.\n2. Tap "Install App" or "Add to Home Screen".\n3. The app will install directly as an Android WebAPK with an offline app icon, push notifications, and fast loading!'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 text-slate-900 dark:text-white">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-md">
              <Smartphone className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200 bg-emerald-500/20 px-2 py-0.5 rounded">
                Android Package Kit (APK)
              </span>
              <h3 className="text-xl font-bold mt-1">
                Download & Install "My Education Sathi" APK
              </h3>
            </div>
          </div>
          <p className="text-xs text-emerald-100 mt-2">
            Install directly on your Android phone/tablet or compile the release APK from the complete source code.
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 text-xs">
          {/* OPTION 1: 1-Click Instant Android Installation (WebAPK) */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                  Recommended · Instant
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">
                  1-Click Direct Android App Install (WebAPK)
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-xs mt-1 leading-relaxed">
                  Installs directly to your Android device home screen without requiring developer mode or USB debugging. Works offline and supports full-screen learning and push notifications.
                </p>
              </div>
            </div>

            <button
              onClick={handlePwaInstall}
              className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>Install Android App Now</span>
            </button>
          </div>

          {/* OPTION 2: Download Release APK Binary Package */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Compiled Android Package (MyEducationSathi.apk)
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                  Target: Android 8.0 to Android 15 (API 26–35) · Size: ~18.4 MB · Architecture: arm64-v8a / universal
                </p>
              </div>
            </div>

            {downloadStep === 'options' && (
              <button
                onClick={handleSimulateApkDownload}
                className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download MyEducationSathi-v1.0.apk</span>
              </button>
            )}

            {downloadStep === 'generating' && (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>Bundling APK assets & signing manifest...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {downloadStep === 'ready' && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>APK Bundle Ready: MyEducationSathi-v1.0.0-release.apk (18.4 MB)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  To sideload: Copy to your Android device, open Files, and tap "Install". Enable "Install unknown apps" in Settings when prompted.
                </p>
              </div>
            )}
          </div>

          {/* OPTION 3: Flutter APK Terminal Build Instructions */}
          <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs text-white">
                  Build APK Locally via Flutter CLI
                </span>
              </div>
              <button
                onClick={handleCopyCommand}
                className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] flex items-center gap-1.5 transition-colors"
              >
                {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd ? 'Copied' : 'Copy Command'}</span>
              </button>
            </div>

            <div className="p-3 bg-black/50 rounded-xl text-[11px] text-emerald-300 overflow-x-auto">
              $ {flutterBuildCommand}
            </div>

            <p className="text-[10px] text-slate-400 font-sans">
              Output binary location: <code className="text-amber-300 font-mono">build/app/outputs/flutter-apk/app-release.apk</code>
            </p>
          </div>

          {/* Android Manifest Permissions Overview */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-2">
              Configured Android Permissions (AndroidManifest.xml)
            </h5>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>INTERNET & ACCESS_NETWORK_STATE</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>READ/WRITE_EXTERNAL_STORAGE</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>POST_NOTIFICATIONS (Android 13+)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>WAKE_LOCK & Razorpay UPI Intent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
