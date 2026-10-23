import { supabase, isSupabaseConfigured } from './supabase';
import { EventConfig, Guest, GuestStatus } from '@/types';
import defaultEventConfig from '@/data/event-config.json';
import defaultGuests from '@/data/guests.json';

export const DEFAULT_CONFIG: EventConfig = defaultEventConfig as EventConfig;
export const INITIAL_MOCK_GUESTS: Guest[] = defaultGuests as Guest[];

const CONFIG_STORAGE_KEY = 'cremhelado_event_config_v2';
const GUESTS_STORAGE_KEY = 'cremhelado_guests_list_v2';

function sanitizeDressCode(dressCode?: string): string {
  if (!dressCode || dressCode.includes('Elegante Casual')) {
    return 'Como mejor te sientas';
  }
  return dressCode;
}

function getLocalConfig(): EventConfig {
  if (typeof window === 'undefined') return { ...DEFAULT_CONFIG, dressCode: sanitizeDressCode(DEFAULT_CONFIG.dressCode) };
  const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
  if (!stored) {
    const fresh = { ...DEFAULT_CONFIG, dressCode: sanitizeDressCode(DEFAULT_CONFIG.dressCode) };
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
  try {
    const parsed = JSON.parse(stored);
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      dressCode: sanitizeDressCode(parsed.dressCode || DEFAULT_CONFIG.dressCode),
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

function saveLocalConfig(config: EventConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
}

function getLocalGuests(): Guest[] {
  if (typeof window === 'undefined') return isSupabaseConfigured ? [] : INITIAL_MOCK_GUESTS;
  const stored = localStorage.getItem(GUESTS_STORAGE_KEY);
  if (!stored) {
    const fallback = isSupabaseConfigured ? [] : INITIAL_MOCK_GUESTS;
    localStorage.setItem(GUESTS_STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return isSupabaseConfigured ? [] : INITIAL_MOCK_GUESTS;
  }
}

function saveLocalGuests(guests: Guest[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUESTS_STORAGE_KEY, JSON.stringify(guests));
}

// ==========================================
// SERVICIOS PÚBLICOS DE DATOS (API Central + Supabase + Fallback Local)
// ==========================================

export async function fetchEventConfig(): Promise<EventConfig> {
  // 1. En el navegador, consultar la API central del servidor (/api/config)
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/config', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.config) {
          saveLocalConfig(data.config);
          return data.config;
        }
      }
    } catch (err) {
      console.warn('Fallo consultando /api/config, usando fallback local/Supabase:', err);
    }
  }

  // 2. Intentar Supabase directamente si está configurado en el cliente
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
          dressCode: sanitizeDressCode(data.dress_code || DEFAULT_CONFIG.dressCode),
          motivationalMessage: data.motivational_message || DEFAULT_CONFIG.motivationalMessage,
          logoUrl: data.logo_url || DEFAULT_CONFIG.logoUrl,
          primaryColor: data.primary_color || DEFAULT_CONFIG.primaryColor,
          secondaryColor: data.secondary_color || DEFAULT_CONFIG.secondaryColor,
          whatsappTemplate: data.whatsapp_template || DEFAULT_CONFIG.whatsappTemplate,
          musicEnabled: data.music_enabled !== undefined ? data.music_enabled : (DEFAULT_CONFIG.musicEnabled ?? true),
          musicUrl: data.music_url || DEFAULT_CONFIG.musicUrl || '/audio/navidad-suave.mp3',
        };
      }
    } catch (e) {
      console.warn('Fallo leyendo Supabase, usando respaldo JSON/local:', e);
    }
  }

  return getLocalConfig();
}

export async function saveEventConfig(config: EventConfig): Promise<EventConfig> {
  config.dressCode = sanitizeDressCode(config.dressCode);

  // 1. Enviar a la API central del servidor (/api/config)
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.config) {
          config = data.config;
        }
      }
    } catch (err) {
      console.warn('Fallo guardando en /api/config:', err);
    }
  }

  // 2. Guardar en caché local
  saveLocalConfig(config);

  // 3. Guardar en Supabase si está disponible
  if (isSupabaseConfigured && supabase) {
    try {
      const payload: Record<string, unknown> = {
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
        music_enabled: config.musicEnabled ?? true,
        music_url: config.musicUrl || '/audio/navidad-suave.mp3',
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
  // 1. En el navegador, consultar la API central del servidor (que sincroniza entre todos los dispositivos)
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/guests', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.guests)) {
          saveLocalGuests(data.guests);
          return data.guests;
        }
      }
    } catch (err) {
      console.warn('Fallo consultando /api/guests, usando fallback local/Supabase:', err);
    }
  }

  // 2. Si hay conexión directa a Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped = data.map((item: any) => ({
          id: item.id,
          fullName: item.full_name,
          firstName: item.first_name,
          lastName: item.last_name,
          phone: item.phone,
          email: item.email,
          status: item.status as GuestStatus,
          cedula: item.cedula,
          area: item.area,
          confirmedAt: item.confirmed_at,
          notes: item.notes,
          createdAt: item.created_at,
        }));
        saveLocalGuests(mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Fallo leyendo invitados de Supabase, usando respaldo JSON/local:', e);
    }
  }

  return getLocalGuests();
}

