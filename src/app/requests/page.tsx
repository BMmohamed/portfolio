'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  PlusCircle, 
  Search, 
  MapPin, 
  Coins, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Filter,
  UserCheck
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import AddRequestModal from '@/components/AddRequestModal';
import { 
  getApprovedRequests, 
  getClientRequestWhatsAppUrl, 
  incrementRequestWhatsApp,
  addVisitorRequest
} from '@/lib/store';
import { PropertyRequest, PropertyType } from '@/types';

function RequestsContent() {
  const searchParams = useSearchParams();
  const [requests, setRequests] = useState<PropertyRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(searchParams.get('new') === '1');
  const [purposeFilter, setPurposeFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  // In-page form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [formPurpose, setFormPurpose] = useState<'buy' | 'rent'>('buy');
  const [formType, setFormType] = useState<PropertyType>('villa');
  const [formCity, setFormCity] = useState('دمشق');
  const [district, setDistrict] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [bedrooms, setBedrooms] = useState('4');
  const [notes, setNotes] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const loadData = () => {
    setRequests(getApprovedRequests());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('aqar_requests_updated', handleUpdate);
    return () => window.removeEventListener('aqar_requests_updated', handleUpdate);
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (purposeFilter !== 'all' && r.purpose !== purposeFilter) return false;
      if (typeFilter !== 'all' && r.type !== typeFilter) return false;
      if (cityFilter !== 'all' && r.city !== cityFilter) return false;
      return true;
    });
  }, [requests, purposeFilter, typeFilter, cityFilter]);

  const handleInPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !district) return;

    addVisitorRequest({
      clientName: name,
      clientPhone: phone,
      purpose: formPurpose,
      type: formType,
      city: formCity,
      district,
      budgetMin: Number(budgetMin) || 0,
      budgetMax: Number(budgetMax) || 0,
      bedrooms: Number(bedrooms) || undefined,
      notes,
    });

    setFormSuccess(true);
    setName('');
    setPhone('');
    setDistrict('');
    setBudgetMin('');
    setBudgetMax('');
    setNotes('');

    setTimeout(() => {
      setFormSuccess(false);
    }, 4000);
  };

  const handleWhatsAppContact = (req: PropertyRequest) => {
    incrementRequestWhatsApp(req.id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar onOpenRequestModal={() => setIsModalOpen(true)} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-sky-950 via-slate-900 to-sky-950 text-white py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>طلبات حقيقية وموثقة من مشترين ومستأجرين جادين</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
            طلبات العملاء العقارية
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            هل تمتلك عقاراً يطابق أحد هذه الطلبات؟ تواصل مباشرة مع العميل أو أضف طلبك الخاص لنبحث لك عن أفضل العقارات المطابقة.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Quick Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>تصفية الطلبات:</span>
            </span>

            {/* Purpose */}
            <select
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
            >
              <option value="all">جميع الأغراض (شراء وإيجار)</option>
              <option value="buy">طلبات شراء</option>
              <option value="rent">طلبات إيجار</option>
            </select>

            {/* Type */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
            >
              <option value="all">جميع الأنواع</option>
              <option value="villa">فلل</option>
              <option value="apartment">شقق</option>
              <option value="land">أراضٍ</option>
              <option value="commercial">تجاري</option>
            </select>

            {/* City */}
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
            >
              <option value="all">جميع المحافظات</option>
              <option value="دمشق">دمشق</option>
              <option value="ريف دمشق">ريف دمشق</option>
              <option value="حلب">حلب</option>
              <option value="اللاذقية">اللاذقية</option>
              <option value="طرطوس">طرطوس</option>
              <option value="حمص">حمص</option>
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>أضف طلبك الآن</span>
          </button>
        </div>

        {/* 2-Column: Left (Approved Requests List) & Right (Submit Form) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Requests List (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                الطلبات المعتمدة النشطة ({filteredRequests.length})
              </h2>
              <span className="text-xs text-slate-500">محدثة بشكل دوري</span>
            </div>

            {filteredRequests.length > 0 ? (
              <div className="space-y-4">
                {filteredRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
                          req.purpose === 'buy'
                            ? 'bg-sky-950 text-white'
                            : 'bg-amber-500 text-white'
                        }`}>
                          {req.purpose === 'buy' ? 'مطلوب شراء' : 'مطلوب إيجار'}
                        </span>
                        <span className="bg-slate-100 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-lg">
                          {req.type === 'villa' ? 'فيلا' : req.type === 'apartment' ? 'شقة' : req.type === 'land' ? 'أرض' : 'تجاري'}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(req.createdAt).toLocaleDateString('ar-SA')}</span>
                        </span>
                      </div>

                      <div className="text-xs font-bold text-slate-600">
                        العميل: <span className="text-slate-900">{req.clientName}</span>
                      </div>
                    </div>

                    {/* Location & Budget Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl">
                      <div className="flex items-center gap-2 text-slate-700">
                        <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="font-semibold">{req.city} - {req.district}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Coins className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          الميزانية:{' '}
                          <span className="font-bold text-slate-900">
                            {req.budgetMin ? req.budgetMin.toLocaleString('en-US') : '0'} - {req.budgetMax ? req.budgetMax.toLocaleString('en-US') : 'مفتوحة'}
                          </span>{' '}
                          $
                        </span>
                      </div>
                    </div>

                    {/* Notes / Specifications */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {req.notes}
                    </p>

                    {/* Owner Action CTA */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        هل لديك عقار يناسب هذا الطلب؟
                      </span>
                      <a
                        href={getClientRequestWhatsAppUrl(req)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleWhatsAppContact(req)}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>تواصل مع صاحب الطلب</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <p className="text-slate-500 text-sm">
                  لا توجد طلبات معتمدة مطابقة للتصفية المختارة.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: "Add Your Request" Form */}
          <div>
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md sticky top-28">
              <div className="flex items-center gap-2 mb-2 text-sky-950 font-bold text-lg">
                <PlusCircle className="w-5 h-5 text-amber-500" />
                <h3>أضف طلبك العقاري</h3>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                سجل مواصفات عقارك وسيقوم فريق الوساطة بمراجعة طلبك وعرضه على ملاك العقارات.
              </p>

              {formSuccess ? (
                <div className="p-6 bg-emerald-50 rounded-2xl text-center space-y-3 border border-emerald-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <div className="font-bold text-sm text-emerald-900">
                    تم إرسال طلبك للمراجعة بنجاح!
                  </div>
                  <p className="text-xs text-emerald-700">
                    سيظهر طلبك في لوحة تحكم المشرف للموافقة عليه والتواصل معك فوراً.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInPageSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">
                      الاسم الكريم *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="محمد بن خالد"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden text-right"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">
                        الغرض
                      </label>
                      <select
                        value={formPurpose}
                        onChange={(e) => setFormPurpose(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                      >
                        <option value="buy">شراء</option>
                        <option value="rent">إيجار</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">
                        النوع
                      </label>
                      <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                      >
                        <option value="villa">فيلا</option>
                        <option value="apartment">شقة</option>
                        <option value="land">أرض</option>
                        <option value="commercial">تجاري</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">
                        المدينة
                      </label>
                      <select
                        value={formCity}
                        onChange={(e) => setFormCity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                      >
                        <option value="دمشق">دمشق</option>
                        <option value="ريف دمشق">ريف دمشق</option>
                        <option value="حلب">حلب</option>
                        <option value="اللاذقية">اللاذقية</option>
                        <option value="طرطوس">طرطوس</option>
                        <option value="حمص">حمص</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">
                        المنطقة المطلوبة *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="أبو رمانة، يعفور..."
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">
                      الميزانية التقريبية ($)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="من"
                        value={budgetMin}
                        onChange={(e) => setBudgetMin(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                      />
                      <input
                        type="number"
                        placeholder="إلى"
                        value={budgetMax}
                        onChange={(e) => setBudgetMax(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">
                      تفاصيل إضافية
                    </label>
                    <textarea
                      rows={3}
                      placeholder="المساحة المفضلة، الواجهة، أية اشتراطات خاصة..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                  >
                    إرسال الطلب للمراجعة
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
        onSuccess={loadData}
      />
      <Footer />
    </div>
  );
}

export default function RequestsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-bold text-sky-900">جاري تحميل الطلبات العقارية...</div>}>
      <RequestsContent />
    </Suspense>
  );
}
