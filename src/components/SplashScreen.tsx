'use client';

import { useState, useEffect } from 'react';
import { Building2, Sparkles } from 'lucide-react';

export default function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Check if splash already ran during this session
    try {
      const hasShown = sessionStorage.getItem('ruya_aqar_splash_shown');
      if (hasShown) {
        setShouldRender(false);
        return;
      }
    } catch {
      // Fallback if sessionStorage is restricted
    }

    setMounted(true);

    // Initial display duration before smooth fade-out
    const timer = setTimeout(() => {
      setIsExiting(true);
      try {
        sessionStorage.setItem('ruya_aqar_splash_shown', 'true');
      } catch {
        // Safe catch
      }
    }, 900);

    // Remove from DOM after fade-out transition finishes
    const unmountTimer = setTimeout(() => {
      setShouldRender(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-950 transition-all duration-700 ease-out select-none ${
        isExiting
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 35%, #1e293b 0%, #0f172a 70%, #020617 100%)',
      }}
    >
      {/* Background ambient lighting */}
      <div className="absolute w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Main Logo & Identity Container */}
      <div
        className={`relative flex flex-col items-center text-center px-6 transition-all duration-700 ease-out ${
          mounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'
        }`}
      >
        {/* Animated Icon Badge */}
        <div className="relative mb-6">
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/30 to-amber-300/10 rounded-3xl blur-md animate-pulse" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 shadow-2xl flex items-center justify-center overflow-hidden">
            <Building2 className="w-10 h-10 text-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]" />
            
            {/* Shimmer line across badge */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-amber-300 animate-bounce" />
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-400 tracking-tight drop-shadow-sm mb-2">
          رؤية العقارية
        </h1>

        {/* Subtitle / Slogan */}
        <p className="text-xs sm:text-sm text-slate-400 max-w-xs font-medium leading-relaxed">
          الريادة والتميز في الوساطة والاستثمار العقاري
        </p>

        {/* Minimalist Progress Loader */}
        <div className="w-40 h-1 bg-slate-800/80 rounded-full mt-8 overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full animate-[progress_1.2s_ease-in-out_infinite]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes progress {
          0% {
            left: -40%;
            width: 40%;
          }
          50% {
            left: 20%;
            width: 60%;
          }
          100% {
            left: 100%;
            width: 30%;
          }
        }
      `}</style>
    </div>
  );
}
