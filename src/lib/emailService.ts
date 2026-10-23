import { Resend } from 'resend';
import { EventConfig, Guest } from '@/types';

function getResendClient(): Resend | null {
  const apiKey =
    process.env.RESEND_API_KEY ||
    process.env.RESEND_TOKEN ||
    process.env.AUTH_RESEND_KEY ||
    '';

  if (!apiKey || apiKey.includes('placeholder')) {
    return null;
  }
  return new Resend(apiKey);
}

function getFromEmail(): string {
  if (process.env.EMAIL_FROM && process.env.EMAIL_FROM.trim()) {
    return process.env.EMAIL_FROM.trim();
  }
  return 'Crem Helado Eventos <onboarding@resend.dev>';
}

function getLogoUrl(): string {
  // Siempre usamos la URL pública HTTPS de producción para que clientes como Gmail y Outlook carguen el logo
  return 'https://meals.peluxar.com/logo-cremhelado.png';
}

function normalizeUrlForEmail(url: string, fallbackPath: string): string {
  if (url && !url.includes('localhost') && !url.includes('127.0.0.1')) {
    return url;
  }
  return `https://meals.peluxar.com${fallbackPath}`;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

export async function sendConfirmationEmail(
  guest: Guest,
  config: EventConfig,
  passUrl: string
): Promise<SendEmailResult> {
  const logoUrl = getLogoUrl();
  const validPassUrl = normalizeUrlForEmail(passUrl, `/invitacion/${guest.id}`);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pase VIP Confirmado - ${config.eventName}</title>
        <style type="text/css">
          body, table, td, p, a, span, div, strong, b {
            font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif !important;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          strong, b {
            font-weight: 700 !important;
          }
        </style>
      </head>
      <body style="font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif; background-color: #faf8f5; margin: 0; padding: 24px; color: #1e293b; -webkit-font-smoothing: antialiased;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 28px; overflow: hidden; box-shadow: 0 12px 35px rgba(0,0,0,0.06); border: 1px solid #ebd9c8; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
          <!-- Franja superior festiva oro y rojo Crem Helado -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #E30613 0%, #D4AF37 50%, #005CA9 100%);"></td>
          </tr>

          <!-- Header con Logo Oficial -->
          <tr>
            <td style="background-color: #ffffff; padding: 32px 24px 20px 24px; text-align: center; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
              <img src="${logoUrl}" alt="${config.companyName}" width="170" style="display: block; margin: 0 auto 14px auto; max-width: 170px; height: auto;" />
              <div style="display: inline-block; background-color: #fef2f2; border: 1px solid #fecaca; padding: 4px 14px; border-radius: 20px;">
                <span style="color: #E30613; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                  Celebración &bull; Fin de Año 2026
                </span>
              </div>
              <h1 style="color: #0f172a; margin: 12px 0 0 0; font-size: 20px; font-weight: 800; letter-spacing: -0.3px; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                ${config.eventName}
              </h1>
            </td>
          </tr>

          <!-- Contenido Principal -->
          <tr>
            <td style="padding: 24px 32px 36px 32px; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
              <div style="background: linear-gradient(180deg, #ecfdf5 0%, #ffffff 100%); border: 1px solid #a7f3d0; border-radius: 20px; padding: 22px; text-align: center; margin-bottom: 24px;">
                <span style="font-size: 32px; display: block; margin-bottom: 6px;">🎉</span>
                <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #047857; display: block; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                  Pase VIP Autorizado & Confirmado
                </span>
                <h2 style="color: #065f46; margin: 6px 0 0 0; font-size: 22px; font-weight: 900; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                  ¡Todo Listo, ${guest.fullName}!
                </h2>
                <p style="color: #047857; font-size: 13px; margin: 6px 0 0 0; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                  Tu mesa y beneficios exclusivos están oficialmente reservados.
                </p>
              </div>

              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 22px; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                Nos alegra inmensamente contar con tu presencia para brindar por los logros alcanzados y dar la bienvenida al nuevo año como la gran familia que somos.
              </p>
              
              <!-- Tarjeta de Beneficios y Detalles -->
              <div style="background-color: #faf8f5; border: 1px solid #ebd9c8; border-radius: 20px; padding: 22px; margin: 24px 0;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                  <tr>
                    <td style="padding: 7px 0; font-size: 14px; color: #334155; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                      <span style="display: inline-block; width: 22px;">👤</span>
                      <span style="font-weight: 700; color: #1e293b;">Colaborador(a):</span>
                      <span style="color: #0f172a; margin-left: 6px;">${guest.fullName}</span>
                    </td>
                  </tr>
                  ${
                    guest.cedula
                      ? `
                  <tr>
                    <td style="padding: 7px 0; font-size: 14px; color: #334155; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                      <span style="display: inline-block; width: 22px;">🆔</span>
                      <span style="font-weight: 700; color: #1e293b;">Cédula / Identificación:</span>
                      <span style="background-color: #ffffff; padding: 2px 8px; border-radius: 6px; border: 1px solid #cbd5e1; font-family: 'Consolas', 'Courier New', monospace; font-weight: 700; color: #0f172a; margin-left: 6px;">${guest.cedula}</span>
                    </td>
                  </tr>`
                      : ''
                  }
                  ${
                    guest.area
                      ? `
                  <tr>
                    <td style="padding: 7px 0; font-size: 14px; color: #334155; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                      <span style="display: inline-block; width: 22px;">🏢</span>
                      <span style="font-weight: 700; color: #1e293b;">Área:</span>
                      <span style="background-color: #ecfdf5; padding: 2px 10px; border-radius: 6px; border: 1px solid #a7f3d0; font-weight: 700; color: #047857; margin-left: 6px; font-size: 13px;">${guest.area}</span>
                    </td>
                  </tr>`
                      : ''
                  }
                  <tr>
                    <td style="padding: 7px 0; font-size: 14px; color: #334155; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                      <span style="display: inline-block; width: 22px;">📅</span>
                      <span style="font-weight: 700; color: #1e293b;">Fecha:</span>
                      <span style="color: #0f172a; margin-left: 6px;">${config.eventDate} (Viernes)</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 7px 0; font-size: 14px; color: #334155; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                      <span style="display: inline-block; width: 22px;">⏰</span>
                      <span style="font-weight: 700; color: #1e293b;">Hora:</span>
                      <span style="color: #0f172a; margin-left: 6px;">${config.eventTime} hrs (7:00 PM)</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 7px 0; font-size: 14px; color: #334155; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                      <span style="display: inline-block; width: 22px;">📍</span>
                      <span style="font-weight: 700; color: #1e293b;">Salón:</span>
                      <span style="color: #0f172a; margin-left: 6px;">${config.locationName} (${config.locationAddress})</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 7px 0; font-size: 14px; color: #334155; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                      <span style="display: inline-block; width: 22px;">👔</span>
                      <span style="font-weight: 700; color: #1e293b;">Código de Vestimenta:</span>
                      <span style="color: #0f172a; margin-left: 6px;">${config.dressCode || 'Como mejor te sientas'}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 12px; margin-top: 6px; border-top: 1px dashed #cbd5e1; font-size: 13px; color: #005CA9; font-weight: 700; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                      ✨ Incluye: Cena de Gala + Estación de Helados + Boleta de Rifas
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Botón Principal -->
              <div style="text-align: center; margin: 32px 0 16px 0;">
                <a href="${validPassUrl}" style="background-color: #E30613; color: #ffffff; padding: 18px 38px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 6px 18px rgba(227, 6, 19, 0.28); letter-spacing: 0.3px; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                  Abrir Mi Pase Digital con Código QR
                </a>
              </div>
              <p style="text-align: center; color: #64748b; font-size: 12px; margin: 0 0 12px 0; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                💡 Presenta el código QR desde tu celular al llegar a la entrada para registrar tu ingreso.
              </p>
            </td>
          </tr>

          <!-- Footer con Firma de Marca Obligatoria -->
          <tr>
            <td style="background-color: #f8fafc; padding: 26px 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
              <p style="margin: 0 0 8px 0; font-weight: 700; color: #1e293b; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                ${config.companyName} &bull; Endulzando cada momento juntos
              </p>
              <p style="margin: 0; font-size: 11px; color: #64748b; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                Desarrollado con amor en Medellín .Co por <strong>Lenipseart Developer</strong> - Contacto: 320 804 8128 (WhatsApp)
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const resend = getResendClient();
  const fromEmail = getFromEmail();

  if (resend && guest.email) {
    try {
      const data = await resend.emails.send({
        from: fromEmail,
        to: guest.email,
        subject: `🎟️ Pase VIP Confirmado: ${config.eventName} - Crem Helado`,
        html: htmlContent,
      });

      if (data.error) {
        console.warn('Resend retornó un error:', data.error);
        let errorMsg = data.error.message;
        if (errorMsg.includes('testing emails to your own email address')) {
          errorMsg = 'Resend está en modo prueba inicial y solo permite enviar correos a la cuenta registrada (peluxarshop@gmail.com). Para enviar a cualquier colaborador, activa tu dominio en resend.com/domains.';
        }
        return { success: false, error: errorMsg };
      }

      return { success: true, messageId: data.data?.id };
    } catch (e: any) {
      console.warn('Error enviando correo vía Resend:', e);
      return { success: false, error: e.message };
    }
  }

  console.log(`[Simulación de Correo] Confirmación para ${guest.email} (${guest.fullName})`);
  return { success: true, simulated: true };
}

export async function sendInvitationEmail(
  guest: Guest,
  config: EventConfig,
  invitationUrl: string
): Promise<SendEmailResult> {
  const logoUrl = getLogoUrl();
  const validInvitationUrl = normalizeUrlForEmail(invitationUrl, `/invitacion/${guest.id}`);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Invitación Especial - ${config.eventName}</title>
        <style type="text/css">
          body, table, td, p, a, span, div, strong, b {
            font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif !important;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          strong, b {
            font-weight: 700 !important;
          }
        </style>
      </head>
      <body style="font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif; background-color: #faf8f5; margin: 0; padding: 24px; color: #1e293b; -webkit-font-smoothing: antialiased;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 28px; overflow: hidden; box-shadow: 0 12px 35px rgba(0,0,0,0.06); border: 1px solid #ebd9c8; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
          <!-- Franja superior festiva -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #E30613 0%, #D4AF37 50%, #005CA9 100%);"></td>
          </tr>

          <!-- Header con Logo Oficial y Franja Roja Crem Helado -->
          <tr>
            <td style="background-color: #ffffff; padding: 32px 24px 20px 24px; text-align: center; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
              <img src="${logoUrl}" alt="${config.companyName}" width="170" style="display: block; margin: 0 auto 14px auto; max-width: 170px; height: auto;" />
              <div style="display: inline-block; background-color: #fef2f2; border: 1px solid #fecaca; padding: 4px 14px; border-radius: 20px;">
                <span style="color: #E30613; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                  Invitación Especial &bull; Fin de Año 2026
                </span>
              </div>
              <h1 style="color: #0f172a; margin: 12px 0 0 0; font-size: 20px; font-weight: 800; letter-spacing: -0.3px; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                ${config.eventName}
              </h1>
            </td>
          </tr>

          <!-- Contenido Principal -->
          <tr>
            <td style="padding: 24px 32px 36px 32px; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
              <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 12px; font-size: 22px; font-weight: 900; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                ¡Hola, ${guest.fullName}! 🍨
              </h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 22px; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                ${config.motivationalMessage}
              </p>
              
              <!-- Tarjeta Resumen del Evento -->
              <div style="background-color: #faf8f5; border: 1px solid #ebd9c8; border-radius: 20px; padding: 22px; margin: 24px 0;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                  <tr>
                    <td style="padding: 7px 0; font-size: 14px; color: #334155; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                      <span style="display: inline-block; width: 22px;">📅</span>
                      <span style="font-weight: 700; color: #1e293b;">Fecha:</span>
                      <span style="color: #0f172a; margin-left: 6px;">${config.eventDate} (Viernes)</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 7px 0; font-size: 14px; color: #334155; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                      <span style="display: inline-block; width: 22px;">⏰</span>
                      <span style="font-weight: 700; color: #1e293b;">Hora:</span>
                      <span style="color: #0f172a; margin-left: 6px;">${config.eventTime} hrs (7:00 PM)</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 7px 0; font-size: 14px; color: #334155; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                      <span style="display: inline-block; width: 22px;">📍</span>
                      <span style="font-weight: 700; color: #1e293b;">Lugar:</span>
                      <span style="color: #0f172a; margin-left: 6px;">${config.locationName} (${config.locationAddress})</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 7px 0; font-size: 14px; color: #334155; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                      <span style="display: inline-block; width: 22px;">👔</span>
                      <span style="font-weight: 700; color: #1e293b;">Código de Vestimenta:</span>
                      <span style="color: #0f172a; margin-left: 6px;">${config.dressCode || 'Como mejor te sientas'}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 12px; margin-top: 6px; border-top: 1px dashed #cbd5e1; font-size: 13px; color: #005CA9; font-weight: 700; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                      ✨ Cóctel de bienvenida, Cena de gala, Estación de helados y Rifas
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Botón Principal -->
              <div style="text-align: center; margin: 34px 0 16px 0;">
                <a href="${validInvitationUrl}" style="background-color: #E30613; color: #ffffff; padding: 18px 38px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 6px 18px rgba(227, 6, 19, 0.28); letter-spacing: 0.3px; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                  Confirmar Asistencia & Obtener Pase VIP
                </a>
              </div>
              <p style="text-align: center; color: #64748b; font-size: 12px; margin: 0; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                Por favor confirma con anticipación para asegurar tu cupo y beneficios.
              </p>
            </td>
          </tr>

          <!-- Footer con Firma de Marca Obligatoria -->
          <tr>
            <td style="background-color: #f8fafc; padding: 26px 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
              <p style="margin: 0 0 8px 0; font-weight: 700; color: #1e293b; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                ${config.companyName} &bull; La Gran Familia
              </p>
              <p style="margin: 0; font-size: 11px; color: #64748b; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                Desarrollado con amor en Medellín .Co por <strong>Lenipseart Developer</strong> - Contacto: 320 804 8128 (WhatsApp)
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const resend = getResendClient();
  const fromEmail = getFromEmail();

  if (resend && guest.email) {
    try {
      const data = await resend.emails.send({
        from: fromEmail,
        to: guest.email,
        subject: `🎉 Invitación Especial: ${config.eventName} - Crem Helado`,
        html: htmlContent,
      });

      if (data.error) {
        console.warn('Resend retornó un error:', data.error);
        let errorMsg = data.error.message;
        if (errorMsg.includes('testing emails to your own email address')) {
          errorMsg = 'Resend está en modo prueba inicial y solo permite enviar correos a la cuenta registrada (peluxarshop@gmail.com). Para enviar a cualquier colaborador, activa tu dominio en resend.com/domains.';
        }
        return { success: false, error: errorMsg };
      }

      return { success: true, messageId: data.data?.id };
    } catch (e: any) {
      console.warn('Error enviando correo de invitación:', e);
      return { success: false, error: e.message };
    }
  }

  console.log(`[Simulación de Correo] Invitación para ${guest.email} (${guest.fullName})`);
  return { success: true, simulated: true };
}
