import { supabase, isSupabaseConfigured } from './supabase';
import { Property, PropertyRequest, PropertyStatus, RequestStatus } from '@/types';

/**
 * تحويل صف الجدول في Supabase (snake_case) إلى كائن Property الخاص بالتطبيق (camelCase)
 */
export function mapRowToProperty(row: any): Property {
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    description: row.description || '',
    purpose: row.purpose,
    type: row.type,
    price: Number(row.price),
    location: {
      city: row.city,
      district: row.district,
      address: row.address || '',
      mapCoordinates: row.latitude && row.longitude ? {
        lat: Number(row.latitude),
        lng: Number(row.longitude)
      } : undefined
    },
    area: Number(row.area),
    bedrooms: Number(row.bedrooms || 0),
    bathrooms: Number(row.bathrooms || 0),
    livingRooms: Number(row.living_rooms || 0),
    parking: Number(row.parking || 0),
    status: row.status as PropertyStatus,
    images: Array.isArray(row.images) ? row.images : [],
    videoUrl: row.video_url || undefined,
    features: Array.isArray(row.features) ? row.features : [],
    viewsCount: Number(row.views_count || 0),
    whatsappClicks: Number(row.whatsapp_clicks || 0),
    featured: Boolean(row.featured),
    createdAt: row.created_at || new Date().toISOString()
  };
}

/**
 * تحويل كائن Property إلى صف جدول في Supabase
 */
export function mapPropertyToRow(prop: Partial<Property>): Record<string, any> {
  const row: Record<string, any> = {};

  if (prop.id !== undefined) row.id = prop.id;
  if (prop.code !== undefined) row.code = prop.code;
  if (prop.title !== undefined) row.title = prop.title;
  if (prop.description !== undefined) row.description = prop.description;
  if (prop.purpose !== undefined) row.purpose = prop.purpose;
  if (prop.type !== undefined) row.type = prop.type;
  if (prop.price !== undefined) row.price = prop.price;
  if (prop.area !== undefined) row.area = prop.area;
  if (prop.bedrooms !== undefined) row.bedrooms = prop.bedrooms;
  if (prop.bathrooms !== undefined) row.bathrooms = prop.bathrooms;
  if (prop.livingRooms !== undefined) row.living_rooms = prop.livingRooms;
  if (prop.parking !== undefined) row.parking = prop.parking;
  if (prop.status !== undefined) row.status = prop.status;
  if (prop.images !== undefined) row.images = prop.images;
  if (prop.videoUrl !== undefined) row.video_url = prop.videoUrl;
  if (prop.features !== undefined) row.features = prop.features;
  if (prop.featured !== undefined) row.featured = prop.featured;

  if (prop.location) {
    if (prop.location.city !== undefined) row.city = prop.location.city;
    if (prop.location.district !== undefined) row.district = prop.location.district;
    if (prop.location.address !== undefined) row.address = prop.location.address;
    if (prop.location.mapCoordinates) {
      row.latitude = prop.location.mapCoordinates.lat;
      row.longitude = prop.location.mapCoordinates.lng;
    }
  }

  return row;
}

/**
 * تحويل صف طلب عقار في Supabase إلى كائن PropertyRequest
 */
export function mapRowToRequest(row: any): PropertyRequest {
  return {
    id: row.id,
    clientName: row.client_name,
    clientPhone: row.client_phone,
    purpose: row.purpose,
    type: row.type,
    city: row.city,
    district: row.district || '',
    budgetMin: Number(row.budget_min || 0),
    budgetMax: Number(row.budget_max || 0),
    bedrooms: row.bedrooms ? Number(row.bedrooms) : undefined,
    notes: row.notes || '',
    status: row.status as RequestStatus,
    viewsCount: Number(row.views_count || 0),
    whatsappClicks: Number(row.whatsapp_clicks || 0),
    createdAt: row.created_at || new Date().toISOString()
  };
}

