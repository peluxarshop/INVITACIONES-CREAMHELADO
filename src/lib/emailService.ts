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
  return 'https://meals.peluxar.com/logo-cremhelado.png';
}

function normalizeUrlForEmail(url: string, fallbackPath: string): string {
  if (url && !url.includes('localhost') && !url.includes('127.0.0.1')) {
    return url;
  }
  return `https://meals.peluxar.com${fallbackPath}`;
}

function formatEmailDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(Date.UTC(year, month, day, 12, 0, 0));
      const formatted = d.toLocaleDateString('es-CO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }
  } catch {}
  return dateStr;
}

function formatEmailTime(timeStr?: string): string {
  if (!timeStr) return '';
  const clean = timeStr.trim().slice(0, 5);
  const [hStr, mStr] = clean.split(':');
  const h = parseInt(hStr, 10);
  if (isNaN(h)) return clean;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${clean} hrs (${h12}:${mStr || '00'} ${ampm})`;
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
  const validPassUrl = normalizeUrlForEmail(passUrl, `/pase/${guest.id}`);

  const formattedDate = formatEmailDate(config.eventDate);
  const formattedTime = formatEmailTime(config.eventTime);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pase Digital Confirmado - ${config.eventName}</title>
        <style type="text/css">
          body, table, td, p, a, span, div, strong, b {
            font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif !important;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          @media only screen and (max-width: 600px) {
            body {
              padding: 0 !important;
              margin: 0 !important;
            }
            .email-outer-table {
              padding: 0 !important;
            }
            .email-container {
              width: 100% !important;
              border-radius: 0 !important;
              border-left: none !important;
              border-right: none !important;
            }
            .email-content-td {
              padding: 20px 16px 28px 16px !important;
            }
            .email-card {
              padding: 16px 14px !important;
              margin: 16px 0 !important;
              border-radius: 16px !important;
            }
            .email-cta-btn {
              display: block !important;
              width: 100% !important;
              box-sizing: border-box !important;
              padding: 16px 14px !important;
              font-size: 15px !important;
            }
          }
        </style>
      </head>
      <body style="font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif; background-color: #faf8f5; margin: 0; padding: 12px 6px; color: #1e293b; -webkit-font-smoothing: antialiased;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-outer-table" style="font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
          <tr>
            <td align="center">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 580px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #ebd9c8; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                <!-- Franja superior festiva -->
                <tr>
                  <td style="height: 6px; background: linear-gradient(90deg, #E30613 0%, #D4AF37 50%, #005CA9 100%);"></td>
                </tr>

                <!-- Header con Logo Oficial -->
                <tr>
                  <td style="background-color: #ffffff; padding: 28px 20px 16px 20px; text-align: center;">
                    <img src="${logoUrl}" alt="${config.companyName}" width="160" style="display: block; margin: 0 auto 12px auto; max-width: 160px; height: auto;" />
                    <div style="display: inline-block; background-color: #fef2f2; border: 1px solid #fecaca; padding: 4px 14px; border-radius: 20px;">
                      <span style="color: #E30613; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                        Celebración &bull; Fin de Año 2026
                      </span>
                    </div>
                    <h1 style="color: #0f172a; margin: 10px 0 0 0; font-size: 20px; font-weight: 800; letter-spacing: -0.3px;">
                      ${config.eventName}
                    </h1>
                  </td>
                </tr>

                <!-- Contenido Principal -->
                <tr>
                  <td class="email-content-td" style="padding: 20px 24px 32px 24px;">
                    <!-- Badge de Pase Confirmado -->
                    <div style="background: linear-gradient(180deg, #ecfdf5 0%, #ffffff 100%); border: 1px solid #a7f3d0; border-radius: 18px; padding: 18px 16px; text-align: center; margin-bottom: 20px;">
                      <span style="font-size: 28px; display: block; margin-bottom: 4px;">🎉</span>
                      <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #047857; display: block;">
                        Pase Digital Autorizado & Confirmado
                      </span>
                      <h2 style="color: #065f46; margin: 4px 0 0 0; font-size: 20px; font-weight: 900;">
                        ¡Todo Listo, ${guest.fullName}!
                      </h2>
                      <p style="color: #047857; font-size: 13px; margin: 4px 0 0 0;">
                        Tu cupo de asistencia está oficialmente confirmado.
                      </p>
                    </div>

                    <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-top: 0; margin-bottom: 20px;">
                      Nos alegra inmensamente contar con tu presencia para brindar por los logros alcanzados y celebrar juntos como la gran familia que somos.
                    </p>
                    
                    <!-- Tarjeta de Detalles del Evento (Estructurada y legible) -->
                    <div class="email-card" style="background-color: #faf8f5; border: 1px solid #ebd9c8; border-radius: 18px; padding: 20px 18px; margin: 20px 0;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <!-- Colaborador / Identificación -->
                        <tr>
                          <td style="padding-bottom: 12px; border-bottom: 1px dashed #e2d4c4;">
                            <div style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                              👤 Colaborador(a) Invitado(a)
                            </div>
                            <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 2px;">
                              ${guest.fullName}
                            </div>
                            ${guest.cedula || guest.area ? `
                              <div style="margin-top: 5px; font-size: 12px; color: #475569;">
                                ${guest.cedula ? `<span style="font-weight: 700; color: #334155;">C.C. / Doc:</span> <span style="font-family: monospace; font-weight: 700; background: #ffffff; padding: 2px 7px; border: 1px solid #cbd5e1; border-radius: 5px; color: #0f172a;">${guest.cedula}</span>` : ''}
                                ${guest.cedula && guest.area ? ` &bull; ` : ''}
                                ${guest.area ? `<span style="font-weight: 700; color: #047857; background: #ecfdf5; padding: 2px 9px; border: 1px solid #a7f3d0; border-radius: 5px;">${guest.area}</span>` : ''}
                              </div>
                            ` : ''}
                          </td>
                        </tr>

                        <!-- Fecha y Hora -->
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px dashed #e2d4c4;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td width="55%" style="vertical-align: top; padding-right: 8px;">
                                  <div style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                                    📅 Fecha
                                  </div>
                                  <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 2px;">
                                    ${formattedDate}
                                  </div>
                                </td>
                                <td width="45%" style="vertical-align: top;">
                                  <div style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                                    ⏰ Hora
                                  </div>
                                  <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 2px;">
                                    ${formattedTime}
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                        <!-- Salón y Dirección -->
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px dashed #e2d4c4;">
                            <div style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                              📍 Lugar del Evento
                            </div>
                            <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin-top: 2px;">
                              ${config.locationName}
                            </div>
                            <div style="font-size: 13px; color: #475569; margin-top: 2px;">
                              ${config.locationAddress}
                            </div>
                            ${config.mapsUrl ? `
                              <div style="margin-top: 6px;">
                                <a href="${config.mapsUrl}" target="_blank" style="font-size: 12px; font-weight: 700; color: #047857; text-decoration: underline;">
                                  Ver ubicación en Google Maps &rarr;
                                </a>
                              </div>
                            ` : ''}
                          </td>
                        </tr>

                        <!-- Código de Vestimenta -->
                        <tr>
                          <td style="padding-top: 12px;">
                            <div style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                              👔 Código de Vestimenta
                            </div>
                            <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 2px;">
                              ${config.dressCode || 'Como mejor te sientas'}
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <!-- Botón Principal -->
                    <div style="text-align: center; margin: 28px 0 14px 0;">
                      <a href="${validPassUrl}" class="email-cta-btn" style="background-color: #E30613; color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 14px; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 4px 14px rgba(227, 6, 19, 0.28); letter-spacing: 0.3px;">
                        Abrir Mi Pase Digital con Código QR
                      </a>
                    </div>
                    <p style="text-align: center; color: #64748b; font-size: 12px; margin: 0 0 10px 0;">
                      💡 Presenta el código QR desde tu celular al llegar a la entrada para registrar tu ingreso.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 22px 18px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 6px 0; font-weight: 700; color: #1e293b;">
                      ${config.companyName} &bull; Endulzando cada momento juntos
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #64748b;">
                      Desarrollado con amor en Medellín .Co por <strong>Lenipseart Developer</strong> - Contacto: 320 804 8128 (WhatsApp)
                    </p>
                  </td>
                </tr>
              </table>
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
        subject: `🎟️ Pase Digital Confirmado: ${config.eventName} - Crem Helado`,
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

  const formattedDate = formatEmailDate(config.eventDate);
  const formattedTime = formatEmailTime(config.eventTime);

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
          @media only screen and (max-width: 600px) {
            body {
              padding: 0 !important;
              margin: 0 !important;
            }
            .email-outer-table {
              padding: 0 !important;
            }
            .email-container {
              width: 100% !important;
              border-radius: 0 !important;
              border-left: none !important;
              border-right: none !important;
            }
            .email-content-td {
              padding: 20px 16px 28px 16px !important;
            }
            .email-card {
              padding: 16px 14px !important;
              margin: 16px 0 !important;
              border-radius: 16px !important;
            }
            .email-cta-btn {
              display: block !important;
              width: 100% !important;
              box-sizing: border-box !important;
              padding: 16px 14px !important;
              font-size: 15px !important;
            }
          }
        </style>
      </head>
      <body style="font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif; background-color: #faf8f5; margin: 0; padding: 12px 6px; color: #1e293b; -webkit-font-smoothing: antialiased;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-outer-table" style="font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
          <tr>
            <td align="center">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 580px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #ebd9c8; font-family: 'Segoe UI', Arial, Roboto, -apple-system, sans-serif;">
                <!-- Franja superior festiva -->
                <tr>
                  <td style="height: 6px; background: linear-gradient(90deg, #E30613 0%, #D4AF37 50%, #005CA9 100%);"></td>
                </tr>

                <!-- Header con Logo Oficial y Franja Roja Crem Helado -->
                <tr>
                  <td style="background-color: #ffffff; padding: 28px 20px 16px 20px; text-align: center;">
                    <img src="${logoUrl}" alt="${config.companyName}" width="160" style="display: block; margin: 0 auto 12px auto; max-width: 160px; height: auto;" />
                    <div style="display: inline-block; background-color: #fef2f2; border: 1px solid #fecaca; padding: 4px 14px; border-radius: 20px;">
                      <span style="color: #E30613; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                        Invitación Especial &bull; Fin de Año 2026
                      </span>
                    </div>
                    <h1 style="color: #0f172a; margin: 10px 0 0 0; font-size: 20px; font-weight: 800; letter-spacing: -0.3px;">
                      ${config.eventName}
                    </h1>
                  </td>
                </tr>

                <!-- Contenido Principal -->
                <tr>
                  <td class="email-content-td" style="padding: 20px 24px 32px 24px;">
                    <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 10px; font-size: 21px; font-weight: 900;">
                      ¡Hola, ${guest.fullName}! 🍨
                    </h2>
                    <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-top: 0; margin-bottom: 20px;">
                      ${config.motivationalMessage}
                    </p>
                    
                    <!-- Tarjeta Resumen del Evento -->
                    <div class="email-card" style="background-color: #faf8f5; border: 1px solid #ebd9c8; border-radius: 18px; padding: 20px 18px; margin: 20px 0;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <!-- Fecha y Hora -->
                        <tr>
                          <td style="padding-bottom: 12px; border-bottom: 1px dashed #e2d4c4;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td width="55%" style="vertical-align: top; padding-right: 8px;">
                                  <div style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                                    📅 Fecha
                                  </div>
                                  <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 2px;">
                                    ${formattedDate}
                                  </div>
                                </td>
                                <td width="45%" style="vertical-align: top;">
                                  <div style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                                    ⏰ Hora
                                  </div>
                                  <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 2px;">
                                    ${formattedTime}
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                        <!-- Lugar / Salón -->
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px dashed #e2d4c4;">
                            <div style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                              📍 Lugar del Evento
                            </div>
                            <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin-top: 2px;">
                              ${config.locationName}
                            </div>
                            <div style="font-size: 13px; color: #475569; margin-top: 2px;">
                              ${config.locationAddress}
                            </div>
                            ${config.mapsUrl ? `
                              <div style="margin-top: 6px;">
                                <a href="${config.mapsUrl}" target="_blank" style="font-size: 12px; font-weight: 700; color: #047857; text-decoration: underline;">
                                  Ver ubicación en Google Maps &rarr;
                                </a>
                              </div>
                            ` : ''}
                          </td>
                        </tr>

                        <!-- Código de Vestimenta -->
                        <tr>
                          <td style="padding-top: 12px;">
                            <div style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                              👔 Código de Vestimenta
                            </div>
                            <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 2px;">
                              ${config.dressCode || 'Como mejor te sientas'}
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <!-- Botón Principal -->
                    <div style="text-align: center; margin: 28px 0 14px 0;">
                      <a href="${validInvitationUrl}" class="email-cta-btn" style="background-color: #E30613; color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 14px; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 4px 14px rgba(227, 6, 19, 0.28); letter-spacing: 0.3px;">
                        Confirmar Mi Asistencia Aquí
                      </a>
                    </div>
                    <p style="text-align: center; color: #64748b; font-size: 12px; margin: 0;">
                      Por favor confirma con anticipación para asegurar tu cupo de ingreso.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 22px 18px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 6px 0; font-weight: 700; color: #1e293b;">
                      ${config.companyName} &bull; La Gran Familia
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #64748b;">
                      Desarrollado con amor en Medellín .Co por <strong>Lenipseart Developer</strong> - Contacto: 320 804 8128 (WhatsApp)
                    </p>
                  </td>
                </tr>
              </table>
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
