export type PropertyPurpose = 'sale' | 'rent';
export type PropertyType = 'apartment' | 'villa' | 'land' | 'commercial';
export type PropertyStatus = 'available' | 'reserved' | 'sold';

export interface PropertyLocation {
  city: string;
  district: string;
  address?: string;
  mapCoordinates?: { lat: number; lng: number };
}

export interface Property {
  id: string;
  code: string; // e.g. "REF-101"
  title: string;
  description: string;
  purpose: PropertyPurpose; // 'sale' = للبيع, 'rent' = للإيجار
  type: PropertyType; // 'apartment' = شقة, 'villa' = فيلا, 'land' = أرض, 'commercial' = تجاري
  price: number; // in SAR
  location: PropertyLocation;
  area: number; // in m²
  bedrooms: number;
  bathrooms: number;
  livingRooms?: number;
  parking?: number;
  status: PropertyStatus; // 'available' = متاح, 'reserved' = محجوز, 'sold' = تم البيع
  images: string[];
  features: string[];
  viewsCount: number;
  whatsappClicks: number;
  featured: boolean;
  createdAt: string;
}

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface PropertyRequest {
  id: string;
  clientName: string;
  clientPhone: string;
  purpose: 'buy' | 'rent'; // 'buy' = شراء, 'rent' = إيجار
  type: PropertyType;
  city: string;
  district: string;
  budgetMin: number;
  budgetMax: number;
  bedrooms?: number;
  notes: string;
  status: RequestStatus; // 'pending' = قيد المراجعة, 'approved' = معتمد, 'rejected' = مرفوض
  viewsCount: number;
  whatsappClicks: number;
  createdAt: string;
}

export interface AgencyService {
  id: string;
  title: string;
  slug: string;
  iconName: string;
  shortDesc: string;
  fullDesc: string;
  benefits: string[];
}

export interface AnalyticsSummary {
  totalVisits: number;
  totalProperties: number;
  totalRequests: number;
  totalWhatsAppClicks: number;
}
