-- ==============================================================
-- SCRIPT DEFINITIVO DE CORRECCIÓN Y ACTUALIZACIÓN SUPABASE
-- Pega y ejecuta esto en: Supabase Dashboard -> SQL Editor
-- ==============================================================

-- 1. AGREGAR COLUMNAS FALTANTES EN 'guests' (incluyendo 'area' que causó el error)
ALTER TABLE guests ADD COLUMN IF NOT EXISTS area TEXT;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS cedula TEXT;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. PERMITIR IDS DE TEXTO Y CORREO ELECTRÓNICO OPCIONAL (permite NULL)
ALTER TABLE guests ALTER COLUMN id TYPE TEXT;
ALTER TABLE guests ALTER COLUMN email DROP NOT NULL;

-- 3. AGREGAR COLUMNAS DE MÚSICA EN 'event_config'
ALTER TABLE event_config ADD COLUMN IF NOT EXISTS music_enabled BOOLEAN DEFAULT true;
ALTER TABLE event_config ADD COLUMN IF NOT EXISTS music_url TEXT DEFAULT '/audio/navidad-suave.mp3';

-- 4. POLÍTICAS DE ACCESO COMPLETO (Lectura, Inserción, Actualización y Eliminación)
ALTER TABLE event_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir todo para guests" ON guests;
DROP POLICY IF EXISTS "Permitir lectura de invitados para todos" ON guests;
DROP POLICY IF EXISTS "Permitir insertar y actualizar invitados para todos" ON guests;
CREATE POLICY "Permitir todo para guests" ON guests FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo para event_config" ON event_config;
DROP POLICY IF EXISTS "Permitir lectura de configuración para todos" ON event_config;
DROP POLICY IF EXISTS "Permitir actualizar configuración para todos" ON event_config;
CREATE POLICY "Permitir todo para event_config" ON event_config FOR ALL USING (true) WITH CHECK (true);

-- 5. RECARGAR LA MEMORIA CACHÉ DE ESQUEMAS EN SUPABASE
NOTIFY pgrst, 'reload schema';

-- 6. VERIFICAR QUE LAS COLUMNAS EXISTAN CORRECTAMENTE
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'guests';
