'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Home, Key, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function HeroSearch() {
  const router = useRouter();
  const [purpose, setPurpose] = useState<'sale' | 'rent'>('sale');
  const [type, setType] = useState<string>('all');
  const [city, setCity] = useState<string>('all');
  const [keyword, setKeyword] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (purpose) params.set('purpose', purpose);
    if (type !== 'all') params.set('type', type);
    if (city !== 'all') params.set('city', city);
    if (keyword.trim()) params.set('q', keyword.trim());

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Purpose Tabs */}
      <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md p-1.5 rounded-2xl mb-3 border border-white/30 shadow-lg">
        <button
          type="button"
          onClick={() => setPurpose('sale')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            purpose === 'sale'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-white hover:bg-white/20'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>عقارات للبيع</span>
        </button>
        <button
          type="button"
          onClick={() => setPurpose('rent')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            purpose === 'rent'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-white hover:bg-white/20'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>عقارات للإيجار</span>
        </button>
      </div>

      {/* Main Search Filter Box */}
      <form
        onSubmit={handleSearch}
        className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/60 text-slate-800"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-center">
          {/* City */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>المدينة</span>
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-sky-900 focus:outline-hidden transition-all"
            >
              <option value="all">جميع المحافظات السورية</option>
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

          {/* Property Type */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-sky-800" />
              <span>نوع العقار</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-sky-900 focus:outline-hidden transition-all"
            >
              <option value="all">جميع الأنواع</option>
              <option value="villa">فيلا / قصر</option>
              <option value="apartment">شقة سكنية</option>
              <option value="land">أرض سكنية / تجارية</option>
              <option value="commercial">معرض / مكتب تجاري</option>
            </select>
          </div>

          {/* Keyword / District */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>المنطقة أو الكود</span>
            </label>
            <input
              type="text"
              placeholder="مثال: أبو رمانة، يعفور، REF-101"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-sky-900 focus:outline-hidden transition-all"
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col justify-end sm:pt-5 lg:pt-5">
            <button
              type="submit"
              className="w-full bg-sky-900 hover:bg-sky-950 text-white font-bold py-2.5 sm:py-3 px-6 rounded-xl shadow-lg shadow-sky-950/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>ابحث عن عقارك</span>
            </button>
          </div>
        </div>

        {/* Quick Tags */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-600">الأكثر بحثاً:</span>
          <button
            type="button"
            onClick={() => {
              setPurpose('sale');
              setType('villa');
              setCity('ريف دمشق');
            }}
            className="hover:text-sky-900 underline underline-offset-2"
          >
            فلل يعفور وريف دمشق
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setPurpose('sale');
              setType('apartment');
              setCity('اللاذقية');
            }}
            className="hover:text-sky-900 underline underline-offset-2"
          >
            شقق كورنيش اللاذقية
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setPurpose('sale');
              setType('apartment');
              setCity('دمشق');
            }}
            className="hover:text-sky-900 underline underline-offset-2"
          >
            شقق دمشق الراقية
          </button>
        </div>
      </form>
    </div>
  );
}
