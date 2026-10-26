import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Cargar variables desde .env.local o .env
if (fs.existsSync(path.join(rootDir, '.env.local'))) {
  dotenv.config({ path: path.join(rootDir, '.env.local') });
} else {
  dotenv.config({ path: path.join(rootDir, '.env') });
}

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.SUPABASE_DB_URL;

console.log('\n======================================================');
console.log('🚀 CONFIGURACIÓN AUTOMÁTICA DE BASE DE DATOS SUPABASE');
console.log('======================================================\n');

if (!connectionString) {
  console.error('❌ ERROR: No se encontró la variable DATABASE_URL en tu archivo .env.local\n');
  console.log('👉 ¿Cómo obtenerla en 30 segundos en Supabase?');
  console.log('1. Entra a tu proyecto en https://supabase.com');
  console.log('2. Ve a: Project Settings (engranaje) -> Database');
  console.log('3. Baja a "Connection String" y selecciona "URI" (o Session / Transaction pooler)');
  console.log('4. Copia la URL (reemplaza [YOUR-PASSWORD] por la contraseña que le pusiste a tu base de datos)');
  console.log('5. Agrégala a tu archivo .env.local así:');
  console.log('\nDATABASE_URL=postgresql://postgres.xxx:tu_password@aws-0-sa-east-1.pooler.supabase.com:6543/postgres\n');
  console.log('6. Vuelve a ejecutar: npm run db:setup\n');
  process.exit(1);
}

const schemaPath = path.join(rootDir, 'supabase', 'schema.sql');
if (!fs.existsSync(schemaPath)) {
  console.error(`❌ No se encontró el archivo SQL en: ${schemaPath}`);
  process.exit(1);
}

const sql = fs.readFileSync(schemaPath, 'utf8');

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  try {
    console.log('📡 Conectando a Supabase PostgreSQL...');
    await client.connect();
    console.log('✅ Conexión establecida con éxito.\n');

    console.log('⚙️ Ejecutando script de creación de tablas e índices (schema.sql)...');
    await client.query(sql);
    await client.query("UPDATE event_config SET logo_url = '/logo-cremhelado.png' WHERE logo_url IS NULL OR logo_url = '' OR logo_url LIKE '%wikimedia%';");
    await client.query("ALTER TABLE event_config ADD COLUMN IF NOT EXISTS event_end_time TIME DEFAULT '18:00:00';");
    await client.query("UPDATE event_config SET event_time = '14:00:00', event_end_time = '18:00:00' WHERE event_time = '19:00:00';");
    console.log('✅ Tablas "event_config" y "guests" creadas exitosamente.');
    console.log('✅ Políticas de seguridad (RLS) habilitadas.');
    console.log('✅ Índices de búsqueda por teléfono, cédula y estado creados.');

    // Verificación rápida
    const resConfig = await client.query('SELECT count(*) FROM event_config;');
    const resGuests = await client.query('SELECT count(*) FROM guests;');
    console.log(`\n📊 Estado actual en Supabase:`);
    console.log(`   - Registros de configuración: ${resConfig.rows[0].count}`);
    console.log(`   - Invitados en la base de datos: ${resGuests.rows[0].count}`);

    console.log('\n🎉 ¡La base de datos en Supabase está 100% lista y vinculada!\n');
  } catch (error) {
    console.error('\n❌ Ocurrió un error ejecutando la migración:', error.message);
    if (error.message.includes('password authentication failed')) {
      console.error('👉 Tip: Verifica que la contraseña de la base de datos en DATABASE_URL sea la correcta.');
    }
  } finally {
    await client.end();
  }
}

run();
