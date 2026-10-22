'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  Eye, 
  Target, 
  HeartHandshake, 
  Sparkles, 
  ArrowLeft,
  CheckCircle2,
  Users
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import AddRequestModal from '@/components/AddRequestModal';
import { AGENCY_CONFIG } from '@/lib/data';

export default function AboutPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 w-full overflow-x-hidden">
      <Navbar onOpenRequestModal={() => setIsModalOpen(true)} />

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-sky-950 via-slate-900 to-sky-950 text-white py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <Award className="w-4 h-4 text-amber-400" />
            <span>قصة نجاح في صناعة الوساطة والاستثمار العقاري بالمملكة</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
            عن شركة {AGENCY_CONFIG.name}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            نصنع معايير جديدة لتجربة العقار الفاخر والاستثمار الآمن، مع التزام تام بالشفافية والأنظمة الرسمية.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full flex-1 space-y-16">
        {/* Story & Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
              من نحن
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              نبني جسور الثقة بين الملاك والمستثمرين منذ أكثر من 12 عاماً
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              انطلقت شركة {AGENCY_CONFIG.name} في قلب العاصمة الرياض بهدف إعادة صياغة تجربة الوساطة العقارية لتصبح أكثر موثوقية، سرعة، واحترافية. نحن فريق يجمع بين الخبرة الميدانية العميقة بأحياء المدن السعودية والتحليل الرقمي الدقيق لاتجاهات السوق العقاري.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              نلتزم بتقديم وساطة عقارية احترافية وعقود موثقة لنضمن لكل عميل حقوقاً مصانة وصفقات آمنة بأعلى معايير الشفافية والموثوقية المالية.
            </p>
          </div>

          <div className="relative">
            <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="عن رؤية العقارية"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative sm:absolute sm:-bottom-6 sm:-left-6 mt-4 sm:mt-0 bg-amber-500 text-slate-950 p-5 sm:p-6 rounded-2xl shadow-xl max-w-xs font-bold text-xs sm:text-sm mx-auto sm:mx-0">
              رؤيتنا تتناغم مع مستهدفات رؤية المملكة 2030 لتطوير قطاع عقاري مستدام وجاذب.
            </div>
          </div>
        </div>

        {/* Vision, Mission, Values Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-900 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">رؤيتنا</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              أن نكون الخيار الأول والأكثر موثوقية لكل من يبحث عن شراء، بيع، أو استثمار العقارات السكنية والتجارية الفاخرة في المملكة العربية السعودية.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">رسالتنا</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              تقديم خدمات وساطة وتسويق عقاري تفوق التوقعات من خلال استشارات استثمارية صادقة، وعقود موثقة نظامياً، وحلول تسويقية تقنية مبتكرة.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">قيمنا الجوهرية</h3>
            <ul className="text-slate-600 text-xs sm:text-sm space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>الشفافية المطلقة في كل تعامل</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>الأمانة وحفظ حقوق الطرفين</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>السرعة والدقة في إتمام الإفراغ</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>الابتكار ومواكبة التحول الرقمي</span>
              </li>
            </ul>
          </div>
        </div>

        {/* License & Accreditation Banner */}
        <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 text-center md:text-right">
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>وساطة وتسويق موثوق</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              منشأة وساطة واستثمار عقاري احترافية
            </h3>
            <p className="text-slate-300 text-sm max-w-xl">
              السجل التجاري رقم: <span className="text-amber-400 font-mono font-bold text-base">{AGENCY_CONFIG.crNumber}</span>. جميع التعاملات والعقود تتم بأعلى مستويات الاحترافية والأمان لحماية مصالح عملائنا.
            </p>
          </div>

          <Link
            href="/contact"
            className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all text-sm"
          >
            تواصل مع خبرائنا
          </Link>
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
