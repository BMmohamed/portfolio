'use client';

import { Property, PropertyRequest, AnalyticsSummary, PropertyStatus, RequestStatus } from '@/types';
import { INITIAL_PROPERTIES, INITIAL_REQUESTS, AGENCY_CONFIG } from './data';

const STORAGE_KEYS = {
  PROPERTIES: 'ruya_aqar_properties_v3',
  REQUESTS: 'ruya_aqar_requests_v3',
  VISITS: 'ruya_aqar_visits_v3',
  AUTH: 'ruya_aqar_admin_auth_v1',
};

// Safe access to LocalStorage
export function getStoredProperties(): Property[] {
  if (typeof window === 'undefined') return INITIAL_PROPERTIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(INITIAL_PROPERTIES));
      return INITIAL_PROPERTIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROPERTIES;
  }
}

export function saveProperties(properties: Property[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
    window.dispatchEvent(new Event('aqar_properties_updated'));
  } catch (e) {
    console.error('Error saving properties to localStorage', e);
  }
}

export function getStoredRequests(): PropertyRequest[] {
  if (typeof window === 'undefined') return INITIAL_REQUESTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REQUESTS;
  }
}

export function saveRequests(requests: PropertyRequest[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    window.dispatchEvent(new Event('aqar_requests_updated'));
  } catch (e) {
    console.error('Error saving requests to localStorage', e);
  }
}

// Analytics and Visits
export function trackWebsiteVisit(): number {
  if (typeof window === 'undefined') return 1240;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VISITS);
    const count = raw ? parseInt(raw, 10) + 1 : 1240;
    localStorage.setItem(STORAGE_KEYS.VISITS, count.toString());
    return count;
  } catch {
    return 1240;
  }
}

export function getWebsiteVisits(): number {
  if (typeof window === 'undefined') return 1240;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VISITS);
    return raw ? parseInt(raw, 10) : 1240;
  } catch {
    return 1240;
  }
}

// Property CRUD & Actions
export function getPropertiesList(): Property[] {
  return getStoredProperties();
}

export function getPropertyById(id: string): Property | undefined {
  const list = getStoredProperties();
  return list.find((p) => p.id === id || p.code === id);
}

export function incrementPropertyView(id: string): void {
  const list = getStoredProperties();
  const index = list.findIndex((p) => p.id === id || p.code === id);
  if (index !== -1) {
    list[index].viewsCount = (list[index].viewsCount || 0) + 1;
    saveProperties(list);
  }
}

export function incrementPropertyWhatsApp(id: string): void {
  const list = getStoredProperties();
  const index = list.findIndex((p) => p.id === id || p.code === id);
  if (index !== -1) {
    list[index].whatsappClicks = (list[index].whatsappClicks || 0) + 1;
    saveProperties(list);
  }
}

export function addProperty(propertyData: Omit<Property, 'id' | 'viewsCount' | 'whatsappClicks' | 'createdAt'>): Property {
  const list = getStoredProperties();
  const newProperty: Property = {
    ...propertyData,
    id: `prop-${Date.now()}`,
    code: propertyData.code || `REF-${Math.floor(100 + Math.random() * 900)}`,
    viewsCount: 0,
    whatsappClicks: 0,
    createdAt: new Date().toISOString(),
  };
  list.unshift(newProperty);
  saveProperties(list);
  return newProperty;
}

export function updateProperty(id: string, updates: Partial<Property>): Property | null {
  const list = getStoredProperties();
  const index = list.findIndex((p) => p.id === id);
  if (index === -1) return null;

  list[index] = { ...list[index], ...updates };
  saveProperties(list);
  return list[index];
}

export function updatePropertyStatus(id: string, status: PropertyStatus): boolean {
  return Boolean(updateProperty(id, { status }));
}

export function deleteProperty(id: string): boolean {
  const list = getStoredProperties();
  const filtered = list.filter((p) => p.id !== id);
  if (filtered.length !== list.length) {
    saveProperties(filtered);
    return true;
  }
  return false;
}

// Requests CRUD & Actions
export function getApprovedRequests(): PropertyRequest[] {
  return getStoredRequests().filter((r) => r.status === 'approved');
}

