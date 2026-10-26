'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Menu, X, PlusCircle, ShieldCheck, PhoneCall, Lock } from 'lucide-react';
import { AGENCY_CONFIG } from '@/lib/data';

interface NavbarProps {
  onOpenRequestModal?: () => void;
}

export default function Navbar({ onOpenRequestModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling and intercept ANY outside click/touch before it reaches page elements
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Intercept any click or touch outside the drawer during capture phase
      const handleOutsideInteraction = (e: Event) => {
        const drawer = document.getElementById('mobile-drawer-panel');
        const target = e.target as Node | null;
        if (drawer && target && !drawer.contains(target)) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          setMobileMenuOpen(false);
        }
      };

      window.addEventListener('click', handleOutsideInteraction, { capture: true });
      window.addEventListener('touchend', handleOutsideInteraction, { capture: true });
      window.addEventListener('pointerup', handleOutsideInteraction, { capture: true });

      return () => {
        document.body.style.overflow = originalOverflow;
        // Keep blocking stray ghost clicks for 350ms while the drawer slides out
        setTimeout(() => {
          window.removeEventListener('click', handleOutsideInteraction, { capture: true });
          window.removeEventListener('touchend', handleOutsideInteraction, { capture: true });
          window.removeEventListener('pointerup', handleOutsideInteraction, { capture: true });
        }, 350);
      };
    }
  }, [mobileMenuOpen]);

  const [showHeader, setShowHeader] = useState(true);
  const showHeaderRef = useRef(true);
  const lastScrollYRef = useRef(0);
  const accumulatedDeltaRef = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('up');
  const tickingRef = useRef(false);

  // Ultra-lightweight Smart Header: runs on RAF, guards against repeated state updates, zero re-renders while scrolling
  useEffect(() => {
    lastScrollYRef.current = window.scrollY || 0;

    const updateHeader = () => {
      const currentScrollY = window.scrollY || 0;
      const prevScrollY = lastScrollYRef.current;
      const diff = currentScrollY - prevScrollY;

      // Always show when near top of page (within 45px)
      if (currentScrollY <= 45) {
        if (!showHeaderRef.current) {
          showHeaderRef.current = true;
          setShowHeader(true);
        }
        accumulatedDeltaRef.current = 0;
      } else if (diff > 0) {
        // Moving DOWN
        if (scrollDirectionRef.current !== 'down') {
          scrollDirectionRef.current = 'down';
          accumulatedDeltaRef.current = 0;
        }
        accumulatedDeltaRef.current += diff;

        // Hide when moving down past top threshold (only trigger if currently visible)
        if (accumulatedDeltaRef.current > 16 && currentScrollY > 70) {
          if (showHeaderRef.current) {
            showHeaderRef.current = false;
            setShowHeader(false);
          }
        }
      } else if (diff < 0) {
        // Moving UP
        if (scrollDirectionRef.current !== 'up') {
          scrollDirectionRef.current = 'up';
          accumulatedDeltaRef.current = 0;
        }
        accumulatedDeltaRef.current += Math.abs(diff);

        // Reveal instantly when moving up (only trigger if currently hidden)
        if (accumulatedDeltaRef.current > 8) {
          if (!showHeaderRef.current) {
            showHeaderRef.current = true;
            setShowHeader(true);
          }
        }
      }

      lastScrollYRef.current = currentScrollY;
      tickingRef.current = false;
    };

    const handleScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        window.requestAnimationFrame(updateHeader);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'العروض العقارية', href: '/properties' },
    { name: 'طلبات العملاء', href: '/requests' },
    { name: 'خدماتنا', href: '/services' },
    { name: 'من نحن', href: '/about' },
    { name: 'تواصل معنا', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const isHeaderVisible = showHeader || mobileMenuOpen;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 w-full bg-white md:bg-white/95 md:backdrop-blur-md border-b border-slate-200/80 shadow-xs ${
          isHeaderVisible
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
        style={{
          transform: isHeaderVisible ? 'translateY(0%)' : 'translateY(-100%)',
          pointerEvents: isHeaderVisible ? 'auto' : 'none',
          visibility: isHeaderVisible ? 'visible' : 'hidden',
          transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
        }}
        aria-hidden={!isHeaderVisible}
      >
      {/* Top micro bar for license & contact */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              خدمات وساطة وتسويق عقاري احترافي
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline">س.ت: {AGENCY_CONFIG.crNumber}</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${AGENCY_CONFIG.mobile}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span dir="ltr">{AGENCY_CONFIG.mobile}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-900 via-sky-800 to-amber-600 flex items-center justify-center text-white shadow-md shadow-sky-950/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-amber-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-sky-900 transition-colors">
                {AGENCY_CONFIG.name}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                للتسويق والاستثمار العقاري
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? 'text-sky-900 bg-sky-50 shadow-xs'
                      : 'text-slate-600 hover:text-sky-900 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            {onOpenRequestModal ? (
              <button
                onClick={onOpenRequestModal}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>أضف طلبك العقاري</span>
              </button>
            ) : (
              <Link
                href="/requests?new=1"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>أضف طلبك العقاري</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Render Mobile Drawer & Overlay via Portal to escape header backdrop-filter containing block */}
      {mounted &&
        createPortal(
          <>
            {/* Mobile Backdrop Overlay: Functions as a full-screen button catching any touch/click to close */}
            <div
              id="mobile-drawer-backdrop"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMobileMenuOpen(false);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMobileMenuOpen(false);
              }}
              aria-label="إغلاق القائمة"
              className={`fixed inset-0 z-[9998] bg-slate-950/45 backdrop-blur-[2px] transition-opacity duration-300 sm:hidden cursor-pointer ${
                mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
              style={{ touchAction: 'none' }}
            />

            {/* Mobile Side Drawer (Slides from Right, ~70% screen width) */}
            <aside
              id="mobile-drawer-panel"
              onClick={(e) => e.stopPropagation()}
              className={`fixed top-0 right-0 bottom-0 z-[9999] h-screen w-[70vw] max-w-[310px] bg-white text-slate-800 shadow-2xl flex flex-col justify-between border-l border-slate-200 transition-transform duration-300 ease-out sm:hidden ${
                mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
              style={{ touchAction: 'pan-y' }}
            >
              <div>
                {/* Drawer Header with Logo & Close Button */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-900 via-sky-800 to-amber-600 flex items-center justify-center text-white shadow-xs">
                      <Building2 className="w-5 h-5 text-amber-300" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900 leading-tight">
                        {AGENCY_CONFIG.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        تسويق واستثمار عقاري
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
                    aria-label="إغلاق القائمة"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Items */}
                <nav className="p-3 space-y-1">
                  {navLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          active
                            ? 'text-sky-950 bg-sky-50 shadow-xs border-r-3 border-sky-900'
                            : 'text-slate-700 hover:text-sky-900 hover:bg-slate-100/70'
                        }`}
                      >
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-3">
                {onOpenRequestModal ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenRequestModal();
                    }}
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md text-xs cursor-pointer active:scale-98 transition-transform"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>أضف طلبك العقاري</span>
                  </button>
                ) : (
                  <Link
                    href="/requests?new=1"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md text-xs active:scale-98 transition-transform"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>أضف طلبك العقاري</span>
                  </Link>
                )}

                <a
                  href={`tel:${AGENCY_CONFIG.mobile}`}
                  className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 py-1"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  <span dir="ltr">{AGENCY_CONFIG.mobile}</span>
                </a>

                {/* Subtle temporary admin portal link */}
                <div className="pt-2 border-t border-slate-200/50 flex items-center justify-center">
                  <Link
                    href="/admin/properties"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center gap-1.5 text-[10px] text-slate-400/70 hover:text-slate-600 transition-colors py-0.5 px-2 rounded-lg"
                    title="بوابة الإدارة (مؤقت)"
                  >
                    <Lock className="w-2.5 h-2.5 opacity-60" />
                    <span>بوابة الإدارة</span>
                  </Link>
                </div>
              </div>
            </aside>
          </>,
          document.body
        )}
    </header>
    {/* Spacer to preserve document layout under fixed header */}
    <div className="h-[109px] w-full shrink-0" aria-hidden="true" />
  </>
  );
}
