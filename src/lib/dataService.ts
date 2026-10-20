import { supabase, isSupabaseConfigured } from './supabase';
import { EventConfig, Guest, GuestStatus } from '@/types';
import defaultEventConfig from '@/data/event-config.json';
import defaultGuests from '@/data/guests.json';

export const DEFAULT_CONFIG: EventConfig = defaultEventConfig as EventConfig;
export const INITIAL_MOCK_GUESTS: Guest[] = defaultGuests as Guest[];

const CONFIG_STORAGE_KEY = 'cremhelado_event_config_v2';
const GUESTS_STORAGE_KEY = 'cremhelado_guests_list_v2';

function getLocalConfig(): EventConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(DEFAULT_CONFIG));
    return DEFAULT_CONFIG;
  }
  try {
    return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

function saveLocalConfig(config: EventConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
}

function getLocalGuests(): Guest[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_GUESTS;
  const stored = localStorage.getItem(GUESTS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(GUESTS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_GUESTS));
    return INITIAL_MOCK_GUESTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_MOCK_GUESTS;
  }
}

function saveLocalGuests(guests: Guest[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUESTS_STORAGE_KEY, JSON.stringify(guests));
}

// ==========================================
// SERVICIOS PÚBLICOS DE DATOS (Supabase + Fallback JSON/Local)
// ==========================================

export async function fetchEventConfig(): Promise<EventConfig> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('event_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          eventName: data.event_name || DEFAULT_CONFIG.eventName,
          companyName: data.company_name || DEFAULT_CONFIG.companyName,
          eventDate: data.event_date || DEFAULT_CONFIG.eventDate,
          eventTime: (data.event_time || DEFAULT_CONFIG.eventTime).slice(0, 5),
          locationName: data.location_name || DEFAULT_CONFIG.locationName,
          locationAddress: data.location_address || DEFAULT_CONFIG.locationAddress,
          mapsUrl: data.maps_url || DEFAULT_CONFIG.mapsUrl,
          dressCode: data.dress_code || DEFAULT_CONFIG.dressCode,
          motivationalMessage: data.motivational_message || DEFAULT_CONFIG.motivationalMessage,
          logoUrl: data.logo_url || DEFAULT_CONFIG.logoUrl,
          primaryColor: data.primary_color || DEFAULT_CONFIG.primaryColor,
          secondaryColor: data.secondary_color || DEFAULT_CONFIG.secondaryColor,
          whatsappTemplate: data.whatsapp_template || DEFAULT_CONFIG.whatsappTemplate,
        };
      }
    } catch (e) {
      console.warn('Fallo leyendo Supabase, usando respaldo JSON/local:', e);
    }
  }

  return getLocalConfig();
}

export async function saveEventConfig(config: EventConfig): Promise<EventConfig> {
  saveLocalConfig(config);

  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {
        event_name: config.eventName,
        company_name: config.companyName,
        event_date: config.eventDate,
        event_time: config.eventTime,
        location_name: config.locationName,
        location_address: config.locationAddress,
        maps_url: config.mapsUrl,
        dress_code: config.dressCode,
        motivational_message: config.motivationalMessage,
        logo_url: config.logoUrl,
        primary_color: config.primaryColor,
        secondary_color: config.secondaryColor,
        whatsapp_template: config.whatsappTemplate,
        updated_at: new Date().toISOString(),
      };

      if (config.id) {
        await supabase.from('event_config').update(payload).eq('id', config.id);
      } else {
        const { data } = await supabase.from('event_config').insert([payload]).select().single();
        if (data) config.id = data.id;
      }
    } catch (e) {
      console.warn('Error guardando en Supabase:', e);
    }
  }

  return config;
}

export async function fetchGuests(): Promise<Guest[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((item: any) => ({
          id: item.id,
          fullName: item.full_name,
          firstName: item.first_name,
          lastName: item.last_name,
          phone: item.phone,
          email: item.email,
          status: item.status as GuestStatus,
          cedula: item.cedula,
          confirmedAt: item.confirmed_at,
          notes: item.notes,
          createdAt: item.created_at,
        }));
      }
    } catch (e) {
      console.warn('Fallo leyendo invitados de Supabase, usando respaldo JSON/local:', e);
    }
  }

  return getLocalGuests();
}

