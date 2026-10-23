-- ==============================================================
-- SCRIPT DE CORRECCIÓN Y SINCRONIZACIÓN SUPABASE
-- Ejecuta este script completo en: Supabase Dashboard -> SQL Editor
-- ==============================================================

-- 1. Asegurar que la columna ID de invitados acepte texto (para códigos como inv-juan-perez-101)
ALTER TABLE guests ALTER COLUMN id TYPE TEXT;

-- 2. Habilitar Row Level Security (RLS) y permitir lectura/escritura pública
ALTER TABLE event_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas anteriores para evitar conflictos
DROP POLICY IF EXISTS "Permitir lectura de configuración para todos" ON event_config;
DROP POLICY IF EXISTS "Permitir actualizar configuración para todos" ON event_config;
DROP POLICY IF EXISTS "Permitir todo para event_config" ON event_config;
CREATE POLICY "Permitir todo para event_config" ON event_config FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir lectura de invitados para todos" ON guests;
DROP POLICY IF EXISTS "Permitir insertar y actualizar invitados para todos" ON guests;
DROP POLICY IF EXISTS "Permitir todo para guests" ON guests;
CREATE POLICY "Permitir todo para guests" ON guests FOR ALL USING (true) WITH CHECK (true);

-- 3. Actualizar la configuración del evento con los datos oficiales de Crem Helado
UPDATE event_config
SET 
  event_name = 'Gran Fiesta de Fin de Año & Despedida 2026',
  company_name = 'Crem Helado',
  event_date = '2026-12-18',
  event_time = '19:00:00',
  location_name = 'Gran Salon de Eventos El Poblado',
  location_address = 'Carrera 43A # 1Sur-188, Medellín, Antioquia',
  maps_url = 'https://maps.google.com/?q=El+Poblado+Medellin+Colombia',
  dress_code = 'Como mejor te sientas',
  motivational_message = '¡Gracias por endulzar y transformar cada día con tu esfuerzo y alegría! Este año logramos metas increíbles en cada rincón del país. Ha llegado el momento de celebrar juntos, brindar por nuestros éxitos y vivir una noche mágica.',
  logo_url = '/logo-cremhelado.png',
  primary_color = '#E30613',
  whatsapp_template = '¡Hola {nombre}! 🎉 Tienes una invitación muy especial para nuestra Gran Fiesta de Fin de Año de {empresa}. Confirma tu asistencia y obtén tu pase digital aquí: {link}',
  updated_at = NOW();

-- 4. Insertar los 6 invitados oficiales en la base de datos Supabase
INSERT INTO guests (id, full_name, first_name, last_name, phone, email, status, cedula, area, confirmed_at, notes, created_at)
VALUES
  ('inv-juan-gonzalez-1015469936', 'Juan Gonzalez', 'Juan', NULL, '573000000000', 'c-espinel@hotmail.com', 'confirmed', '1015469936', 'Logística', '2026-10-23T03:56:05.447Z', NULL, '2026-10-23T03:56:05.447Z'),
  ('inv-juan-perez-101', 'Juan David Pérez Gómez', 'Juan David', 'Pérez Gómez', '573001234567', 'juan.perez@cremhelado.com.co', 'confirmed', '1020456789', 'Logística', '2026-10-18T15:30:00Z', NULL, '2026-10-15T10:00:00Z'),
  ('inv-maria-gomez-102', 'María Camila Gómez', 'María Camila', 'Gómez', '573109876543', 'maria.gomez@cremhelado.com.co', 'pending', NULL, 'Comercial', NULL, NULL, '2026-10-15T10:00:00Z'),
  ('inv-carlos-rodriguez-103', 'Carlos Andrés Rodríguez', 'Carlos Andrés', 'Rodríguez', '573155554433', 'carlos.rodriguez@cremhelado.com.co', 'declined', NULL, 'Mantenimiento', '2026-10-19T09:15:00Z', 'Compromiso familiar fuera de la ciudad', '2026-10-15T10:00:00Z'),
  ('inv-ana-zapata-104', 'Ana Sofía Zapata', 'Ana Sofía', 'Zapata', '573208048128', 'ana.zapata@cremhelado.com.co', 'pending', NULL, 'Administración', NULL, NULL, '2026-10-15T10:00:00Z'),
  ('inv-santiago-londono-105', 'Santiago Londoño Castro', 'Santiago', 'Londoño Castro', '573017778899', 'santiago.londono@cremhelado.com.co', 'confirmed', '1037654321', 'Comercial', '2026-10-20T08:45:00Z', NULL, '2026-10-15T10:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  status = EXCLUDED.status,
  cedula = EXCLUDED.cedula,
  area = EXCLUDED.area,
  confirmed_at = EXCLUDED.confirmed_at,
  notes = EXCLUDED.notes;

-- 5. Verificar que todo quedó cargado correctamente
SELECT 'event_config' AS tabla, count(*) AS total_registros FROM event_config
UNION ALL
SELECT 'guests' AS tabla, count(*) AS total_registros FROM guests;
