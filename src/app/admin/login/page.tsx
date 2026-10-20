'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, Lock, Mail, ShieldAlert, ArrowLeft, KeyRound } from 'lucide-react';
import { setAdminAuthenticated } from '@/lib/store';
import { AGENCY_CONFIG } from '@/lib/data';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@aqar.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Support admin credentials or fallback
    if (
      (email === 'admin@aqar.com' && password === 'admin123') ||
      (email.includes('@') && password.length >= 6)
    ) {
      setAdminAuthenticated(true);
      router.push('/admin/dashboard');
    } else {
      setLoading(false);
      setError('بيانات الدخول غير صحيحة. يرجى التأكد من البريد وكلمة المرور.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-950 via-sky-950 to-slate-900 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Brand header */}
        <div className="bg-sky-900 p-8 text-center text-white relative">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Building2 className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-black">{AGENCY_CONFIG.name}</h1>
          <p className="text-xs text-sky-200 mt-1">بوابة إدارة النظام والتحكم العقاري</p>

          <Link
            href="/"
            className="absolute top-4 left-4 text-xs text-sky-200 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>الموقع العام</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Form Container */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>البريد الإلكتروني للإدارة</span>
              </label>
              <input
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aqar.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden text-right"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>كلمة المرور</span>
              </label>
              <input
                type="password"
                required
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden text-right"
              />
            </div>

            {/* Quick Demo Hint */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900">
              <span className="font-bold block mb-0.5">بيانات الدخول التجريبية (Demo):</span>
              البريد: <span className="font-mono font-semibold" dir="ltr">admin@aqar.com</span> | كلمة المرور: <span className="font-mono font-semibold" dir="ltr">admin123</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-900 hover:bg-sky-950 text-white font-bold py-3 rounded-xl shadow-lg shadow-sky-950/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>{loading ? 'جاري التحقق...' : 'تسجيل الدخول'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
