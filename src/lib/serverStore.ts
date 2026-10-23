import fs from 'fs';
import path from 'path';
import { Guest, GuestStatus, EventConfig } from '@/types';
import defaultGuests from '@/data/guests.json';
import defaultEventConfig from '@/data/event-config.json';
import { supabase, isSupabaseConfigured } from './supabase';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'guests.json');
const CONFIG_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'event-config.json');

// Memoria caché para entornos serverless y sincronización rápida
let memoryGuests: Guest[] = [...(defaultGuests as Guest[])];
let memoryConfig: EventConfig = { ...(defaultEventConfig as EventConfig) };

function loadFromFile(): Guest[] {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryGuests = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('No se pudo leer src/data/guests.json desde el disco, usando memoria:', err);
  }
  return memoryGuests;
}

function saveToFile(guests: Guest[]): void {
  memoryGuests = guests;
  try {
    if (fs.existsSync(path.dirname(DATA_FILE_PATH))) {
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(guests, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('No se pudo escribir en src/data/guests.json (posible entorno de solo lectura en producción):', err);
  }
}

export async function serverGetGuests(): Promise<Guest[]> {
  // 1. Intentar consultar Supabase si está configurado
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
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
      }
    } catch (err) {
      console.warn('Error leyendo invitados de Supabase en el servidor:', err);
    }
  }

  // 2. Respaldo centralizado en disco / memoria
  return loadFromFile();
}

export async function serverGetGuestById(id: string): Promise<Guest | null> {
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
    } catch (err) {
      console.warn('Error buscando invitado en Supabase:', err);
    }
  }

  const guests = loadFromFile();
  return guests.find((g) => g.id === id) || null;
}

export async function serverUpdateGuestRsvp(
  id: string,
  status: GuestStatus,
  extra?: { fullName?: string; cedula?: string; email?: string; area?: string; notes?: string }
): Promise<Guest> {
  const now = new Date().toISOString();
  const guests = loadFromFile();
  const index = guests.findIndex((g) => g.id === id);

  let updatedGuest: Guest;

  if (index !== -1) {
    guests[index] = {
      ...guests[index],
      status,
      confirmedAt: status === 'confirmed' ? now : guests[index].confirmedAt,
      ...(extra?.fullName ? { fullName: extra.fullName } : {}),
      ...(extra?.cedula ? { cedula: extra.cedula } : {}),
      ...(extra?.email ? { email: extra.email } : {}),
      ...(extra?.area ? { area: extra.area } : {}),
      ...(extra?.notes ? { notes: extra.notes } : {}),
    };
    updatedGuest = guests[index];
  } else {
    // Si no existía previamente en la lista, lo creamos para que no se pierda la confirmación
    updatedGuest = {
      id,
      fullName: extra?.fullName || 'Invitado(a) Confirmado',
      firstName: (extra?.fullName || 'Invitado').split(' ')[0],
      phone: '573000000000',
      email: extra?.email || '',
      status,
      cedula: extra?.cedula,
      area: extra?.area,
      notes: extra?.notes,
      confirmedAt: status === 'confirmed' ? now : undefined,
      createdAt: now,
    };
    guests.unshift(updatedGuest);
  }

  saveToFile(guests);

  // Sincronizar con Supabase si está disponible
  if (isSupabaseConfigured && supabase) {
    try {
      const payload: Record<string, unknown> = {
        status,
        updated_at: now,
      };
      if (status === 'confirmed') payload.confirmed_at = now;
      if (extra?.fullName) {
        payload.full_name = extra.fullName;
        payload.first_name = extra.fullName.split(' ')[0];
      }
      if (extra?.cedula) payload.cedula = extra.cedula;
      if (extra?.email) payload.email = extra.email;
      if (extra?.area) payload.area = extra.area;
      if (extra?.notes) payload.notes = extra.notes;

      const { data, error } = await supabase
        .from('guests')
        .update(payload)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (!error && !data) {
        // No existía en Supabase, lo insertamos
        await supabase.from('guests').insert([
          {
            id,
            full_name: updatedGuest.fullName,
            first_name: updatedGuest.firstName,
            phone: updatedGuest.phone,
            email: updatedGuest.email,
            status: updatedGuest.status,
            cedula: updatedGuest.cedula,
            area: updatedGuest.area,
            notes: updatedGuest.notes,
            confirmed_at: updatedGuest.confirmedAt,
          },
        ]);
      }
    } catch (err) {
      console.warn('Error sincronizando actualización en Supabase:', err);
    }
  }

  return updatedGuest;
}

