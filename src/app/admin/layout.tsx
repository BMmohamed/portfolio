'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Building2, 
  LayoutDashboard, 
  Home, 
  Inbox, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X,
  User,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { isAdminAuthenticated, setAdminAuthenticated, getStoredRequests } from '@/lib/store';
import { AGENCY_CONFIG } from '@/lib/data';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [currentDate, setCurrentDate] = useState('');

  // If on /admin/login, don't show the dashboard shell
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    if (!isLoginPage) {
      if (!isAdminAuthenticated()) {
        router.push('/admin/login');
      }
    }

    const checkPending = () => {
      const requests = getStoredRequests();
      const count = requests.filter((r) => r.status === 'pending').length;
      setPendingRequestsCount(count);
    };

    checkPending();
    window.addEventListener('aqar_requests_updated', checkPending);
    return () => window.removeEventListener('aqar_requests_updated', checkPending);
  }, [pathname, isLoginPage, router]);

  // Lock body scroll on mobile when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [sidebarOpen]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    setAdminAuthenticated(false);
    router.push('/admin/login');
  };

  const navItems = [
    {
      name: 'لوحة المؤشرات والتحليلات',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'إدارة العروض العقارية',
      href: '/admin/properties',
      icon: Home,
    },
    {
      name: 'إدارة طلبات العملاء',
      href: '/admin/requests',
      icon: Inbox,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-sm">إدارة {AGENCY_CONFIG.name}</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
          aria-label="القائمة"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay (Click outside to close) */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setSidebarOpen(false);
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setSidebarOpen(false);
        }}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px] transition-opacity duration-300 md:hidden cursor-pointer ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ touchAction: 'none' }}
      />

      {/* Sidebar (Takes ~70% on mobile, standard w-64 on desktop) */}
      <aside
        onClick={(e) => e.stopPropagation()}
        className={`fixed md:sticky top-0 right-0 z-50 h-screen w-[70vw] max-w-[310px] md:w-64 bg-slate-950 text-slate-300 flex flex-col justify-between border-l border-slate-800 transition-transform duration-300 ease-out shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
        style={{ touchAction: 'pan-y' }}
      >
        <div>
          {/* Logo / Header with mobile close X */}
          <div className="p-4 sm:p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wide">
                  {AGENCY_CONFIG.name}
                </h2>
                <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>لوحة التحكم الإدارية</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white md:hidden hover:bg-slate-900 transition-colors"
              aria-label="إغلاق القائمة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-sky-400" />
            <span>معاينة الموقع العام</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors cursor-pointer text-right"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">
              مرحباً، المشرف العام
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-500">
              {currentDate || 'اليوم'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {pendingRequestsCount > 0 && (
              <Link
                href="/admin/requests"
                className="flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors"
              >
                <Bell className="w-3.5 h-3.5 text-amber-600" />
                <span>{pendingRequestsCount} طلب بانتظار المراجعة</span>
              </Link>
            )}

            <div className="w-8 h-8 rounded-full bg-sky-900 text-white flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
