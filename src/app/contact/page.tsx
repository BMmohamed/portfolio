'use client';

import { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  ShieldCheck,
  Building2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import AddRequestModal from '@/components/AddRequestModal';
import { AGENCY_CONFIG } from '@/lib/data';

export default function ContactPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;

    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setPhone('');
      setSubject('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar onOpenRequestModal={() => setIsModalOpen(true)} />

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-sky-950 via-slate-900 to-sky-950 text-white py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>فريق خدمة العملاء متواجد لمساعدتك طوال أيام الأسبوع</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
            تواصل مع فريق {AGENCY_CONFIG.name}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            يسعدنا استقبال استفساراتكم واقتراحاتكم وزيارتكم في مقرنا بالرياض أو مراسلتنا مباشرة.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-r-4 border-amber-500 pr-3">
                بيانات الاتصال المباشرة
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-3.5 bg-slate-50 rounded-2xl">
                  <div className="p-2.5 bg-sky-900 text-white rounded-xl">
                    <MapPin className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-500 mb-0.5">العنوان والمقر الرئيسي</h4>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                      {AGENCY_CONFIG.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 bg-slate-50 rounded-2xl">
                  <div className="p-2.5 bg-sky-900 text-white rounded-xl">
                    <Phone className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-500 mb-0.5">الهاتف الموحد والجوال</h4>
                    <div className="space-y-0.5">
                      <a href={`tel:${AGENCY_CONFIG.phone}`} dir="ltr" className="block text-xs sm:text-sm font-semibold text-slate-800 hover:text-sky-900">
                        {AGENCY_CONFIG.phone}
                      </a>
                      <a href={`tel:${AGENCY_CONFIG.mobile}`} dir="ltr" className="block text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700">
                        {AGENCY_CONFIG.mobile}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 bg-slate-50 rounded-2xl">
                  <div className="p-2.5 bg-sky-900 text-white rounded-xl">
                    <Mail className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-500 mb-0.5">البريد الإلكتروني الرسمي</h4>
                    <a href={`mailto:${AGENCY_CONFIG.email}`} className="text-xs sm:text-sm font-semibold text-slate-800 hover:text-sky-900">
                      {AGENCY_CONFIG.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 bg-slate-50 rounded-2xl">
                  <div className="p-2.5 bg-sky-900 text-white rounded-xl">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-500 mb-0.5">أوقات وساعات العمل</h4>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800">
                      {AGENCY_CONFIG.workingHours}
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick CTA */}
              <a
                href={`https://wa.me/${AGENCY_CONFIG.whatsappNumber}?text=${encodeURIComponent('مرحباً، أود التواصل مع خدمة العملاء.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm text-center"
              >
                <MessageCircle className="w-5 h-5" />
                <span>محادثة فورية عبر واتساب</span>
              </a>
            </div>

            {/* Map Placeholder Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>موقعنا على الخريطة</span>
              </h3>
              <div className="aspect-16/9 bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-center p-4 border border-slate-200 relative overflow-hidden">
                <MapPin className="w-8 h-8 text-rose-500 mb-2 animate-bounce" />
                <span className="font-bold text-xs text-slate-800">{AGENCY_CONFIG.name}</span>
                <span className="text-[11px] text-slate-500">طريق الملك فهد، حي الملقا، الرياض</span>
              </div>
            </div>
          </div>

          {/* Contact Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                أرسل لنا رسالة أو استفسار
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                املأ النموذج التالي وسيقوم أحد ممثلي خدمة العملاء بالرد عليك خلال ساعات العمل الرسمية.
              </p>

              {submitted ? (
                <div className="p-8 bg-emerald-50 rounded-2xl text-center space-y-3 border border-emerald-200">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-bold text-emerald-900">
                    تم إرسال رسالتك بنجاح!
                  </h3>
                  <p className="text-xs text-emerald-700">
                    شكراً لتواصلك معنا، سيقوم مستشارنا بالرد عليك في أقرب وقت.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">
                        الاسم الكامل *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="أحمد العبدالله"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">
                        رقم الجوال *
                      </label>
                      <input
                        type="tel"
                        required
                        dir="ltr"
                        placeholder="+966 5x xxx xxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden text-right"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">
                      موضوع الاستفسار
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                    >
                      <option value="">اختر موضوع الاستفسار...</option>
                      <option value="شراء عقار">استفسار عن شراء عقار معروض</option>
                      <option value="استئجار">استفسار عن استئجار وحدة سكنية / تجارية</option>
                      <option value="تسويق عقار">عرض عقار للبيع أو الإيجار (تسويق حصري)</option>
                      <option value="إدارة أملاك">طلب خدمة إدارة أملاك ومرافق</option>
                      <option value="تقييم عقاري">طلب تقييم عقاري معتمد</option>
                      <option value="أخرى">استفسار عام آخر</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">
                      نص الرسالة أو تفاصيل الاستفسار *
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="اكتب استفسارك بالتفصيل وسنوافيك بكافة الإجابات..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-sky-900 hover:bg-sky-950 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>إرسال الرسالة الآن</span>
                  </button>
                </form>
              )}
            </div>
          </div>
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