export async function serverAddGuest(newGuest: Omit<Guest, 'id' | 'createdAt'>): Promise<Guest> {
  const id = `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const guest: Guest = {
    ...newGuest,
    id,
    createdAt: new Date().toISOString(),
  };

  const guests = loadFromFile();
  guests.unshift(guest);
  saveToFile(guests);

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
    } catch (err) {
      console.warn('Error guardando invitado en Supabase:', err);
    }
  }

  return guest;
}

export async function serverUpdateFullGuest(updated: Guest): Promise<Guest> {
  const guests = loadFromFile();
  const index = guests.findIndex((g) => g.id === updated.id);

  if (index !== -1) {
    guests[index] = {
      ...guests[index],
      ...updated,
      firstName: updated.fullName.split(' ')[0],
      lastName: updated.fullName.split(' ').slice(1).join(' '),
    };
    saveToFile(guests);
  } else {
    guests.unshift(updated);
    saveToFile(guests);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('guests')
        .update({
          full_name: updated.fullName,
          first_name: updated.fullName.split(' ')[0],
          last_name: updated.fullName.split(' ').slice(1).join(' '),
          phone: updated.phone,
          email: updated.email,
          status: updated.status,
          cedula: updated.cedula || null,
          area: updated.area || null,
          notes: updated.notes || null,
          confirmed_at: updated.status === 'confirmed' ? (updated.confirmedAt || new Date().toISOString()) : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updated.id);
    } catch (err) {
      console.warn('Error actualizando invitado en Supabase:', err);
    }
  }

  return updated;
}

export async function serverDeleteGuest(id: string): Promise<boolean> {
  const guests = loadFromFile().filter((g) => g.id !== id);
  saveToFile(guests);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('guests').delete().eq('id', id);
    } catch (err) {
      console.warn('Error eliminando de Supabase:', err);
    }
  }

  return true;
}

function loadConfigFromFile(): EventConfig {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const content = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object') {
        memoryConfig = { ...memoryConfig, ...parsed };
        return memoryConfig;
      }
    }
  } catch (err) {
    console.warn('No se pudo leer src/data/event-config.json desde el disco, usando memoria:', err);
  }
  return memoryConfig;
}

function saveConfigToFile(config: EventConfig): void {
  memoryConfig = config;
  try {
    if (fs.existsSync(path.dirname(CONFIG_FILE_PATH))) {
      fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('No se pudo escribir en src/data/event-config.json:', err);
  }
}

export async function serverGetEventConfig(): Promise<EventConfig> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('event_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        const mapped: EventConfig = {
          id: data.id,
          eventName: data.event_name || memoryConfig.eventName,
          companyName: data.company_name || memoryConfig.companyName,
          eventDate: data.event_date || memoryConfig.eventDate,
          eventTime: (data.event_time || memoryConfig.eventTime).slice(0, 5),
          locationName: data.location_name || memoryConfig.locationName,
          locationAddress: data.location_address || memoryConfig.locationAddress,
          mapsUrl: data.maps_url || memoryConfig.mapsUrl,
          dressCode: data.dress_code || memoryConfig.dressCode,
          motivationalMessage: data.motivational_message || memoryConfig.motivationalMessage,
          logoUrl: data.logo_url || memoryConfig.logoUrl,
          primaryColor: data.primary_color || memoryConfig.primaryColor,
          secondaryColor: data.secondary_color || memoryConfig.secondaryColor,
          whatsappTemplate: data.whatsapp_template || memoryConfig.whatsappTemplate,
          musicEnabled: data.music_enabled !== undefined ? data.music_enabled : (memoryConfig.musicEnabled ?? true),
          musicUrl: data.music_url || memoryConfig.musicUrl || '/audio/navidad-suave.mp3',
        };
        saveConfigToFile(mapped);
        return mapped;
      }
    } catch (err) {
      console.warn('Error leyendo event_config en Supabase:', err);
    }
  }

  return loadConfigFromFile();
}

export async function serverSaveEventConfig(config: EventConfig): Promise<EventConfig> {
  saveConfigToFile(config);

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
    } catch (err) {
      console.warn('Error guardando event_config en Supabase:', err);
    }
  }

  return config;
}