export function getAllRequests(): PropertyRequest[] {
  return getStoredRequests();
}

export function addVisitorRequest(requestData: Omit<PropertyRequest, 'id' | 'status' | 'viewsCount' | 'whatsappClicks' | 'createdAt'>): PropertyRequest {
  const list = getStoredRequests();
  const newRequest: PropertyRequest = {
    ...requestData,
    id: `req-${Date.now()}`,
    status: 'pending', // visitor submissions are pending admin approval
    viewsCount: 0,
    whatsappClicks: 0,
    createdAt: new Date().toISOString(),
  };
  list.unshift(newRequest);
  saveRequests(list);
  return newRequest;
}

export function addAdminRequest(requestData: Omit<PropertyRequest, 'id' | 'viewsCount' | 'whatsappClicks' | 'createdAt'>): PropertyRequest {
  const list = getStoredRequests();
  const newRequest: PropertyRequest = {
    ...requestData,
    id: `req-${Date.now()}`,
    viewsCount: 0,
    whatsappClicks: 0,
    createdAt: new Date().toISOString(),
  };
  list.unshift(newRequest);
  saveRequests(list);
  return newRequest;
}

export function updateRequestStatus(id: string, status: RequestStatus): boolean {
  const list = getStoredRequests();
  const index = list.findIndex((r) => r.id === id);
  if (index === -1) return false;

  list[index].status = status;
  saveRequests(list);
  return true;
}

export function deleteRequest(id: string): boolean {
  const list = getStoredRequests();
  const filtered = list.filter((r) => r.id !== id);
  if (filtered.length !== list.length) {
    saveRequests(filtered);
    return true;
  }
  return false;
}

export function incrementRequestWhatsApp(id: string): void {
  const list = getStoredRequests();
  const index = list.findIndex((r) => r.id === id);
  if (index !== -1) {
    list[index].whatsappClicks = (list[index].whatsappClicks || 0) + 1;
    saveRequests(list);
  }
}

// WhatsApp Helper
export function getPropertyWhatsAppUrl(property: Property): string {
  const text = `مرحباً، أود الاستفسار بخصوص العقار كود [${property.code}]: "${property.title}" المعروض بسعر ${property.price.toLocaleString('ar-SA')} ريال. رابط العقار: ${typeof window !== 'undefined' ? window.location.origin : ''}/properties/${property.id}`;
  return `https://wa.me/${AGENCY_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function getGeneralWhatsAppUrl(message?: string): string {
  const text = message || `مرحباً، أود التواصل مع فريق رؤية العقارية بخصوص استفسار عقاري.`;
  return `https://wa.me/${AGENCY_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function getClientRequestWhatsAppUrl(request: PropertyRequest): string {
  const cleanPhone = request.clientPhone.replace(/\D/g, '');
  const text = `مرحباً أستاذ ${request.clientName}، بخصوص طلبك العقاري (${request.purpose === 'buy' ? 'شراء' : 'إيجار'} ${request.type === 'villa' ? 'فيلا' : request.type === 'apartment' ? 'شقة' : request.type === 'land' ? 'أرض' : 'عقار تجاري'}) في ${request.city} - ${request.district}، لدينا عروض تناسب طلبك تماماً.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

// Admin Auth Helper
export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
}

export function setAdminAuthenticated(val: boolean) {
  if (typeof window === 'undefined') return;
  if (val) {
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  }
}

// Analytics Calculation
export function getAnalyticsSummary(): AnalyticsSummary {
  const properties = getStoredProperties();
  const requests = getStoredRequests();
  const visits = getWebsiteVisits();

  const totalWhatsAppClicks =
    properties.reduce((acc, p) => acc + (p.whatsappClicks || 0), 0) +
    requests.reduce((acc, r) => acc + (r.whatsappClicks || 0), 0);

  return {
    totalVisits: visits,
    totalProperties: properties.filter((p) => p.status === 'available').length,
    totalRequests: requests.filter((r) => r.status === 'approved').length,
    totalWhatsAppClicks,
  };
}
