'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  Users, 
  TrendingUp, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  PhoneCall, 
  MessageCircle,
  Megaphone,
  KeyRound
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import HeroSearch from '@/components/HeroSearch';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import AddRequestModal from '@/components/AddRequestModal';
import { getStoredProperties, trackWebsiteVisit } from '@/lib/store';
import { AGENCY_CONFIG, AGENCY_SERVICES } from '@/lib/data';
import { Property } from '@/types';

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  useEffect(() => {
    trackWebsiteVisit();
    const list = getStoredProperties();
    setProperties(list);

    const handleUpdate = () => {
      setProperties(getStoredProperties());
    };
    window.addEventListener('aqar_properties_updated', handleUpdate);
    return () => window.removeEventListener('aqar_properties_updated', handleUpdate);
  }, []);

  // Display latest 6 properties
  const latestProperties = properties.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Navbar with modal trigger */}
      <Navbar onOpenRequestModal={() => setIsRequestModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center justify-center overflow-hidden py-16 lg:py-20">
        {/* Background image & gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
            alt="Real estate luxury background"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-sky-950/80 to-slate-950/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>المنصة الأولى للوساطة العقارية المعتمدة في دمشق وسوريا</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-5 max-w-4xl mx-auto">
            بوابتك نحو <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">العقارات الفاخرة</span> والاستثمار الموثوق
          </h1>

          {/* Subtitle */}
          <p className="text-slate-200 text-base sm:text-xl font-normal max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            نساعدك في إيجاد فيلا أحلامك، شقتك المثالية، أو أرضك الاستثمارية في أرقى المحافظات السورية بضمانات رسمية وعقود موثقة طابو أخضر.
          </p>

          {/* Search Filter Box */}
          <HeroSearch />
        </div>
      </section>

      {/* Trust & Stats Bar */}
      <section className="bg-white border-y border-slate-200/80 py-8 relative z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-sky-950">1,500+</div>
              <div className="text-xs sm:text-sm text-slate-500 font-semibold">عقار مباع ومؤجر</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-amber-600">450+ مليون</div>
              <div className="text-xs sm:text-sm text-slate-500 font-semibold">حجم الصفقات المنجزة</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-sky-950">98%</div>
              <div className="text-xs sm:text-sm text-slate-500 font-semibold">نسبة رضا العملاء</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">100%</div>
              <div className="text-xs sm:text-sm text-slate-500 font-semibold">عقود موثقة نظامياً</div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Properties Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-600 text-xs sm:text-sm font-bold uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              <span>عروضنا المميزة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              أحدث العقارات المضافة
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              تصفح نخبة من أفضل الفلل والشقق والأراضي المتاحة حالياً بأفضل الأسعار
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm font-bold text-sky-900 hover:text-amber-600 transition-colors self-start sm:self-auto"
          >
            <span>عرض جميع العقارات</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {latestProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Banner CTA: Add Request if property not found */}
        <div className="mt-14 bg-gradient-to-r from-sky-950 via-sky-900 to-slate-950 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-right">
            <h3 className="text-xl sm:text-2xl font-bold">
              لم تجد العقار الذي تبحث عنه؟
            </h3>
            <p className="text-sm text-sky-200 max-w-xl">
              سجل طلبك العقاري بمواصفاتك الدقيقة وميزانيتك، وسيقوم فريق الوساطة بتوفيره لك مباشرة من الملاك.
            </p>
          </div>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all text-sm cursor-pointer"
          >
            أضف طلبك العقاري الآن
          </button>
        </div>
      </section>

      {/* Services Summary Section */}
      <section className="bg-slate-100/70 py-16 sm:py-20 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 text-amber-600 text-xs sm:text-sm font-bold uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              <span>حلول عقارية متكاملة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
              خدماتنا لخدمة الملاك والمستثمرين
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              نقدم باقة متكاملة من الخدمات المعتمدة تغطي كافة احتياجاتك العقارية باحترافية وسرعة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {AGENCY_SERVICES.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-900 flex items-center justify-center mb-4 group-hover:bg-sky-900 group-hover:text-amber-400 transition-colors">
                    {service.slug === 'marketing' && <Megaphone className="w-6 h-6" />}
                    {service.slug === 'property-management' && <Building2 className="w-6 h-6" />}
                    {service.slug === 'consultations' && <TrendingUp className="w-6 h-6" />}
                    {service.slug === 'valuation' && <Award className="w-6 h-6" />}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {service.shortDesc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/services#${service.slug}`}
                    className="text-xs font-bold text-sky-900 hover:text-amber-600 transition-colors flex items-center gap-1"
                  >
                    <span>تفاصيل الخدمة</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href={`https://wa.me/${AGENCY_CONFIG.whatsappNumber}?text=${encodeURIComponent(`مرحباً، أود الاستفسار وطلب خدمة: ${service.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>طلب الخدمة</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brief About Us Section (من نحن) - directly above footer */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image & License Badge */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-4/3">
                <img
                  src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80"
                  alt="مقر ومشاريع رؤية العقارية"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative sm:absolute sm:bottom-6 sm:right-6 mt-4 sm:mt-0 bg-slate-950 text-white p-5 rounded-2xl shadow-xl max-w-xs border border-slate-800 mx-auto sm:mx-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-500 text-slate-950 rounded-lg">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">وساطة وتسويق معتمد</div>
                    <div className="text-xs text-amber-400">س.ت: {AGENCY_CONFIG.crNumber}</div>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  كافة المعاملات والعقود تتم وفق أعلى معايير الأمان المالي والموثوقية.
                </p>
              </div>
            </div>

            {/* About text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-amber-600 text-xs sm:text-sm font-bold uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>من نحن</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                شركة {AGENCY_CONFIG.name}.. الريادة والموثوقية في السوق العقاري السوري
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                تأسست شركة {AGENCY_CONFIG.name} كمنظومة وساطة واستشارات عقارية رائدة تقدم خدماتها للأفراد والمغتربين والشركات في سوريا. نرتكز على قيم الشفافية، الدقة، وتوظيف التقنيات الحديثة لنربط المشترين بأفضل الفرص الاستثمارية والوحدات السكنية ذات الطابو النظامي.
              </p>

              {/* Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-emerald-100 text-emerald-600 mt-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">خبرة عميقة بالسوق</h4>
                    <p className="text-xs text-slate-500">فريق متمرس يرصد حركة السوق والمناطق</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-emerald-100 text-emerald-600 mt-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">طابو نظامي وعقود موثقة</h4>
                    <p className="text-xs text-slate-500">تدقيق كامل لدى المصالح العقارية</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-emerald-100 text-emerald-600 mt-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">حماية حقوق الأطراف</h4>
                    <p className="text-xs text-slate-500">إجراءات نظامية تضمن أمان صفقتك</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-emerald-100 text-emerald-600 mt-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">سرعة الإنجاز والإفراغ</h4>
                    <p className="text-xs text-slate-500">متابعة دقيقة حتى تسليم المفتاح</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  href="/about"
                  className="bg-sky-900 hover:bg-sky-950 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md"
                >
                  تعرف علينا أكثر
                </Link>
                <Link
                  href="/contact"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3 rounded-xl text-sm transition-all"
                >
                  تواصل مع مستشارنا
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <WhatsAppFloatingButton />

      {/* Add Request Modal */}
      <AddRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />

      {/* Developer Credit Banner */}
      <div className="bg-slate-900 border-t border-slate-800 py-3.5 px-4 text-center">
        <p className="text-xs sm:text-sm font-bold text-slate-200">
          تم تطوير هذا الموقع بواسطة <span className="text-amber-400 font-black">محمد نور بزاعي</span>.
        </p>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
