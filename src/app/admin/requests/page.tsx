'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Inbox, 
  Check, 
  Trash2, 
  MessageCircle, 
  PlusCircle, 
  X, 
  Clock, 
  Coins, 
  MapPin, 
  User, 
  Phone, 
  AlertCircle,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { 
  getAllRequests, 
  updateRequestStatus, 
  deleteRequest, 
  addAdminRequest, 
  getClientRequestWhatsAppUrl 
} from '@/lib/store';
import { PropertyRequest, PropertyType, RequestStatus } from '@/types';

export default function ManageRequestsPage() {
  const [requests, setRequests] = useState<PropertyRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Manual Request Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [purpose, setPurpose] = useState<'buy' | 'rent'>('buy');
  const [type, setType] = useState<PropertyType>('villa');
  const [city, setCity] = useState('دمشق');
  const [district, setDistrict] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [bedrooms, setBedrooms] = useState('4');
  const [notes, setNotes] = useState('');

  const loadRequests = () => {
    setRequests(getAllRequests());
  };

  useEffect(() => {
    loadRequests();
    window.addEventListener('aqar_requests_updated', loadRequests);
    return () => window.removeEventListener('aqar_requests_updated', loadRequests);
  }, []);

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  const filteredRequests = useMemo(() => {
    if (statusFilter === 'all') return requests;
    return requests.filter((r) => r.status === statusFilter);
  }, [requests, statusFilter]);

  const handleApprove = (id: string) => {
    updateRequestStatus(id, 'approved');
    loadRequests();
  };

  const handleReject = (id: string) => {
    updateRequestStatus(id, 'rejected');
    loadRequests();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف طلب "${name}"؟`)) {
      deleteRequest(id);
      loadRequests();
    }
  };

  const handleCreateManualRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !district) return;

    addAdminRequest({
      clientName,
      clientPhone,
      purpose,
      type,
      city,
      district,
      budgetMin: Number(budgetMin) || 0,
      budgetMax: Number(budgetMax) || 0,
      bedrooms: Number(bedrooms) || undefined,
      notes,
      status: 'approved', // Admin manually added requests are approved by default
    });

    setIsModalOpen(false);
    // Reset
    setClientName('');
    setClientPhone('');
    setDistrict('');
    setBudgetMin('');
    setBudgetMax('');
    setNotes('');
    loadRequests();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            إدارة ومراجعة طلبات العملاء
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            مراجعة طلبات الزوار الواردة، نشرها في الموقع العام، أو التواصل الفوري مع صاحب الطلب عبر واتساب
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-sky-900 hover:bg-sky-950 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>إضافة طلب يدوي جديد</span>
        </button>
      </div>

      {/* Tabs Filter */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-sky-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          جميع الطلبات ({requests.length})
        </button>

        <button
          onClick={() => setStatusFilter('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>قيد المراجعة</span>
          {pendingCount > 0 && (
            <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[10px]">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setStatusFilter('approved')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            statusFilter === 'approved'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          الطلبات المعتمدة المنشورة ({requests.filter((r) => r.status === 'approved').length})
        </button>

        <button
          onClick={() => setStatusFilter('rejected')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            statusFilter === 'rejected'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          المرفوضة ({requests.filter((r) => r.status === 'rejected').length})
        </button>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className={`bg-white rounded-3xl p-6 border shadow-xs transition-all space-y-4 ${
                req.status === 'pending'
                  ? 'border-amber-300 ring-2 ring-amber-100'
                  : 'border-slate-200/80'
              }`}
            >
              {/* Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                    <User className="w-5 h-5 text-sky-900" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {req.clientName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span dir="ltr">{req.clientPhone}</span>
                      <span>•</span>
                      <span>{new Date(req.createdAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
                    req.purpose === 'buy' ? 'bg-sky-950 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {req.purpose === 'buy' ? 'شراء' : 'إيجار'}{' '}
                    {req.type === 'villa' ? 'فيلا' : req.type === 'apartment' ? 'شقة' : req.type === 'land' ? 'أرض' : 'تجاري'}
                  </span>

                  {req.status === 'pending' && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>قيد المراجعة</span>
                    </span>
                  )}
                  {req.status === 'approved' && (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>معتمد ومنشور</span>
                    </span>
                  )}
                  {req.status === 'rejected' && (
                    <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                      مرفوض
                    </span>
                  )}
                </div>
              </div>

              {/* Specs & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    المنطقة:{' '}
                    <span className="font-bold text-slate-900">
                      {req.city} - {req.district}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    الميزانية:{' '}
                    <span className="font-bold text-slate-900">
                      {req.budgetMin ? req.budgetMin.toLocaleString('ar-SY') : '0'} - {req.budgetMax ? req.budgetMax.toLocaleString('ar-SY') : 'مفتوحة'}
                    </span>{' '}
                    ل.س
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-sky-800 shrink-0" />
                  <span>
                    نقرات الواتساب العامة: <span className="font-bold text-slate-900">{req.whatsappClicks || 0}</span>
                  </span>
                </div>
              </div>

              {/* Notes */}
              {req.notes && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                  {req.notes}
                </p>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <a
                    href={getClientRequestWhatsAppUrl(req)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>مراسلة العميل واتساب</span>
                  </a>

                  <a
                    href={`tel:${req.clientPhone}`}
                    className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>اتصال</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  {req.status !== 'approved' && (
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="inline-flex items-center gap-1 bg-sky-900 hover:bg-sky-950 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-amber-400" />
                      <span>موافقة ونشر في الموقع</span>
                    </button>
                  )}

                  {req.status !== 'rejected' && (
                    <button
                      onClick={() => handleReject(req.id)}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      <span>رفض</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(req.id, req.clientName)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                    title="حذف الطلب"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm font-semibold">
              لا توجد طلبات في هذا القسم حالياً.
            </p>
          </div>
        )}
      </div>

      {/* Manual Add Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-sky-900 text-white">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">إضافة طلب عقاري يدوي جديد</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualRequest} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    اسم العميل *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
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
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    الغرض
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  >
                    <option value="buy">شراء</option>
                    <option value="rent">إيجار</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    نوع العقار
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  >
                    <option value="villa">فيلا</option>
                    <option value="apartment">شقة</option>
                    <option value="land">أرض</option>
                    <option value="commercial">تجاري</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    المدينة
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  >
                    <option value="دمشق">دمشق</option>
                    <option value="ريف دمشق">ريف دمشق</option>
                    <option value="حلب">حلب</option>
                    <option value="اللاذقية">اللاذقية</option>
                    <option value="طرطوس">طرطوس</option>
                    <option value="حمص">حمص</option>
                    <option value="حماة">حماة</option>
                    <option value="السويداء">السويداء</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    الحي المطلوب *
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    الميزانية الأدنى (ل.س)
                  </label>
                  <input
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    الميزانية الأقصى (ل.س)
                  </label>
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  ملاحظات ومواصفات إضافية
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sky-900 hover:bg-sky-950 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  إضافة ونشر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
