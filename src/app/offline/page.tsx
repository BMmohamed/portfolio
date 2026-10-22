'use client';

import { useState } from 'react';
import { WifiOff, RefreshCw, Home, PhoneCall } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      window.location.reload();
    }, 800);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 text-center select-none"
      style={{
        background: 'radial-gradient(circle at 50% 30%, #1e293b 0%, #0f172a 75%, #020617 100%)',
      }}
    >
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-amber-500/25 rounded-3xl p-8 shadow-2xl shadow-black/80 animate-in fade-in zoom-in-95 duration-300">
        {/* Animated Badge */}
        <div className="relative w-22 h-22 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 flex items-center justify-center text-amber-400">
          <div className="absolute inset-0 rounded-2xl border border-amber-400/40 animate-ping opacity-25" />
          <WifiOff className="w-11 h-11" />
        </div>

        {/* Brand identity */}
        <div className="text-xs font-black text-amber-400 uppercase tracking-widest mb-2">
          رؤية العقارية
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white mb-3">
          لا يوجد اتصال بالإنترنت
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-8 max-w-sm mx-auto">
          يبدو أنك غير متصل بالشبكة حالياً. يرجى التحقق من اتصال الواي فاي أو بيانات الهاتف المحمول ثم إعادة المحاولة.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer active:scale-98 disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
            <span>{retrying ? 'جاري التحقق...' : 'إعادة المحاولة'}</span>
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700/60 transition-colors"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>العودة للرئيسية المحفوظة</span>
          </Link>
        </div>

        <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-400">
          <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
          <span>هاتف خدمة العملاء: <span dir="ltr" className="font-mono text-slate-300 font-bold">+966 50 123 4567</span></span>
        </div>
      </div>
    </div>
  );
}
