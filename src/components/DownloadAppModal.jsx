import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Download,
  Share2,
  PlusSquare,
  CheckCircle2,
  QrCode,
  Sparkles,
  Apple,
  ExternalLink
} from 'lucide-react';

export default function DownloadAppModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('android'); // 'android' | 'apple'
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        alert("VidyaSetu App installed successfully on your phone!");
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else {
      alert("To install: Open this link in Google Chrome, tap the 3 dots menu (⋮), and select 'Install app' or 'Add to Home screen'.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#05574F] text-[#FDBE3E] flex items-center justify-center shadow-md">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
              Download Parent App
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Android & Apple iPhone Mobile Apps
            </p>
          </div>
        </div>

        {/* OS Switcher Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-5">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'android'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🤖 Android (APK / App)</span>
          </button>
          <button
            onClick={() => setActiveTab('apple')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'apple'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🍏 Apple iPhone (iOS)</span>
          </button>
        </div>

        {/* Tab 1: Android Instructions & Install */}
        {activeTab === 'android' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 space-y-2">
              <span className="font-extrabold text-emerald-900 text-sm block">
                Android फोन में कैसे चलाएं:
              </span>
              <p className="leading-relaxed">
                1. <strong>Direct 1-Click Install</strong>: नीचे दिए गए हरे बटन पर क्लिक करें। ऐप आपके फोन की होम स्क्रीन पर एक असली ऐप (APK) की तरह इंस्टॉल हो जाएगी।
              </p>
              <p className="leading-relaxed">
                2. <strong>Chrome Browser से</strong>: Chrome में 3 डॉट्स (⋮) दबाएं और <strong>"Install app"</strong> या <strong>"Add to Home screen"</strong> चुनें।
              </p>
            </div>

            <button
              onClick={handleInstallClick}
              className="w-full py-3 rounded-2xl bg-[#05574F] hover:bg-[#076c62] text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-[#FDBE3E]" />
              <span>Install VidyaSetu App on Android</span>
            </button>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-600 block">Native Flutter APK Code</span>
              <span className="text-[10px] text-slate-400">
                Play Store / Release APK code is available in <code className="text-blue-600 font-mono">flutter_app/</code>
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Apple iPhone Instructions */}
        {activeTab === 'apple' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-2.5">
              <span className="font-extrabold text-slate-900 text-sm block flex items-center gap-1.5">
                <Apple className="w-4 h-4" />
                iPhone (iOS) में कैसे इंस्टॉल करें:
              </span>
              <div className="flex items-start gap-2 pt-1">
                <span className="w-5 h-5 rounded-full bg-slate-200 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                <p>iPhone के <strong>Safari Browser</strong> में यह वेबसाइट खोलें।</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-200 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                <p className="flex items-center gap-1">
                  नीचे दिए गए <strong>Share बटन <Share2 className="w-3.5 h-3.5 inline text-blue-600" /></strong> पर टैप करें।
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-200 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                <p className="flex items-center gap-1">
                  लिस्ट में नीचे स्क्रॉल करके <strong>"Add to Home Screen <PlusSquare className="w-3.5 h-3.5 inline text-slate-700" />"</strong> चुनें।
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-200 font-bold flex items-center justify-center shrink-0 text-[10px]">4</span>
                <p>ऊपर दाएं कोने में <strong>"Add"</strong> दबाएं। ऐप का आइकन आपके iPhone पर आ जाएगा!</p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
              <span className="text-[11px] font-bold text-amber-900 block">✨ No App Store Fee Needed</span>
              <span className="text-[10px] text-amber-700">
                PWA technology lets parents use it on iPhone like a native app with zero delay.
              </span>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Version 1.0 (Mobile Ready)</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> PWA Certified
          </span>
        </div>
      </div>
    </div>
  );
}
