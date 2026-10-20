'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Megaphone, 
  Building2, 
  TrendingUp, 
  Award, 
  MessageCircle, 
  CheckCircle2, 
  ArrowLeft, 
  PhoneCall,
  ShieldCheck 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import AddRequestModal from '@/components/AddRequestModal';
import { AGENCY_CONFIG, AGENCY_SERVICES } from '@/lib/data';

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getServiceIcon = (slug: string) => {
    switch (slug) {
      case 'marketing':
        return <Megaphone className="w-8 h-8 text-amber-500" />;
      case 'property-management':
        return <Building2 className="w-8 h-8 text-sky-800" />;
      case 'consultations':
        return <TrendingUp className="w-8 h-8 text-emerald-600" />;
      case 'valuation':
        return <Award className="w-8 h-8 text-amber-600" />;
      default:
        return <Building2 className="w-8 h-8 text-sky-800" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar onOpenRequestModal={() => setIsModalOpen(true)} />

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-sky-950 via-slate-900 to-sky-950 text-white py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>خدمات معتمدة ومطابقة للمعايير الوطنية للوساطة العقارية</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
            خدماتنا العقارية المتكاملة
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            حلول متخصصة للملاك، المستثمرين، والمطورين العقاريين لتعظيم العائد الاستثماري وحماية الأصول.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <div className="space-y-12">
          {AGENCY_SERVICES.map((service, index) => (
            <div
              key={service.id}
              id={service.slug}
              className={`bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Left Column (Icon & Description) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200">
                  {getServiceIcon(service.slug)}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {service.title}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {service.fullDesc}
                </p>

                {/* Benefits */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    ماذا يشمل هذا العرض والخدمة؟
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {service.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Direct Request Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-sky-950 p-6 sm:p-8 rounded-3xl text-white space-y-5">
                <div>
                  <span className="text-xs text-amber-400 font-semibold block mb-1">
                    طلب استشارة أو تكليف مباشر
                  </span>
                  <h3 className="text-xl font-bold">
                    جاهزون للبدء في خدمة {service.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    تواصل فوراً مع المستشار المسؤول عبر الواتساب لإرسال متطلبات عقارك والحصول على دراسة مبدئية مجانية.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <a
                    href={`https://wa.me/${AGENCY_CONFIG.whatsappNumber}?text=${encodeURIComponent(`مرحباً فريق ${AGENCY_CONFIG.name}، أود الاستفسار وطلب خدمة: "${service.title}".`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm text-center"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>طلب الخدمة عبر واتساب</span>
                  </a>

                  <a
                    href={`tel:${AGENCY_CONFIG.mobile}`}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm text-center"
                  >
                    <PhoneCall className="w-4 h-4 text-amber-400" />
                    <span>اتصال بالهاتف الموحد</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <WhatsAppFloatingButton />
      <AddRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <Footer />
    </div>
  );
}
