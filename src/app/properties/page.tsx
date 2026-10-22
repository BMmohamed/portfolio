'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Home, 
  RotateCcw, 
  Building2, 
  Check, 
  ArrowUpDown 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import AddRequestModal from '@/components/AddRequestModal';
import { getStoredProperties } from '@/lib/store';
import { Property, PropertyPurpose, PropertyType, PropertyStatus } from '@/types';

function PropertiesContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Filters state initialized from URL query params
  const [purpose, setPurpose] = useState<string>(searchParams.get('purpose') || 'all');
  const [type, setType] = useState<string>(searchParams.get('type') || 'all');
  const [city, setCity] = useState<string>(searchParams.get('city') || 'all');
  const [status, setStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [bedrooms, setBedrooms] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  useEffect(() => {
    setProperties(getStoredProperties());
    const handleUpdate = () => {
      setProperties(getStoredProperties());
    };
    window.addEventListener('aqar_properties_updated', handleUpdate);
    return () => window.removeEventListener('aqar_properties_updated', handleUpdate);
  }, []);

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter((prop) => {
        // Purpose
        if (purpose !== 'all' && prop.purpose !== purpose) return false;
        // Type
        if (type !== 'all' && prop.type !== type) return false;
        // City
        if (city !== 'all' && prop.location.city !== city) return false;
        // Status
        if (status !== 'all' && prop.status !== status) return false;
        // Bedrooms
        if (bedrooms !== 'all') {
          const num = Number(bedrooms);
          if (num === 5 && prop.bedrooms < 5) return false;
          if (num !== 5 && prop.bedrooms !== num) return false;
        }
        // Min Price
        if (minPrice && prop.price < Number(minPrice)) return false;
        // Max Price
        if (maxPrice && prop.price > Number(maxPrice)) return false;
        // Keyword Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = prop.title.toLowerCase().includes(q);
          const matchCode = prop.code.toLowerCase().includes(q);
          const matchDistrict = prop.location.district.toLowerCase().includes(q);
          const matchDesc = prop.description.toLowerCase().includes(q);
          if (!matchTitle && !matchCode && !matchDistrict && !matchDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [properties, purpose, type, city, status, bedrooms, minPrice, maxPrice, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setPurpose('all');
    setType('all');
    setCity('all');
    setStatus('all');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('all');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar onOpenRequestModal={() => setIsRequestModalOpen(true)} />

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-sky-950 via-slate-900 to-sky-950 text-white py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
            جميع العروض العقارية المتاحة
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            ابحث واستكشف تشكيلتنا الواسعة من الفلل الفاخرة، الشقق السكنية، المعارض التجارية، والأراضي في كافة مدن المملكة.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Advanced Filters Panel */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 mb-8">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-sky-900 font-bold text-base">
              <SlidersHorizontal className="w-5 h-5 text-amber-500" />
              <span>خيارات البحث والتصفية المتقدمة</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط الفلاتر</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Search Query */}
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>البحث بالكلمة أو الكود</span>
              </label>
              <input
                type="text"
                placeholder="ابحث بحي، مواصفات، REF..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
              />
            </div>

            {/* Purpose */}
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">
                الغرض (بيع / إيجار)
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
              >
                <option value="all">الكل (بيع وإيجار)</option>
                <option value="sale">عقارات للبيع</option>
                <option value="rent">عقارات للإيجار</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">
                نوع العقار
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
              >
                <option value="all">جميع الأنواع</option>
                <option value="villa">فلل وقصور</option>
                <option value="apartment">شقق سكنية</option>
                <option value="land">أراضٍ</option>
                <option value="commercial">عقارات تجارية</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">
                المدينة
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
              >
                <option value="all">جميع المحافظات</option>
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

            {/* Price Range */}
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">
                السعر الأدنى (ل.س)
              </label>
              <input
                type="number"
                placeholder="مثال: 50000000"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">
                السعر الأقصى (ل.س)
              </label>
              <input
                type="number"
                placeholder="مثال: 5000000000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">
                عدد الغرف
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
              >
                <option value="all">أي عدد</option>
                <option value="1">1 غرفة</option>
                <option value="2">2 غرف</option>
                <option value="3">3 غرف</option>
                <option value="4">4 غرف</option>
                <option value="5">5 غرف فأكثر</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">
                حالة العقار
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
              >
                <option value="all">الكل (متاح، محجوز، مباع)</option>
                <option value="available">متاح فقط</option>
                <option value="reserved">محجوز</option>
                <option value="sold">تم البيع</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="text-sm text-slate-600 font-medium">
            تم العثور على{' '}
            <span className="font-bold text-sky-950 text-base">
              {filteredProperties.length}
            </span>{' '}
            عقار مطابق لخيارات البحث
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>ترتيب حسب:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
            >
              <option value="newest">الأحدث إضافة</option>
              <option value="price-asc">الأقل سعراً</option>
              <option value="price-desc">الأعلى سعراً</option>
            </select>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-xl mx-auto my-12 space-y-4">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              لا توجد نتائج مطابقة لبحثك
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              لم نعثر على عقار يطابق الفلاتر المحددة حالياً. يمكنك إعادة ضبط الفلاتر أو تسجيل طلبك العقاري وسنبحث لك عنه فوراً.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleResetFilters}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors"
              >
                إلغاء الفلاتر
              </button>
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors"
              >
                سجل طلبك العقاري
              </button>
            </div>
          </div>
        )}
      </main>

      <WhatsAppFloatingButton />
      <AddRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
      <Footer />
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-bold text-sky-900">جاري تحميل العروض العقارية...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}
