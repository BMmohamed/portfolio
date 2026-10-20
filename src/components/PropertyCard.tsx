'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, BedDouble, Bath, Maximize2, MessageCircle, Eye, ArrowLeft } from 'lucide-react';
import { Property } from '@/types';
import { getPropertyWhatsAppUrl, incrementPropertyWhatsApp } from '@/lib/store';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const statusBadge = () => {
    switch (property.status) {
      case 'available':
        return (
          <span className="bg-emerald-500/90 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
            متاح
          </span>
        );
      case 'reserved':
        return (
          <span className="bg-amber-500/90 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
            محجوز
          </span>
        );
      case 'sold':
        return (
          <span className="bg-rose-500/90 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
            تم البيع
          </span>
        );
    }
  };

  const purposeText = property.purpose === 'sale' ? 'للبيع' : 'للإيجار';
  const typeText = {
    apartment: 'شقة',
    villa: 'فيلا',
    land: 'أرض',
    commercial: 'تجاري',
  }[property.type];

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    incrementPropertyWhatsApp(property.id);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-sky-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Property Image & Badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="bg-sky-950/85 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md">
              {purposeText}
            </span>
            <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-md">
              {typeText}
            </span>
          </div>
          <div>{statusBadge()}</div>
        </div>

        {/* Code Badge */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded">
          {property.code}
        </div>

        {/* Views counter badge */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded flex items-center gap-1">
          <Eye className="w-3 h-3 text-slate-300" />
          <span>{property.viewsCount || 0}</span>
        </div>
      </div>

      {/* Property Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>
              {property.location.city} - {property.location.district}
            </span>
          </div>

          {/* Title */}
          <Link href={`/properties/${property.id}`} className="block group-hover:text-sky-900 transition-colors">
            <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 mb-3">
              {property.title}
            </h3>
          </Link>

          {/* Specs / Features snippet */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 justify-center bg-slate-50 py-1.5 rounded-lg">
              <Maximize2 className="w-3.5 h-3.5 text-sky-800" />
              <span>{property.area} م²</span>
            </div>
            {property.bedrooms > 0 ? (
              <div className="flex items-center gap-1.5 justify-center bg-slate-50 py-1.5 rounded-lg">
                <BedDouble className="w-3.5 h-3.5 text-sky-800" />
                <span>{property.bedrooms} غرف</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 justify-center bg-slate-50 py-1.5 rounded-lg">
                <span className="text-slate-400">-</span>
              </div>
            )}
            {property.bathrooms > 0 ? (
              <div className="flex items-center gap-1.5 justify-center bg-slate-50 py-1.5 rounded-lg">
                <Bath className="w-3.5 h-3.5 text-sky-800" />
                <span>{property.bathrooms} حمام</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 justify-center bg-slate-50 py-1.5 rounded-lg">
                <span className="text-slate-400">-</span>
              </div>
            )}
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="mt-4 pt-2 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">السعر</span>
            <div className="flex items-baseline gap-1 text-sky-950 font-black text-lg">
              <span>{property.price.toLocaleString('ar-SA')}</span>
              <span className="text-xs text-amber-600 font-bold">ر.س</span>
              {property.purpose === 'rent' && (
                <span className="text-[11px] text-slate-500 font-normal">/ سنوياً</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={getPropertyWhatsAppUrl(property)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-xs"
              title="تواصل عبر واتساب بخصوص هذا العقار"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <Link
              href={`/properties/${property.id}`}
              className="inline-flex items-center gap-1 text-xs font-bold bg-sky-900 hover:bg-sky-950 text-white px-3 py-2.5 rounded-xl transition-all shadow-xs"
            >
              <span>التفاصيل</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
