-- ==============================================================
-- SISTEMA DE INVITACIONES PARA FIESTA DE EMPRESA
-- Desarrollado con amor en Medellin .Co por Lenipseart Developer
-- Contacto: 320 804 8128 (whatsapp)
-- ==============================================================

-- 1. Tabla de Configuración del Evento
CREATE TABLE IF NOT EXISTS event_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL DEFAULT 'Gran Fiesta de Fin de Año & Despedida',
  company_name TEXT NOT NULL DEFAULT 'Cream Helado',
  event_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  event_time TIME NOT NULL DEFAULT '19:00:00',
  location_name TEXT NOT NULL DEFAULT 'Centro de Eventos & Convenciones',
  location_address TEXT NOT NULL DEFAULT 'Calle 10 # 43E-10, El Poblado, Medellín',
  maps_url TEXT NOT NULL DEFAULT 'https://maps.google.com',
  dress_code TEXT NOT NULL DEFAULT 'Elegante Casual / Brillo & Cóctel',
  motivational_message TEXT NOT NULL DEFAULT '¡Ha sido un año extraordinario lleno de logros y momentos inolvidables! Queremos brindar contigo, agradecer tu entrega y celebrar en grande todo lo que alcanzamos juntos.',
  logo_url TEXT DEFAULT '',
  primary_color TEXT NOT NULL DEFAULT '#E11D48',
  secondary_color TEXT NOT NULL DEFAULT '#F59E0B',
  whatsapp_template TEXT NOT NULL DEFAULT '¡Hola {nombre}! 🎉 Tienes una invitación muy especial para nuestra Fiesta de Fin de Año de {empresa}. Confirma tu asistencia y obtén tu pase digital aquí: {link}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Invitados
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined')),
  cedula TEXT,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_guests_status ON guests(status);
CREATE INDEX IF NOT EXISTS idx_guests_phone ON guests(phone);
CREATE INDEX IF NOT EXISTS idx_guests_cedula ON guests(cedula);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE event_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para las invitaciones
CREATE POLICY "Permitir lectura de configuración para todos" 
  ON event_config FOR SELECT USING (true);

CREATE POLICY "Permitir actualizar configuración para todos" 
  ON event_config FOR ALL USING (true);

CREATE POLICY "Permitir lectura de invitados para todos" 
  ON guests FOR SELECT USING (true);

CREATE POLICY "Permitir insertar y actualizar invitados para todos" 
  ON guests FOR ALL USING (true);

-- 4. Registro inicial por defecto si la tabla está vacía
INSERT INTO event_config (
  event_name,
  company_name,
  event_date,
  event_time,
  location_name,
  location_address,
  maps_url,
  dress_code,
  motivational_message,
  primary_color,
  secondary_color
) 
SELECT 
  'Gran Fiesta de Despedida & Celebración 2026',
  'Cream Helado',
  (CURRENT_DATE + INTERVAL '25 days'),
  '19:00:00',
  'Gran Salón de Eventos El Poblado',
  'Carrera 43A # 1Sur-188, Medellín, Antioquia',
  'https://maps.google.com/?q=Medellin+Colombia',
  'Elegante Casual / Toque Festivo Dorado',
  '¡Gracias por ser el corazón de nuestro equipo! Este año rompimos récords y superamos cada reto con pasión. Ha llegado el momento de dejar a un lado la rutina, bailar, reír y celebrar como la gran familia que somos.',
  '#E11D48',
  '#D97706'
WHERE NOT EXISTS (SELECT 1 FROM event_config LIMIT 1);