export function mapRequestToRow(req: Partial<PropertyRequest>): Record<string, any> {
  const row: Record<string, any> = {};
  if (req.id !== undefined) row.id = req.id;
  if (req.clientName !== undefined) row.client_name = req.clientName;
  if (req.clientPhone !== undefined) row.client_phone = req.clientPhone;
  if (req.purpose !== undefined) row.purpose = req.purpose;
  if (req.type !== undefined) row.type = req.type;
  if (req.city !== undefined) row.city = req.city;
  if (req.district !== undefined) row.district = req.district;
  if (req.budgetMin !== undefined) row.budget_min = req.budgetMin;
  if (req.budgetMax !== undefined) row.budget_max = req.budgetMax;
  if (req.bedrooms !== undefined) row.bedrooms = req.bedrooms;
  if (req.notes !== undefined) row.notes = req.notes;
  if (req.status !== undefined) row.status = req.status;
  return row;
}

// ================================================================
// دوال العقارات (Properties)
// ================================================================

export async function fetchPropertiesFromSupabase(): Promise<Property[] | null> {
  if (!supabase || !isSupabaseConfigured) return null;

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchProperties error:', error.message);
      return null;
    }

    return (data || []).map(mapRowToProperty);
  } catch (e) {
    console.warn('Error connecting to Supabase properties:', e);
    return null;
  }
}

export async function fetchPropertyByIdFromSupabase(id: string): Promise<Property | null> {
  if (!supabase || !isSupabaseConfigured) return null;

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .or(`id.eq.${id},code.eq.${id}`)
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return mapRowToProperty(data);
  } catch {
    return null;
  }
}

export async function insertPropertyToSupabase(prop: Property): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;

  try {
    const row = {
      ...mapPropertyToRow(prop),
      views_count: prop.viewsCount || 0,
      whatsapp_clicks: prop.whatsappClicks || 0,
      created_at: prop.createdAt || new Date().toISOString()
    };

    const { error } = await supabase.from('properties').insert(row);
    if (error) {
      console.error('Supabase insertProperty error:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Failed to insert property to Supabase:', e);
    return false;
  }
}

export async function updatePropertyInSupabase(id: string, updates: Partial<Property>): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;

  try {
    const row = mapPropertyToRow(updates);
    const { error } = await supabase.from('properties').update(row).eq('id', id);
    if (error) {
      console.error('Supabase updateProperty error:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Failed to update property in Supabase:', e);
    return false;
  }
}

export async function deletePropertyFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;

  try {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteProperty error:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Failed to delete property from Supabase:', e);
    return false;
  }
}

export async function incrementPropertyViewsInSupabase(id: string): Promise<void> {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    await supabase.rpc('increment_property_views', { prop_id: id });
  } catch {
    // Silent fallback
  }
}

export async function incrementPropertyWhatsAppInSupabase(id: string): Promise<void> {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    await supabase.rpc('increment_property_whatsapp', { prop_id: id });
  } catch {
    // Silent fallback
  }
}

// ================================================================
// دوال طلبات العقارات (Requests)
// ================================================================

export async function fetchRequestsFromSupabase(): Promise<PropertyRequest[] | null> {
  if (!supabase || !isSupabaseConfigured) return null;

  try {
    const { data, error } = await supabase
      .from('property_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchRequests error:', error.message);
      return null;
    }

    return (data || []).map(mapRowToRequest);
  } catch {
    return null;
  }
}

export async function insertRequestToSupabase(req: PropertyRequest): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;

  try {
    const row = {
      ...mapRequestToRow(req),
      created_at: req.createdAt || new Date().toISOString()
    };
    const { error } = await supabase.from('property_requests').insert(row);
    return !error;
  } catch {
    return false;
  }
}

export async function updateRequestStatusInSupabase(id: string, status: RequestStatus): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;

  try {
    const { error } = await supabase
      .from('property_requests')
      .update({ status })
      .eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteRequestFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;

  try {
    const { error } = await supabase.from('property_requests').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}
