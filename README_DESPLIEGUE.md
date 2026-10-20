# Guía Rápida: Despliegue en Vercel (Gratis) y Conexión Supabase

**Sistema de Invitaciones para Fiesta de Fin de Año & Despedida**  
*Desarrollado con amor en Medellín .Co por Lenipseart Developer - Contacto: 320 804 8128 (WhatsApp)*

---

## 1. Conexión a Supabase (Base de Datos Gratuita)

El sistema ya funciona de manera autónoma con almacenamiento local persistente, pero para sincronizar la base de datos en la nube entre múltiples dispositivos y colaboradores:

1. Ve a [supabase.com](https://supabase.com) e inicia sesión con tu cuenta gratuita.
2. Crea un nuevo proyecto (ej. `invitaciones-creamhelado`). Selecciona la región más cercana (ej. `us-east-1` o `sa-east-1`).
3. En el menú lateral izquierdo de Supabase, entra a **SQL Editor**.
4. Abre el archivo `supabase/schema.sql` que dejamos creado en este proyecto, copia todo su contenido y pégalo en el editor de Supabase.
5. Haz clic en **Run** (Ejecutar). Esto creará las tablas `guests` y `event_config` con sus políticas de seguridad públicas.
6. Ve a **Project Settings** (el ícono de engranaje) -> **API**.
7. Copia:
   - **Project URL**
   - **anon / public key**
8. Crea o edita el archivo `.env.local` en tu proyecto (usando como guía `.env.example`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-publica-aqui
   NEXT_PUBLIC_APP_URL=https://tudominio.com
   ```

---

## 2. Despliegue en Vercel (100% Gratuito y sin Tarjeta de Crédito)

### Opción A: Desde GitHub (Recomendado)
1. Sube este proyecto a tu repositorio de GitHub (público o privado):
   ```bash
   git init
   git add .
   git commit -m "Sistema de Invitaciones Cream Helado v1.0"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```
2. Entra a [vercel.com](https://vercel.com) con tu cuenta gratuita.
3. Haz clic en **Add New...** -> **Project**.
4. Selecciona tu repositorio de GitHub y pulsa **Import**.
5. En la sección **Environment Variables**, agrega las mismas variables de Supabase:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (la URL de tu dominio)
6. Haz clic en **Deploy**. En menos de 2 minutos tu aplicación estará en vivo en la nube.

---

## 3. Conectar tu Dominio Personalizado en Vercel

1. En el panel de tu proyecto en Vercel, ve a **Settings** -> **Domains**.
2. Escribe tu dominio (ej. `fiesta.tudominio.com` o `tudominio.com`) y pulsa **Add**.
3. Vercel te mostrará los registros DNS exactos:
   - Si es un subdominio (ej: `invitaciones.tudominio.com`), agregas un registro **CNAME** apuntando a `cname.vercel-dns.com`.
   - Si es un dominio principal (ej: `tudominio.com`), agregas un registro **A** apuntando a `76.76.21.21`.
4. En cuestión de pocos minutos, Vercel genera el certificado SSL (candado verde HTTPS) de forma 100% gratuita y automática.

---

## 4. Uso del Sistema de Invitaciones

* **Panel de Administración (`/admin`):**  
  Visita `/admin` para ver los KPIs, subir la lista en CSV, editar el mensaje motivador, colores y disparar los mensajes de WhatsApp con 1 solo clic por cada empleado.
* **Invitación del Empleado (`/invitacion/[id]`):**  
  Al hacer clic en el botón de WhatsApp desde el admin, se abre la conversación con el link directo `/invitacion/[id]`.
* **Pase Digital:**  
  Cuando el empleado confirma que sí asistirá, se guarda su Cédula y se le genera su Pase VIP con Código QR para la entrada a la fiesta y rifas.
