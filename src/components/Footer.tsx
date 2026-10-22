import Link from 'next/link';
import { Building2, Phone, Mail, MapPin, Clock, ShieldCheck, MessageCircle } from 'lucide-react';
import { AGENCY_CONFIG } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Agency Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-amber-500 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-wide">
                {AGENCY_CONFIG.name}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              منشأة وساطة وتسويق عقاري احترافية. نقدم حلولاً عقارية ذكية تضمن لك أفضل الصفقات وأعلى العوائد الاستثمارية.
            </p>
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>وساطة وتسويق عقاري معتمد</span>
              </div>
              <div className="text-xs text-slate-400">
                السجل التجاري: {AGENCY_CONFIG.crNumber}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-r-4 border-amber-500 pr-3">
              روابط سريعة
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  الصفحة الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-amber-400 transition-colors">
                  جميع العروض العقارية
                </Link>
              </li>
              <li>
                <Link href="/requests" className="hover:text-amber-400 transition-colors">
                  طلبات العملاء العقارية
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-amber-400 transition-colors">
                  خدمات التسويق وإدارة الأملاك
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  عن رؤية العقارية
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Real Estate Categories */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-r-4 border-amber-500 pr-3">
              تصنيفات العقارات
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/properties?purpose=sale&type=villa" className="hover:text-amber-400 transition-colors">
                  فلل وقصور للبيع بالرياض
                </Link>
              </li>
              <li>
                <Link href="/properties?purpose=sale&type=apartment" className="hover:text-amber-400 transition-colors">
                  شقق تمليك فاخرة
                </Link>
              </li>
              <li>
                <Link href="/properties?purpose=rent&type=apartment" className="hover:text-amber-400 transition-colors">
                  شقق عوائل للإيجار السنوي
                </Link>
              </li>
              <li>
                <Link href="/properties?purpose=sale&type=land" className="hover:text-amber-400 transition-colors">
                  أراضٍ سكنية واستثمارية
                </Link>
              </li>
              <li>
                <Link href="/properties?purpose=rent&type=commercial" className="hover:text-amber-400 transition-colors">
                  معارض ومكاتب تجارية
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-r-4 border-amber-500 pr-3">
              معلومات الاتصال
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
                <span className="text-slate-300 leading-tight">{AGENCY_CONFIG.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${AGENCY_CONFIG.mobile}`} dir="ltr" className="hover:text-white transition-colors">
                  {AGENCY_CONFIG.mobile}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`mailto:${AGENCY_CONFIG.email}`} className="hover:text-white transition-colors">
                  {AGENCY_CONFIG.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-400">{AGENCY_CONFIG.workingHours}</span>
              </li>
              <li className="pt-2">
                <a
                  href={`https://wa.me/${AGENCY_CONFIG.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>تواصل عبر الواتساب مباشرة</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & admin link */}
        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="space-y-1 text-center sm:text-right">
            <p>© 2026 {AGENCY_CONFIG.name}. جميع الحقوق محفوظة.</p>
            <p className="text-amber-400 font-bold text-xs tracking-wide">
              تم تطوير هذا الموقع بواسطة محمد نور بزاعي.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-slate-400 transition-colors">سياسة الخصوصية</Link>
            <span>•</span>
            <Link href="/about" className="hover:text-slate-400 transition-colors">شروط الاستخدام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
