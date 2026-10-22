'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MessageCircle, 
  ExternalLink, 
  X, 
  Check, 
  Image as ImageIcon,
  Building2,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  getStoredProperties, 
  addProperty, 
  updateProperty, 
  updatePropertyStatus, 
  deleteProperty 
} from '@/lib/store';
import { Property, PropertyPurpose, PropertyType, PropertyStatus } from '@/types';

// Preset high quality photos for quick admin selection
const PRESET_IMAGES = [
  { label: 'فيلا مودرن بمسبح', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80' },
  { label: 'فيلا فخمة ليلية', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' },
  { label: 'شقة فاخرة بإطلالة', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80' },
  { label: 'صالة معيشة عصرية', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'شقة عائلية راقية', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80' },
  { label: 'أرض سكنية مستوية', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80' },
  { label: 'مكتب ومعرض تجاري', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80' },
];

function ManagePropertiesContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(searchParams.get('add') === '1');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState<PropertyPurpose>('sale');
  const [type, setType] = useState<PropertyType>('villa');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('دمشق');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [bedrooms, setBedrooms] = useState('4');
  const [bathrooms, setBathrooms] = useState('4');
  const [livingRooms, setLivingRooms] = useState('2');
  const [parking, setParking] = useState('2');
  const [status, setStatus] = useState<PropertyStatus>('available');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [featuresInput, setFeaturesInput] = useState('مسبح خاص، مصعد، تكييف مركزي، غرفة خادمة');
  const [featured, setFeatured] = useState(false);

  const loadProperties = () => {
    setProperties(getStoredProperties());
  };

  useEffect(() => {
    loadProperties();
    window.addEventListener('aqar_properties_updated', loadProperties);
    return () => window.removeEventListener('aqar_properties_updated', loadProperties);
  }, []);

  const resetForm = () => {
    setTitle('');
    setCode(`REF-${Math.floor(100 + Math.random() * 900)}`);
    setDescription('');
    setPurpose('sale');
    setType('villa');
    setPrice('');
    setCity('دمشق');
    setDistrict('');
    setAddress('');
    setArea('');
    setBedrooms('4');
    setBathrooms('4');
    setLivingRooms('2');
    setParking('2');
    setStatus('available');
    setImageUrl('');
    setSelectedImages([PRESET_IMAGES[0].url]);
    setFeaturesInput('مسبح خاص، مصعد، تكييف مركزي، غرفة خادمة');
    setFeatured(false);
    setEditingProperty(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prop: Property) => {
    setEditingProperty(prop);
    setTitle(prop.title);
    setCode(prop.code);
    setDescription(prop.description);
    setPurpose(prop.purpose);
    setType(prop.type);
    setPrice(prop.price.toString());
    setCity(prop.location.city);
    setDistrict(prop.location.district);
    setAddress(prop.location.address || '');
    setArea(prop.area.toString());
    setBedrooms(prop.bedrooms.toString());
    setBathrooms(prop.bathrooms.toString());
    setLivingRooms(prop.livingRooms?.toString() || '1');
    setParking(prop.parking?.toString() || '1');
    setStatus(prop.status);
    setSelectedImages(prop.images.length > 0 ? prop.images : [PRESET_IMAGES[0].url]);
    setFeaturesInput(prop.features.join('، '));
    setFeatured(prop.featured);
    setIsModalOpen(true);
  };

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !area || !district) return;

    const featuresList = featuresInput
      .split(/[,،]/)
      .map((f) => f.trim())
      .filter(Boolean);

    const imagesList = selectedImages.length > 0 ? selectedImages : [PRESET_IMAGES[0].url];

    if (editingProperty) {
      updateProperty(editingProperty.id, {
        title,
        code,
        description,
        purpose,
        type,
        price: Number(price),
        area: Number(area),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        livingRooms: Number(livingRooms),
        parking: Number(parking),
        location: { city, district, address },
        images: imagesList,
        features: featuresList,
        status,
        featured,
      });
    } else {
      addProperty({
        title,
        code,
        description,
        purpose,
        type,
        price: Number(price),
        area: Number(area),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        livingRooms: Number(livingRooms),
        parking: Number(parking),
        location: { city, district, address },
        images: imagesList,
        features: featuresList,
        status,
        featured,
      });
    }

    setIsModalOpen(false);
    resetForm();
    loadProperties();
  };

  const handleDelete = (id: string, propTitle: string) => {
    if (confirm(`هل أنت متأكد من حذف العقار "${propTitle}" نهائياً؟`)) {
      deleteProperty(id);
      loadProperties();
    }
  };

  // Instant Status Toggle
  const handleStatusChange = (id: string, newStatus: PropertyStatus) => {
    updatePropertyStatus(id, newStatus);
    loadProperties();
  };

  // Filtered properties
  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (purposeFilter !== 'all' && p.purpose !== purposeFilter) return false;
      if (typeFilter !== 'all' && p.type !== typeFilter) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.location.district.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [properties, purposeFilter, typeFilter, statusFilter, search]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            إدارة العروض العقارية
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إضافة وتعديل وحذف العقارات وتحديث الحالة الفورية (متاح، محجوز، تم البيع)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-sky-900 hover:bg-sky-950 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>إضافة عقار جديد</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              placeholder="ابحث بالعنوان، الكود، الحي..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-1.5 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
            />
          </div>

          {/* Purpose */}
          <select
            value={purposeFilter}
            onChange={(e) => setPurposeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
          >
            <option value="all">جميع الأغراض</option>
            <option value="sale">للبيع</option>
            <option value="rent">للإيجار</option>
          </select>

          {/* Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
          >
            <option value="all">جميع الأنواع</option>
            <option value="villa">فلل</option>
            <option value="apartment">شقق</option>
            <option value="land">أراضٍ</option>
            <option value="commercial">تجاري</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
          >
            <option value="all">جميع الحالات</option>
            <option value="available">متاح</option>
            <option value="reserved">محجوز</option>
            <option value="sold">تم البيع</option>
          </select>
        </div>

        <div className="text-xs font-bold text-slate-500">
          عدد العقارات: <span className="text-sky-900 font-black">{filtered.length}</span>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">العقار والكود</th>
                <th className="py-3.5 px-6">النوع والغرض</th>
                <th className="py-3.5 px-6">المدينة والحي</th>
                <th className="py-3.5 px-6">السعر</th>
                <th className="py-3.5 px-6 text-center">تبديل الحالة الفوري</th>
                <th className="py-3.5 px-6 text-center">التفاعل</th>
                <th className="py-3.5 px-6 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Property Info */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={prop.images[0] || PRESET_IMAGES[0].url}
                        alt={prop.title}
                        className="w-14 h-11 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                          {prop.title}
                        </div>
                        <span className="font-mono text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          {prop.code}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Purpose & Type */}
                  <td className="py-4 px-6 text-xs">
                    <span className="font-semibold text-slate-800 block">
                      {prop.type === 'villa' ? 'فيلا' : prop.type === 'apartment' ? 'شقة' : prop.type === 'land' ? 'أرض' : 'تجاري'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {prop.purpose === 'sale' ? 'للبيع' : 'للإيجار'}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="py-4 px-6 text-xs text-slate-600">
                    <span className="font-semibold block text-slate-800">{prop.location.city}</span>
                    <span className="text-[11px] text-slate-500">{prop.location.district}</span>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-6 text-xs font-bold text-slate-900">
                    {prop.price.toLocaleString('ar-SY')} <span className="text-amber-600">ل.س</span>
                  </td>

                  {/* Instant Status Toggle Dropdown / Buttons */}
                  <td className="py-4 px-6 text-center">
                    <select
                      value={prop.status}
                      onChange={(e) => handleStatusChange(prop.id, e.target.value as PropertyStatus)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-hidden transition-all cursor-pointer ${
                        prop.status === 'available'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : prop.status === 'reserved'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-rose-50 text-rose-800 border-rose-300'
                      }`}
                    >
                      <option value="available">متاح</option>
                      <option value="reserved">محجوز</option>
                      <option value="sold">تم البيع</option>
                    </select>
                  </td>

                  {/* Stats */}
                  <td className="py-4 px-6 text-center text-xs">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-slate-600 flex items-center gap-1" title="مشاهدات">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prop.viewsCount || 0}</span>
                      </span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1" title="نقرات الواتساب">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{prop.whatsappClicks || 0}</span>
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/properties/${prop.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-sky-900 hover:bg-slate-100"
                        title="معاينة الصفحة العامة"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleOpenEdit(prop)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                        title="تعديل العقار"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(prop.id, prop.title)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="حذف العقار"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-sky-900 text-white">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">
                  {editingProperty ? 'تعديل بيانات العقار' : 'إضافة عقار جديد للنظام'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProperty} className="p-6 overflow-y-auto space-y-4">
              {/* Title & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    عنوان العقار التسويقي *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: فيلا مودرن فاخرة مع مسبح خاص"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    كود المرجع (REF)
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 font-mono rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Purpose, Type, Price, Area */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    الغرض *
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value as PropertyPurpose)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  >
                    <option value="sale">للبيع</option>
                    <option value="rent">للإيجار</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    نوع العقار *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as PropertyType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  >
                    <option value="villa">فيلا / قصر</option>
                    <option value="apartment">شقة سكنية</option>
                    <option value="land">أرض</option>
                    <option value="commercial">تجاري</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    السعر (ل.س) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="مثال: 2500000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    المساحة (م²) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="مثال: 450"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    المدينة *
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
                    المنطقة / الحي *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: أبو رمانة، يعفور"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    الشارع / العنوان
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: شارع أنس بن مالك"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Rooms & Parking */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">غرف النوم</label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">دورات المياه</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">الصالات</label>
                  <input
                    type="number"
                    value={livingRooms}
                    onChange={(e) => setLivingRooms(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">المواقف</label>
                  <input
                    type="number"
                    value={parking}
                    onChange={(e) => setParking(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  الوصف الكامل للعقار
                </label>
                <textarea
                  rows={3}
                  placeholder="اكتب مواصفات العقار، الضمانات، كود البناء، والمميزات..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                />
              </div>

              {/* Features */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  المميزات والمرافق (مفصولة بفاصلة)
                </label>
                <input
                  type="text"
                  placeholder="مسبح خاص، مصعد، تكييف، غرفة سائق..."
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                />
              </div>

              {/* Photos selection (Preset pickers + custom URL) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  صور العقار (اختر من الصور الجاهزة أو ضع رابط مخصص)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (imageUrl.trim()) {
                        setSelectedImages([...selectedImages, imageUrl.trim()]);
                        setImageUrl('');
                      }
                    }}
                    className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer shrink-0"
                  >
                    إضافة صورة
                  </button>
                </div>

                {/* Preset quick selection chips */}
                <div className="pt-2">
                  <span className="text-[11px] text-slate-500 block mb-1.5 font-semibold">
                    أو اختر صوراً معمارية جاهزة:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!selectedImages.includes(preset.url)) {
                            setSelectedImages([...selectedImages, preset.url]);
                          }
                        }}
                        className="text-[11px] bg-sky-50 text-sky-900 hover:bg-sky-100 font-semibold px-2.5 py-1 rounded-lg border border-sky-200 transition-colors"
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Images Preview */}
                {selectedImages.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {selectedImages.map((img, i) => (
                      <div key={i} className="relative w-20 h-16 rounded-xl overflow-hidden border border-slate-200 group">
                        <img src={img} alt="Property" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setSelectedImages(selectedImages.filter((_, idx) => idx !== i))}
                          className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status & Featured */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <label className="text-xs font-bold text-slate-700">الحالة الأولية:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-sky-900 focus:outline-hidden"
                  >
                    <option value="available">متاح</option>
                    <option value="reserved">محجوز</option>
                    <option value="sold">تم البيع</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-slate-700">تثبيت كعقار مميز</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
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
                  {editingProperty ? 'حفظ التعديلات' : 'إضافة العقار'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ManagePropertiesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold text-sky-900">جاري تحميل إدارة العقارات...</div>}>
      <ManagePropertiesContent />
    </Suspense>
  );
}
