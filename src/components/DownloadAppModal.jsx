import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Download,
  Share2,
  PlusSquare,
  CheckCircle2,
  Apple,
  ExternalLink,
  Copy,
  Check,
  FileDown,
  Info,
  Sparkles
} from 'lucide-react';

export default function DownloadAppModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('android'); // 'android' | 'apple'
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-detect user's mobile OS on mount
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setActiveTab('apple');
    } else if (/android/.test(ua)) {
      setActiveTab('android');
    }

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
        alert("✅ VidyaSetu App installed successfully on your phone!");
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else {
      alert("📱 Android Installation Guide:\n\n1. Open Google Chrome on your phone.\n2. Tap the 3 dots menu (⋮) at top right.\n3. Tap 'Install app' or 'Add to Home screen'.\n\nApp icon will be added to your home screen!");
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleWhatsAppShare = () => {
    const appUrl = window.location.href;
    const msg = encodeURIComponent(
      `🏫 *VidyaSetu School Parent Mobile App*\n\nParents apne bacche ki attendance, homework, fees aur results live dekhne ke liye yahan se app download karein:\n👉 ${appUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#05574F] text-[#FDBE3E] flex items-center justify-center shadow-md shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
              Install VidyaSetu App
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Android APK & Apple iPhone Mobile Apps
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

        {/* TAB 1: ANDROID (APK & 1-Click Install) */}
        {activeTab === 'android' && (
          <div className="space-y-4">
            
            {/* Primary Action 1: 1-Click WebAPK Phone Install */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Method 1: Direct 1-Click Phone Install
                </span>
                <span className="text-[10px] font-black bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                  Fastest
                </span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Neeche diye gaye button par click karein. App bina kisi external download ke turant aapke phone par ek official Android app ki tarah install ho jayegi.
              </p>
              <button
                onClick={handleInstallClick}
                className="w-full py-3 rounded-2xl bg-[#05574F] hover:bg-[#076c62] text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-98"
              >
                <Download className="w-4 h-4 text-[#FDBE3E]" />
                <span>Install VidyaSetu App on Android Phone</span>
              </button>
            </div>

            {/* Primary Action 2: Direct APK Download */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <FileDown className="w-4 h-4 text-blue-600" />
                  Method 2: Android APK Package (.apk)
                </span>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Android APK
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Agar aap direct <strong>.apk installer file</strong> download karna chahte hain:
              </p>
              
              <div className="flex flex-col gap-2">
                <a
                  href="https://www.pwabuilder.com/reportcard?site=https://abhi420m.github.io/school-app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs text-center flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Signed APK (PWABuilder Android)</span>
                </a>
                <a
                  href="https://github.com/Abhi420m/school-app/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs text-center flex items-center justify-center gap-1 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>GitHub Releases (All APK Versions)</span>
                </a>
              </div>
            </div>

            {/* Manual Chrome Tip */}
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Chrome Tip:</strong> Phone ke Chrome me upar 3 dots (⋮) dabayein aur <strong>"Install app"</strong> ya <strong>"Add to Home screen"</strong> par tap karein.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: APPLE IPHONE & IPAD (iOS) */}
        {activeTab === 'apple' && (
          <div className="space-y-4">
            
            {/* iOS Safari Step-by-Step Installation */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Apple className="w-4 h-4 text-slate-900" />
                  iPhone (iOS) में कैसे इंस्टॉल करें:
                </span>
                <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
                  Safari iOS
                </span>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-[#05574F] text-white font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                  <p className="text-xs text-slate-700">
                    iPhone ya iPad ke <strong>Safari Browser</strong> me is link ko open karein.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-[#05574F] text-white font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                  <p className="text-xs text-slate-700 flex items-center gap-1.5 flex-wrap">
                    Neeche beech me diye gaye <strong>Share button (Square with Up Arrow <Share2 className="w-3.5 h-3.5 inline text-blue-600" />)</strong> par tap karein.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-[#05574F] text-white font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                  <p className="text-xs text-slate-700 flex items-center gap-1.5 flex-wrap">
                    Menu ko scroll karein aur <strong>"Add to Home Screen (होम स्क्रीन पर जोड़ें <PlusSquare className="w-3.5 h-3.5 inline text-slate-900" />)"</strong> par click karein.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-[#05574F] text-white font-bold flex items-center justify-center shrink-0 text-[10px]">4</span>
                  <p className="text-xs text-slate-700">
                    Upar right corner me <strong>"Add"</strong> dabayein. VidyaSetu App ka icon aapke iPhone ki screen par aa jayega!
                  </p>
                </div>
              </div>
            </div>

            {/* Direct iOS WebClip Profile */}
            <div className="p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-100 space-y-2">
              <span className="text-xs font-extrabold text-indigo-950 block">
                📲 Direct iOS Configuration Profile
              </span>
              <p className="text-[11px] text-indigo-900 leading-relaxed">
                Apple users direct profile download karke bhi app shortcut add kar sakte hain:
              </p>
              <a
                href="./vidyasetu-school.mobileconfig"
                download="vidyasetu-school.mobileconfig"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Apple iOS Profile (.mobileconfig)</span>
              </a>
            </div>
          </div>
        )}

        {/* Share & Copy Link Section */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Parents ko Link Bhejein:
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
            >
              <span>💬 WhatsApp par bhejein</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>VidyaSetu v1.0.0</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Android & iOS Certified
          </span>
        </div>
      </div>
    </div>
  );
}