export async function fetchGuestById(id: string): Promise<Guest | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          fullName: data.full_name,
          firstName: data.first_name,
          lastName: data.last_name,
          phone: data.phone,
          email: data.email,
          status: data.status as GuestStatus,
          cedula: data.cedula,
          confirmedAt: data.confirmed_at,
          notes: data.notes,
          createdAt: data.created_at,
        };
      }
    } catch (e) {
      console.warn('Fallo consultando invitado en Supabase:', e);
    }
  }

  const local = getLocalGuests();
  return local.find((g) => g.id === id) || null;
}

export async function updateGuestStatus(
  id: string,
  status: GuestStatus,
  extra?: { fullName?: string; cedula?: string; email?: string; notes?: string }
): Promise<Guest | null> {
  const now = new Date().toISOString();

  // Actualizar local
  const localGuests = getLocalGuests();
  const index = localGuests.findIndex((g) => g.id === id);
  let updatedGuest: Guest | null = null;

  if (index !== -1) {
    localGuests[index] = {
      ...localGuests[index],
      status,
      confirmedAt: status === 'confirmed' ? now : localGuests[index].confirmedAt,
      ...(extra?.fullName ? { fullName: extra.fullName } : {}),
      ...(extra?.cedula ? { cedula: extra.cedula } : {}),
      ...(extra?.email ? { email: extra.email } : {}),
      ...(extra?.notes ? { notes: extra.notes } : {}),
    };
    saveLocalGuests(localGuests);
    updatedGuest = localGuests[index];
  }

  // Actualizar Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const payload: any = {
        status,
        updated_at: now,
      };
      if (status === 'confirmed') payload.confirmed_at = now;
      if (extra?.fullName) payload.full_name = extra.fullName;
      if (extra?.cedula) payload.cedula = extra.cedula;
      if (extra?.email) payload.email = extra.email;
      if (extra?.notes) payload.notes = extra.notes;

      await supabase.from('guests').update(payload).eq('id', id);
    } catch (e) {
      console.warn('Error actualizando en Supabase:', e);
    }
  }

  return updatedGuest;
}

export async function addGuest(newGuest: Omit<Guest, 'id' | 'createdAt'>): Promise<Guest> {
  const id = `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const guest: Guest = {
    ...newGuest,
    id,
    createdAt: new Date().toISOString(),
  };

  const localGuests = getLocalGuests();
  localGuests.unshift(guest);
  saveLocalGuests(localGuests);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase
        .from('guests')
        .insert([
          {
            full_name: guest.fullName,
            first_name: guest.firstName || guest.fullName.split(' ')[0],
            last_name: guest.lastName || guest.fullName.split(' ').slice(1).join(' '),
            phone: guest.phone,
            email: guest.email,
            status: guest.status,
            cedula: guest.cedula || null,
          },
        ])
        .select()
        .single();

      if (data) {
        guest.id = data.id;
      }
    } catch (e) {
      console.warn('Error agregando invitado a Supabase:', e);
    }
  }

  return guest;
}

export async function addGuestsBulk(
  newGuests: Array<Omit<Guest, 'id' | 'createdAt'>>
): Promise<Guest[]> {
  const created: Guest[] = newGuests.map((g, idx) => ({
    ...g,
    id: `inv-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  }));

  const localGuests = getLocalGuests();
  const updatedList = [...created, ...localGuests];
  saveLocalGuests(updatedList);

  if (isSupabaseConfigured && supabase) {
    try {
      const rows = created.map((g) => ({
        full_name: g.fullName,
        first_name: g.firstName || g.fullName.split(' ')[0],
        last_name: g.lastName || g.fullName.split(' ').slice(1).join(' '),
        phone: g.phone,
        email: g.email,
        status: g.status,
      }));

      await supabase.from('guests').insert(rows);
    } catch (e) {
      console.warn('Error cargando lote a Supabase:', e);
    }
  }

  return created;
}

export async function deleteGuest(id: string): Promise<boolean> {
  const localGuests = getLocalGuests().filter((g) => g.id !== id);
  saveLocalGuests(localGuests);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('guests').delete().eq('id', id);
    } catch (e) {
      console.warn('Error eliminando de Supabase:', e);
    }
  }

  return true;
}