export async function fetchGuestById(id: string): Promise<Guest | null> {
  // 1. Consultar a la API centralizada del servidor
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/rsvp?id=${encodeURIComponent(id)}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.guest) {
          return data.guest;
        }
      }
    } catch (err) {
      console.warn('Fallo consultando /api/rsvp?id, usando fallback:', err);
    }
  }

  // 2. Si hay Supabase
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
          area: data.area,
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
  extra?: { fullName?: string; cedula?: string; email?: string; area?: string; notes?: string }
): Promise<Guest | null> {
  const now = new Date().toISOString();
  let serverUpdated: Guest | null = null;

  // 1. Guardar en el servidor central vía API (para que cualquier dispositivo que confirme sea visible de inmediato en el Admin)
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status,
          ...(extra || {}),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.guest) {
          serverUpdated = data.guest;
        }
      }
    } catch (err) {
      console.warn('Error enviando RSVP al servidor central:', err);
    }
  }

  // 2. Actualizar caché local del navegador
  const localGuests = getLocalGuests();
  const index = localGuests.findIndex((g) => g.id === id);
  let updatedGuest: Guest | null = serverUpdated;

  if (index !== -1) {
    localGuests[index] = {
      ...localGuests[index],
      status,
      confirmedAt: status === 'confirmed' ? now : localGuests[index].confirmedAt,
      ...(extra?.fullName ? { fullName: extra.fullName } : {}),
      ...(extra?.cedula ? { cedula: extra.cedula } : {}),
      ...(extra?.email ? { email: extra.email } : {}),
      ...(extra?.area ? { area: extra.area } : {}),
      ...(extra?.notes ? { notes: extra.notes } : {}),
    };
    saveLocalGuests(localGuests);
    if (!updatedGuest) updatedGuest = localGuests[index];
  } else if (serverUpdated) {
    localGuests.unshift(serverUpdated);
    saveLocalGuests(localGuests);
  }

  // 3. Actualizar Supabase directamente si está configurado en cliente
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
      if (extra?.area) payload.area = extra.area;
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

  // Enviar a la API del servidor
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guest: newGuest }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.guest) {
          guest.id = data.guest.id;
        }
      }
    } catch (err) {
      console.warn('Error guardando invitado en el servidor central:', err);
    }
  }

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
            area: guest.area || null,
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

  if (typeof window !== 'undefined') {
    try {
      await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guests: newGuests }),
      });
    } catch (err) {
      console.warn('Error guardando lote en servidor central:', err);
    }
  }

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
        area: g.area || null,
      }));

      await supabase.from('guests').insert(rows);
    } catch (e) {
      console.warn('Error cargando lote a Supabase:', e);
    }
  }

  return created;
}

export async function updateGuestFull(guest: Guest): Promise<Guest> {
  // 1. Enviar a la API central del servidor
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/guests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guest }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.guest) {
          guest = data.guest;
        }
      }
    } catch (err) {
      console.warn('Error actualizando invitado vía API:', err);
    }
  }

  // 2. Actualizar caché local
  const localGuests = getLocalGuests();
  const index = localGuests.findIndex((g) => g.id === guest.id);
  if (index !== -1) {
    localGuests[index] = guest;
  } else {
    localGuests.unshift(guest);
  }
  saveLocalGuests(localGuests);

  // 3. Supabase directo si está configurado en cliente
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('guests')
        .update({
          full_name: guest.fullName,
          first_name: guest.firstName || guest.fullName.split(' ')[0],
          last_name: guest.lastName || guest.fullName.split(' ').slice(1).join(' '),
          phone: guest.phone,
          email: guest.email,
          status: guest.status,
          cedula: guest.cedula || null,
          area: guest.area || null,
          notes: guest.notes || null,
          confirmed_at: guest.status === 'confirmed' ? (guest.confirmedAt || new Date().toISOString()) : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', guest.id);
    } catch (err) {
      console.warn('Error actualizando en Supabase:', err);
    }
  }

  return guest;
}

export async function deleteGuest(id: string): Promise<boolean> {
  // 1. Eliminar en el servidor vía API
  if (typeof window !== 'undefined') {
    try {
      await fetch(`/api/guests?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Error eliminando en API:', err);
    }
  }

  // 2. Eliminar en caché local
  const localGuests = getLocalGuests().filter((g) => g.id !== id);
  saveLocalGuests(localGuests);

  // 3. Eliminar en Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('guests').delete().eq('id', id);
    } catch (e) {
      console.warn('Error eliminando de Supabase:', e);
    }
  }

  return true;
}
