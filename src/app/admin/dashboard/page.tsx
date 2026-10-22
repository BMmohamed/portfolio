'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Home, 
  Inbox, 
  MessageCircle, 
  TrendingUp, 
  Eye, 
  PlusCircle, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Building2 
} from 'lucide-react';
import { 
  getAnalyticsSummary, 
  getStoredProperties, 
  getStoredRequests, 
  getClientRequestWhatsAppUrl 
} from '@/lib/store';
import { Property, PropertyRequest, AnalyticsSummary } from '@/types';

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalVisits: 0,
    totalProperties: 0,
    totalRequests: 0,
    totalWhatsAppClicks: 0,
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [requests, setRequests] = useState<PropertyRequest[]>([]);

  const loadData = () => {
    setSummary(getAnalyticsSummary());
    setProperties(getStoredProperties());
    setRequests(getStoredRequests());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('aqar_properties_updated', loadData);
    window.addEventListener('aqar_requests_updated', loadData);
    return () => {
      window.removeEventListener('aqar_properties_updated', loadData);
      window.removeEventListener('aqar_requests_updated', loadData);
    };
  }, []);

  // Sorted by engagement (WhatsApp clicks + views)
  const topProperties = [...properties]
    .sort((a, b) => (b.whatsappClicks * 2 + b.viewsCount) - (a.whatsappClicks * 2 + a.viewsCount))
    .slice(0, 5);

  const topRequests = [...requests]
    .sort((a, b) => b.whatsappClicks - a.whatsappClicks)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-sky-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md">
        <div>
          <span className="text-xs text-amber-400 font-bold block mb-1">
            نظام التحليلات العقارية الذكي
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            لوحة قيادة المؤشرات والتفاعل
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            متابعة فورية ومباشرة لزيارات الموقع، العروض العقارية النشطة، وتفاعل العملاء عبر محادثات الواتساب.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/properties?add=1"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة عقار جديد</span>
          </Link>
          <Link
            href="/admin/requests"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all"
          >
            <Inbox className="w-4 h-4" />
            <span>مراجعة الطلبات</span>
          </Link>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Visits */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">
              إجمالي زيارات الموقع
            </span>
            <div className="text-3xl font-black text-slate-900">
              {summary.totalVisits.toLocaleString('ar-SA')}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>معدل نمو متصاعد</span>
            </span>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-sky-50 text-sky-900 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Active Properties */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">
              العقارات المتاحة النشطة
            </span>
            <div className="text-3xl font-black text-slate-900">
              {summary.totalProperties}
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              من إجمالي {properties.length} عقار مسجل
            </span>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Home className="w-6 h-6" />
          </div>
        </div>

        {/* Active Requests */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">
              الطلبات المعتمدة
            </span>
            <div className="text-3xl font-black text-slate-900">
              {summary.totalRequests}
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              من إجمالي {requests.length} طلب مستلم
            </span>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        {/* Total WhatsApp Clicks */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">
              نقرات التواصل (واتساب)
            </span>
            <div className="text-3xl font-black text-emerald-600">
              {summary.totalWhatsAppClicks}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
              فرص ومحادثات شراء حقيقية
            </span>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Engagement Table: Properties Performance */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              جدول أداء العروض العقارية وتفاعل العملاء
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              تتبع عدد المشاهدات ونقرات الواتساب ومعدل التحويل لتحديد العقارات الأكثر جذباً
            </p>
          </div>
          <Link
            href="/admin/properties"
            className="text-xs font-bold text-sky-900 hover:text-amber-600 flex items-center gap-1 transition-colors"
          >
            <span>إدارة جميع العقارات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">العقار</th>
                <th className="py-3.5 px-6">الكود</th>
                <th className="py-3.5 px-6">السعر</th>
                <th className="py-3.5 px-6">الحالة</th>
                <th className="py-3.5 px-6 text-center">المشاهدات</th>
                <th className="py-3.5 px-6 text-center">نقرات الواتساب</th>
                <th className="py-3.5 px-6 text-center">معدل الاهتمام</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topProperties.map((prop) => {
                const convRate = prop.viewsCount > 0 ? ((prop.whatsappClicks / prop.viewsCount) * 100).toFixed(1) : '0';
                return (
                  <tr key={prop.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&q=80'}
                          alt={prop.title}
                          className="w-12 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div>
                          <Link
                            href={`/properties/${prop.id}`}
                            target="_blank"
                            className="font-bold text-slate-900 hover:text-sky-900 line-clamp-1 text-xs sm:text-sm"
                          >
                            {prop.title}
                          </Link>
                          <span className="text-[11px] text-slate-400">
                            {prop.location.city} - {prop.location.district}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-600">
                      {prop.code}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 text-xs sm:text-sm">
                      {prop.price.toLocaleString('en-US')} <span className="text-xs text-amber-600">$</span>
                    </td>
                    <td className="py-4 px-6">
                      {prop.status === 'available' && (
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md">
                          متاح
                        </span>
                      )}
                      {prop.status === 'reserved' && (
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md">
                          محجوز
                        </span>
                      )}
                      {prop.status === 'sold' && (
                        <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-md">
                          تم البيع
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center font-semibold text-slate-700">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prop.viewsCount || 0}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-emerald-600">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{prop.whatsappClicks || 0}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-xs font-black text-sky-900 bg-sky-50 px-2.5 py-1 rounded-lg">
                        {convRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engagement Table: Requests Performance */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              تفاعل طلبات العملاء (محادثات الملاك والوسطاء)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              أكثر الطلبات التي تفاعل معها الملاك وقاموا بالتواصل عبر الواتساب
            </p>
          </div>
          <Link
            href="/admin/requests"
            className="text-xs font-bold text-sky-900 hover:text-amber-600 flex items-center gap-1 transition-colors"
          >
            <span>إدارة جميع الطلبات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">العميل صاحب الطلب</th>
                <th className="py-3.5 px-6">الغرض والنوع</th>
                <th className="py-3.5 px-6">المدينة والأحياء</th>
                <th className="py-3.5 px-6">الميزانية</th>
                <th className="py-3.5 px-6">حالة الطلب</th>
                <th className="py-3.5 px-6 text-center">نقرات الواتساب</th>
                <th className="py-3.5 px-6 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {req.clientName}
                  </td>
                  <td className="py-4 px-6 text-xs font-semibold">
                    <span className="text-sky-950">
                      {req.purpose === 'buy' ? 'شراء' : 'إيجار'}{' '}
                      {req.type === 'villa' ? 'فيلا' : req.type === 'apartment' ? 'شقة' : req.type === 'land' ? 'أرض' : 'تجاري'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-600">
                    {req.city} - {req.district}
                  </td>
                  <td className="py-4 px-6 text-xs font-bold text-slate-900">
                    {req.budgetMax ? `${req.budgetMax.toLocaleString('en-US')} $` : 'مفتوحة'}
                  </td>
                  <td className="py-4 px-6">
                    {req.status === 'approved' && (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded">
                        معتمد
                      </span>
                    )}
                    {req.status === 'pending' && (
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded">
                        قيد المراجعة
                      </span>
                    )}
                    {req.status === 'rejected' && (
                      <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 rounded">
                        مرفوض
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-emerald-600">
                    <span className="inline-flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{req.whatsappClicks || 0}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <a
                      href={getClientRequestWhatsAppUrl(req)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>واتساب</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
