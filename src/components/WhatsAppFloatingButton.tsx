'use client';

import { MessageCircle } from 'lucide-react';
import { AGENCY_CONFIG } from '@/lib/data';
import { getGeneralWhatsAppUrl } from '@/lib/store';

export default function WhatsAppFloatingButton() {
  return (
    <div className="fixed bottom-6 left-6 z-40 group">
      <a
        href={getGeneralWhatsAppUrl('مرحباً، أود الاستفسار عن خدمات وعروض رؤية العقارية.')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معنا عبر واتساب"
        className="flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
      >
        <MessageCircle className="w-6 h-6 fill-white text-emerald-500" />
        <span className="hidden sm:inline font-bold text-sm tracking-wide">
          تواصل معنا عبر واتساب
        </span>
      </a>
      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
      </span>
    </div>
  );
}
