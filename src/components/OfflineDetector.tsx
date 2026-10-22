'use client';

import { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, CheckCircle2, X } from 'lucide-react';

export default function OfflineDetector() {
  const [isOffline, setIsOffline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [showRestoredToast, setShowRestoredToast] = useState(false);
  const [dismissedFullOverlay, setDismissedFullOverlay] = useState(false);

  useEffect(() => {
    // Initial check
    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);

      const handleOnline = () => {
        setIsOffline(false);
        setDismissedFullOverlay(false);
        setShowRestoredToast(true);
        const timer = setTimeout(() => {
          setShowRestoredToast(false);
        }, 4000);
        return () => clearTimeout(timer);
      };

      const handleOffline = () => {
        setIsOffline(true);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      if (typeof window !== 'undefined') {
        if (navigator.onLine) {
          setIsOffline(false);
          window.location.reload();
        }
      }
    }, 1000);
  };

  // 1. Connection Restored Toast
  if (showRestoredToast) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs font-bold shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>تمت استعادة الاتصال بالإنترنت بنجاح!</span>
      </div>
    );
  }

  // Not offline, nothing to render
  if (!isOffline) return null;

  // 2. Offline Mode
  return (
    <>
      {/* Persistent Mini Banner (if full overlay dismissed) */}
      {dismissedFullOverlay ? (
        <div className="fixed top-0 inset-x-0 z-[9999] bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>أنت تتصفح الموقع حالياً دون اتصال بالإنترنت (البيانات المحفوظة).</span>
          </div>
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center gap-1.5 bg-slate-950 text-amber-300 hover:text-white px-3 py-1 rounded-lg text-[11px] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>إعادة المحاولة</span>
          </button>
        </div>
      ) : (
        /* Full Screen Luxury Offline Overlay */
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/20 rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-black/80">
            {/* Close button to allow browsing cached pages */}
            <button
              onClick={() => setDismissedFullOverlay(true)}
              aria-label="إغلاق التنبيه"
              className="absolute top-4 left-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Offline Icon with Pulse */}
            <div className="relative w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <div className="absolute inset-0 rounded-2xl border border-amber-400/40 animate-ping opacity-25" />
              <WifiOff className="w-10 h-10" />
            </div>

            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              رؤية العقارية
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mb-2.5">
              لا يوجد اتصال بالإنترنت
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
              يبدو أنك غير متصل بالشبكة حالياً. يرجى التحقق من اتصال الواي فاي أو باقة البيانات في جهازك ثم المحاولة مرة أخرى.
            </p>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-98 disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                <span>{isRetrying ? 'جاري التحقق من الاتصال...' : 'إعادة المحاولة'}</span>
              </button>

              <button
                onClick={() => setDismissedFullOverlay(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700/60 transition-colors cursor-pointer"
              >
                تصفح المحتوى المحفوظ محلياً
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>جاري محاولة الاتصال التلقائي عند توفر الشبكة</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
