'use client';

import { Property, PropertyRequest, AnalyticsSummary, PropertyStatus, RequestStatus } from '@/types';
import { INITIAL_PROPERTIES, INITIAL_REQUESTS, AGENCY_CONFIG } from './data';
import { isSupabaseConfigured } from './supabase';
import {
  fetchPropertiesFromSupabase,
  insertPropertyToSupabase,
  updatePropertyInSupabase,
  deletePropertyFromSupabase,
  incrementPropertyViewsInSupabase,
  incrementPropertyWhatsAppInSupabase,
  fetchRequestsFromSupabase,
  insertRequestToSupabase,
  updateRequestStatusInSupabase,
  deleteRequestFromSupabase
} from './supabaseService';

const STORAGE_KEYS = {
  PROPERTIES: 'ruya_aqar_properties_v4',
  REQUESTS: 'ruya_aqar_requests_v4',
  VISITS: 'ruya_aqar_visits_v4',
  AUTH: 'ruya_aqar_admin_auth_v1',
};

// Automatic background sync with Supabase
let isSyncing = false;
let hasSyncedOnce = false;

export async function syncWithSupabase(): Promise<void> {
  if (typeof window === 'undefined' || !isSupabaseConfigured || isSyncing) return;
  isSyncing = true;

  try {
    const [dbProps, dbReqs] = await Promise.all([
      fetchPropertiesFromSupabase(),
      fetchRequestsFromSupabase()
    ]);

    let changed = false;

    if (dbProps && Array.isArray(dbProps)) {
      if (dbProps.length > 0) {
        localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(dbProps));
        changed = true;
      } else {
        // If Supabase is empty, seed it with initial properties
        const local = getStoredProperties();
        if (local.length > 0) {
          for (const p of local) {
            await insertPropertyToSupabase(p);
          }
        }
      }
    }

    if (dbReqs && Array.isArray(dbReqs)) {
      if (dbReqs.length > 0) {
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(dbReqs));
        changed = true;
      }
    }

    if (changed) {
      window.dispatchEvent(new Event('aqar_properties_updated'));
      window.dispatchEvent(new Event('aqar_requests_updated'));
    }
    hasSyncedOnce = true;
  } catch (e) {
    console.warn('Sync with Supabase failed, using local storage cache:', e);
  } finally {
    isSyncing = false;
  }
}

// Trigger initial sync once when running in browser
if (typeof window !== 'undefined') {
  setTimeout(() => {
    syncWithSupabase();
  }, 100);
}

// Safe access to LocalStorage
export function getStoredProperties(): Property[] {
  if (typeof window === 'undefined') return INITIAL_PROPERTIES;

  // Trigger sync in background if configured and not yet synced
  if (isSupabaseConfigured && !hasSyncedOnce && !isSyncing) {
    syncWithSupabase();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(INITIAL_PROPERTIES));
      return INITIAL_PROPERTIES;
    }
    const parsed: Property[] = JSON.parse(raw);
    
    // Auto-heal: Ensure properties retain videoUrl from initial data if missing in cache
    let updated = false;
    parsed.forEach((p) => {
      if (!p.videoUrl) {
        const init = INITIAL_PROPERTIES.find((item) => item.id === p.id);
        if (init?.videoUrl) {
          p.videoUrl = init.videoUrl;
          updated = true;
        }
      }
    });

    if (updated) {
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(parsed));
    }

    return parsed;
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

  if (isSupabaseConfigured && !hasSyncedOnce && !isSyncing) {
    syncWithSupabase();
  }

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
  if (isSupabaseConfigured) {
    incrementPropertyViewsInSupabase(id);
  }
}

export function incrementPropertyWhatsApp(id: string): void {
  const list = getStoredProperties();
  const index = list.findIndex((p) => p.id === id || p.code === id);
  if (index !== -1) {
    list[index].whatsappClicks = (list[index].whatsappClicks || 0) + 1;
    saveProperties(list);
  }
  if (isSupabaseConfigured) {
    incrementPropertyWhatsAppInSupabase(id);
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

  if (isSupabaseConfigured) {
    insertPropertyToSupabase(newProperty);
  }

  return newProperty;
}

export function updateProperty(id: string, updates: Partial<Property>): Property | null {
  const list = getStoredProperties();
  const index = list.findIndex((p) => p.id === id);
  if (index === -1) return null;

  list[index] = { ...list[index], ...updates };
  saveProperties(list);

  if (isSupabaseConfigured) {
    updatePropertyInSupabase(id, updates);
  }

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
    if (isSupabaseConfigured) {
      deletePropertyFromSupabase(id);
    }
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

  if (isSupabaseConfigured) {
    insertRequestToSupabase(newRequest);
  }

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

  if (isSupabaseConfigured) {
    insertRequestToSupabase(newRequest);
  }

  return newRequest;
}

export function updateRequestStatus(id: string, status: RequestStatus): boolean {
  const list = getStoredRequests();
  const index = list.findIndex((r) => r.id === id);
  if (index === -1) return false;

  list[index].status = status;
  saveRequests(list);

  if (isSupabaseConfigured) {
    updateRequestStatusInSupabase(id, status);
  }

  return true;
}

export function deleteRequest(id: string): boolean {
  const list = getStoredRequests();
  const filtered = list.filter((r) => r.id !== id);
  if (filtered.length !== list.length) {
    saveRequests(filtered);
    if (isSupabaseConfigured) {
      deleteRequestFromSupabase(id);
    }
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
  const text = `مرحباً، أود الاستفسار بخصوص العقار كود [${property.code}]: "${property.title}" المعروض بسعر ${property.price.toLocaleString('ar-SA')} دولار. رابط العقار: ${typeof window !== 'undefined' ? window.location.origin : ''}/properties/${property.id}`;
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
