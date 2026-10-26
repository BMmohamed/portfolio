'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Maximize2, 
  BedDouble, 
  Bath, 
  Car, 
  Eye, 
  Share2, 
  MessageCircle, 
  PhoneCall, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  Calculator,
  Compass,
  Play,
  ExternalLink,
  Video,
  Image as ImageIcon
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import AddRequestModal from '@/components/AddRequestModal';
import PropertyCard from '@/components/PropertyCard';
import { 
  getPropertyById, 
  incrementPropertyView, 
  incrementPropertyWhatsApp, 
  getPropertyWhatsAppUrl,
  getStoredProperties 
} from '@/lib/store';
import { AGENCY_CONFIG } from '@/lib/data';
import { 
  extractYouTubeId, 
  getYouTubeEmbedUrl, 
  getYouTubeWatchUrl, 
  getYouTubeThumbnailUrl 
} from '@/lib/youtube';
import { Property } from '@/types';

function PropertyDetailsContent() {
  const router = useRouter();
  const routeParams = useParams();
  const id = typeof routeParams?.id === 'string' ? routeParams.id : Array.isArray(routeParams?.id) ? routeParams.id[0] : '';
  const [property, setProperty] = useState<Property | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [mediaMode, setMediaMode] = useState<'photos' | 'video'>('photos');
  const [copied, setCopied] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (!id) return;
    
    const loadProperty = () => {
      const p = getPropertyById(id);
      if (p) {
        setProperty(p);
        // Find similar properties
        const all = getStoredProperties();
        const similar = all.filter(
          (item) => item.id !== p.id && (item.type === p.type || item.location.city === p.location.city)
        ).slice(0, 3);
        setSimilarProperties(similar);
      }
    };

    loadProperty();
    incrementPropertyView(id);

    window.addEventListener('aqar_properties_updated', loadProperty);
    return () => window.removeEventListener('aqar_properties_updated', loadProperty);
  }, [id]);

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-slate-800">العقار غير موجود أو تم حذفه</h2>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 bg-sky-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة إلى العروض العقارية</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleWhatsAppClick = () => {
    // Increment WhatsApp counter as required!
    incrementPropertyWhatsApp(property.id);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statusBadge = () => {
    switch (property.status) {
      case 'available':
        return <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">متاح</span>;
      case 'reserved':
        return <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">محجوز</span>;
      case 'sold':
        return <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">تم البيع</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar onOpenRequestModal={() => setIsRequestModalOpen(true)} />

      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-sky-900">الرئيسية</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-sky-900">العروض العقارية</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold truncate max-w-xs">{property.title}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Top Header with title, code, price */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-sky-900 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                {property.purpose === 'sale' ? 'للبيع' : 'للإيجار'}
              </span>
              <span className="bg-slate-200 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-md">
                {property.type === 'villa' ? 'فيلا' : property.type === 'apartment' ? 'شقة' : property.type === 'land' ? 'أرض' : 'تجاري'}
              </span>
              {statusBadge()}
              <span className="bg-amber-100 text-amber-800 font-mono text-xs font-bold px-2.5 py-1 rounded-md">
                كود العقار: {property.code}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1 mr-2">
                <Eye className="w-3.5 h-3.5" />
                <span>{property.viewsCount || 0} مشاهدة</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              {property.title}
            </h1>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-2">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{property.location.city} - {property.location.district} ({property.location.address})</span>
            </div>
          </div>

          {/* Price display & share button */}
          <div className="flex lg:flex-col items-baseline lg:items-end justify-between gap-2 bg-sky-50 lg:bg-transparent p-4 lg:p-0 rounded-2xl">
            <div>
              <span className="text-xs text-slate-500 block">السعر المطلوب</span>
              <div className="flex items-baseline gap-1 text-2xl sm:text-3xl font-black text-sky-950">
                <span>{property.price.toLocaleString('en-US')}</span>
                <span className="text-sm font-bold text-amber-600">$</span>
                {property.purpose === 'rent' && (
                  <span className="text-xs text-slate-500 font-normal">/ سنوياً</span>
                )}
              </div>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-bold bg-white lg:bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'تم نسخ الرابط!' : 'مشاركة العقار'}</span>
            </button>
          </div>
        </div>

        {/* Media (Gallery + YouTube Video) */}
        {(() => {
          const hasVideo = Boolean(property.videoUrl && extractYouTubeId(property.videoUrl));
          const youtubeEmbedUrl = hasVideo ? getYouTubeEmbedUrl(property.videoUrl) : null;
          const youtubeWatchUrl = hasVideo ? getYouTubeWatchUrl(property.videoUrl) : null;

          return (
            <div className="mb-10">
              {/* Media Switcher Tabs if Video is available */}
              {hasVideo && (
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => setMediaMode('photos')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      mediaMode === 'photos'
                        ? 'bg-sky-900 text-white shadow-md'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>الصور الفوتوغرافية ({property.images.length})</span>
                  </button>

                  <button
                    onClick={() => setMediaMode('video')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      mediaMode === 'video'
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                        : 'bg-white text-slate-600 hover:bg-red-50 hover:text-red-600 border border-slate-200'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>جولة الفيديو (يوتيوب)</span>
                    <span className="bg-red-100 text-red-800 text-[10px] px-1.5 py-0.5 rounded-full font-black">HD</span>
                  </button>
                </div>
              )}

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Main Viewport */}
                <div className="lg:col-span-3 aspect-16/10 rounded-3xl overflow-hidden shadow-md bg-slate-900 relative">
                  {mediaMode === 'video' && hasVideo ? (
                    <div className="w-full h-full relative">
                      <iframe
                        src={youtubeEmbedUrl || ''}
                        title={property.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                      {/* Direct YouTube link button overlay */}
                      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-auto">
                        <a
                          href={youtubeWatchUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-black/80 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1.5 transition-all shadow-lg"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>فتح على YouTube</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={property.images[activeImageIndex] || property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Thumbnails column */}
                <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
                  {/* Video Thumbnail Button if available */}
                  {hasVideo && (
                    <button
                      onClick={() => setMediaMode('video')}
                      className={`relative shrink-0 lg:shrink aspect-16/10 w-28 lg:w-full rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-slate-900 group ${
                        mediaMode === 'video'
                          ? 'border-red-500 ring-2 ring-red-500/30'
                          : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                      title="مشاهدة جولة الفيديو على يوتيوب"
                    >
                      <img
                        src={getYouTubeThumbnailUrl(property.videoUrl) || property.images[0]}
                        alt="فيديو العقار"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-75"
                      />
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                        </div>
                        <span className="text-[10px] font-bold mt-1 bg-black/60 px-1.5 py-0.5 rounded">
                          فيديو يوتيوب
                        </span>
                      </div>
                    </button>
                  )}

                  {/* Photos Thumbnails */}
                  {property.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setMediaMode('photos');
                        setActiveImageIndex(idx);
                      }}
                      className={`relative shrink-0 lg:shrink aspect-16/10 w-28 lg:w-full rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                        mediaMode === 'photos' && activeImageIndex === idx
                          ? 'border-amber-500 ring-2 ring-amber-500/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`صورة ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {idx === 0 && (
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          الواجهة
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Specs Cards */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
              <h3 className="font-bold text-slate-900 text-lg mb-4">
                المواصفات الأساسية
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl text-center space-y-1">
                  <Maximize2 className="w-5 h-5 text-sky-900 mx-auto" />
                  <span className="text-xs text-slate-500 block">المساحة الإجمالية</span>
                  <span className="text-base font-bold text-slate-900">{property.area} م²</span>
                </div>
                {property.bedrooms > 0 && (
                  <div className="bg-slate-50 p-4 rounded-2xl text-center space-y-1">
                    <BedDouble className="w-5 h-5 text-sky-900 mx-auto" />
                    <span className="text-xs text-slate-500 block">غرف النوم</span>
                    <span className="text-base font-bold text-slate-900">{property.bedrooms} غرف</span>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="bg-slate-50 p-4 rounded-2xl text-center space-y-1">
                    <Bath className="w-5 h-5 text-sky-900 mx-auto" />
                    <span className="text-xs text-slate-500 block">دورات المياه</span>
                    <span className="text-base font-bold text-slate-900">{property.bathrooms} حمامات</span>
                  </div>
                )}
                {property.parking ? (
                  <div className="bg-slate-50 p-4 rounded-2xl text-center space-y-1">
                    <Car className="w-5 h-5 text-sky-900 mx-auto" />
                    <span className="text-xs text-slate-500 block">مواقف السيارات</span>
                    <span className="text-base font-bold text-slate-900">{property.parking} سيارات</span>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-4 rounded-2xl text-center space-y-1">
                    <Building2 className="w-5 h-5 text-sky-900 mx-auto" />
                    <span className="text-xs text-slate-500 block">نوع العقار</span>
                    <span className="text-base font-bold text-slate-900">سكني / تجاري</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
              <h3 className="font-bold text-slate-900 text-lg mb-3">
                تفاصيل ووصف العقار
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Features & Amenities */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
              <h3 className="font-bold text-slate-900 text-lg mb-4">
                المزايا والمرافق المتوفرة
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dedicated YouTube Tour Section */}
            {property.videoUrl && extractYouTubeId(property.videoUrl) && (
              <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                      <span>جولة الفيديو للعقار (YouTube)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      شاهد جولة فيديو تفصيلية وحصرية داخل وخارج العقار
                    </p>
                  </div>

                  <a
                    href={getYouTubeWatchUrl(property.videoUrl) || property.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer self-start sm:self-auto"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>مشاهدة على تطبيق YouTube</span>
                  </a>
                </div>

                <div className="aspect-16/9 rounded-2xl overflow-hidden bg-black shadow-md border border-slate-100">
                  <iframe
                    src={getYouTubeEmbedUrl(property.videoUrl) || ''}
                    title={`فيديو ${property.title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-600 flex items-center justify-between">
                  <span>💡 يمكنك تشغيل الفيديو والتحكم به مباشرة هنا داخل الموقع، أو النقر على أيقونة يوتيوب أسفل اليمين للانتقال للمشاهدة على يوتيوب مباشرة.</span>
                </div>
              </div>
            )}

            {/* Location & Map Placeholder */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-500" />
                  <span>الموقع والحي</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {property.location.city} - {property.location.district}
                </span>
              </div>
              <div className="aspect-16/7 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative flex items-center justify-center text-center p-6">
                <div className="space-y-2 max-w-sm">
                  <MapPin className="w-8 h-8 text-amber-500 mx-auto animate-bounce" />
                  <div className="font-bold text-sm text-slate-800">
                    {property.location.address}
                  </div>
                  <p className="text-xs text-slate-500">
                    الموقع يتميز بالقرب من الطرق الشريانية والخدمات والمدارس والمراكز التجارية.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar: Contact & Calculator (1 Col) */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 sticky top-28">
              <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-900 to-amber-600 flex items-center justify-center text-white">
                  <Building2 className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">{AGENCY_CONFIG.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>وسيط عقاري معتمد</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA */}
              <div className="space-y-3">
                <a
                  href={getPropertyWhatsAppUrl(property)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 text-sm text-center"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>تواصل عبر الواتساب فوراً</span>
                </a>

                <a
                  href={`tel:${AGENCY_CONFIG.mobile}`}
                  className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm text-center"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <span>اتصال هاتفي مباشر</span>
                </a>
              </div>

              {/* Reference Code Notice */}
              <div className="mt-5 p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-900 space-y-1">
                <div className="font-bold">كود المرجع العقاري: {property.code}</div>
                <p className="text-[11px] text-amber-800 leading-tight">
                  يرجى ذكر هذا الكود عند التواصل لتسريع خدمة معاينة العقار والإفراغ.
                </p>
              </div>

              {/* Fast Inquiry Box */}
              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="text-xs font-bold text-sky-900 hover:text-amber-600 transition-colors"
                >
                  هل لديك طلب بمواصفات أخرى؟ اضغط هنا
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              عقارات مشابهة قد تناسبك
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((simProp) => (
                <PropertyCard key={simProp.id} property={simProp} />
              ))}
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

export default function PropertyDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center font-bold text-sky-900 text-sm">
            جاري تحميل تفاصيل العقار...
          </div>
        </div>
      }
    >
      <PropertyDetailsContent />
    </Suspense>
  );
}

