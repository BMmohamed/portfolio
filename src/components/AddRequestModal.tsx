'use client';

import { useState } from 'react';
import { X, CheckCircle, Send, PlusCircle, Building2, Phone, User, MapPin } from 'lucide-react';
import { addVisitorRequest } from '@/lib/store';
import { PropertyType } from '@/types';

interface AddRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddRequestModal({ isOpen, onClose, onSuccess }: AddRequestModalProps) {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [purpose, setPurpose] = useState<'buy' | 'rent'>('buy');
  const [type, setType] = useState<PropertyType>('villa');
  const [city, setCity] = useState('الرياض');
  const [district, setDistrict] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [bedrooms, setBedrooms] = useState('4');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!clientName.trim() || !clientPhone.trim() || !district.trim()) {
      setError('يرجى ملء جميع الحقول المطلوبة (الاسم، رقم الجوال، والحي المطلوب).');
      return;
    }

    setLoading(true);

    try {
      addVisitorRequest({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        purpose,
        type,
        city,
        district: district.trim(),
        budgetMin: Number(budgetMin) || 0,
        budgetMax: Number(budgetMax) || 0,
        bedrooms: Number(bedrooms) || undefined,
        notes: notes.trim(),
      });

      setLoading(false);
      setSubmitted(true);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setSubmitted(false);
        onClose();
        // Reset form
        setClientName('');
        setClientPhone('');
        setDistrict('');
        setBudgetMin('');
        setBudgetMax('');
        setNotes('');
      }, 2500);
    } catch {
      setLoading(false);
      setError('حدث خطأ أثناء إرسال طلبك، يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-sky-900 to-sky-950 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">أضف طلبك العقاري</h3>
              <p className="text-xs text-sky-200">
                سجل مواصفات عقارك المطلوب وسيتواصل معك مستشارونا فور توفره
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                تم استلام طلبك العقاري بنجاح!
              </h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                تم إرسال طلبك إلى لوحة إدارة رؤية العقارية، وسيقوم فريق العمل بمراجعته وتزويدك بالعروض المناسبة في أقرب وقت.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200">
                  {error}
                </div>
              )}

              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-amber-500" />
                    <span>الاسم الكريم *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: محمد بن سعد"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>رقم الجوال (واتساب) *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    placeholder="+966 5x xxx xxxx"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden text-right"
                  />
                </div>
              </div>

              {/* Purpose & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    الغرض من الطلب *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPurpose('buy')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        purpose === 'buy'
                          ? 'bg-sky-900 text-white border-sky-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      شراء عقار
                    </button>
                    <button
                      type="button"
                      onClick={() => setPurpose('rent')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        purpose === 'rent'
                          ? 'bg-sky-900 text-white border-sky-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      استئجار
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-sky-800" />
                    <span>نوع العقار *</span>
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as PropertyType)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  >
                    <option value="villa">فيلا / قصر</option>
                    <option value="apartment">شقة سكنية</option>
                    <option value="land">أرض سكنية أو تجارية</option>
                    <option value="commercial">مكتب أو معرض تجاري</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    المدينة *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  >
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="الخبر">الخبر</option>
                    <option value="الدمام">الدمام</option>
                    <option value="مكة المكرمة">مكة المكرمة</option>
                    <option value="المدينة المنورة">المدينة المنورة</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>الأحياء المفضلة *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: الملقا، حطين، النرجس"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Budget Range & Bedrooms */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    الميزانية من (ر.س)
                  </label>
                  <input
                    type="number"
                    placeholder="مثال: 1000000"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    الميزانية حتى (ر.س)
                  </label>
                  <input
                    type="number"
                    placeholder="مثال: 3500000"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    عدد الغرف المطلوبة
                  </label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  >
                    <option value="1">1 غرفة</option>
                    <option value="2">2 غرف</option>
                    <option value="3">3 غرف</option>
                    <option value="4">4 غرف</option>
                    <option value="5">5+ غرف</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  تفاصيل ومواصفات إضافية
                </label>
                <textarea
                  rows={3}
                  placeholder="مثال: يفضل واجهة شمالية، شارع 20م، توفر مسبح ومصعد، الدفع نقدي..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                ></textarea>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'جاري الإرسال...' : 'إرسال الطلب للمراجعة'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
