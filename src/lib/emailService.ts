import { Resend } from 'resend';
import { EventConfig, Guest } from '@/types';

const resendApiKey = process.env.RESEND_API_KEY || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.EMAIL_FROM || 'Crem Helado Eventos <onboarding@resend.dev>';

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
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Pase VIP Confirmado - ${config.eventName}</title>
      </head>
      <body style="font-family: Arial, Helvetica, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
          <tr>
            <td style="background-color: #E30613; padding: 32px 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">${config.companyName}</h1>
              <p style="color: #fee2e2; margin: 6px 0 0 0; font-size: 14px;">${config.eventName}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 28px;">
              <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">¡Hola, ${guest.fullName}! 🎉</h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                Nos alegra inmensamente confirmar tu asistencia a nuestra celebración de fin de año. ¡Tu lugar está asegurado!
              </p>
              
              <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 14px; padding: 20px; margin: 24px 0;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #9f1239;"><strong>Identificación (Cédula):</strong> ${guest.cedula || 'Registrada'}</p>
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #9f1239;"><strong>Fecha:</strong> ${config.eventDate}</p>
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #9f1239;"><strong>Hora:</strong> ${config.eventTime} hrs</p>
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #9f1239;"><strong>Lugar:</strong> ${config.locationName} (${config.locationAddress})</p>
                <p style="margin: 0; font-size: 14px; color: #9f1239;"><strong>Dress Code:</strong> ${config.dressCode}</p>
              </div>

              <div style="text-align: center; margin: 32px 0 16px 0;">
                <a href="${passUrl}" style="background-color: #E30613; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 15px; display: inline-block;">
                  Ver mi Pase Digital con Código QR
                </a>
              </div>
              <p style="text-align: center; color: #64748b; font-size: 12px;">
                Presenta el código QR en la entrada para tu registro y participación en rifas.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
              Desarrollado con amor en Medellín .Co por Lenipseart Developer - Contacto: 320 804 8128
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  if (resend && guest.email) {
    try {
      const data = await resend.emails.send({
        from: fromEmail,
        to: guest.email,
        subject: `¡Asistencia Confirmada! Tu Pase VIP - ${config.eventName}`,
        html: htmlContent,
      });
      return { success: true, messageId: data.data?.id };
    } catch (e: any) {
      console.warn('Error enviando correo vía Resend:', e);
      return { success: false, error: e.message };
    }
  }

  // Modo simulación si aún no hay clave de Resend configurada
  console.log(`[Simulación de Correo] Confirmación enviada a ${guest.email} para ${guest.fullName}`);
  return { success: true, simulated: true };
}

export async function sendInvitationEmail(
  guest: Guest,
  config: EventConfig,
  invitationUrl: string
): Promise<SendEmailResult> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Invitación Especial - ${config.eventName}</title>
      </head>
      <body style="font-family: Arial, Helvetica, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
          <tr>
            <td style="background-color: #E30613; padding: 32px 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">${config.companyName}</h1>
              <p style="color: #fee2e2; margin: 6px 0 0 0; font-size: 14px;">${config.eventName}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 28px;">
              <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">¡Hola, ${guest.fullName}! 🍦</h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                ${config.motivationalMessage}
              </p>
              
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #334155;">📅 <strong>Fecha:</strong> ${config.eventDate}</p>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #334155;">⏰ <strong>Hora:</strong> ${config.eventTime} hrs</p>
                <p style="margin: 0; font-size: 14px; color: #334155;">📍 <strong>Lugar:</strong> ${config.locationName}</p>
              </div>

              <div style="text-align: center; margin: 32px 0 16px 0;">
                <a href="${invitationUrl}" style="background-color: #E30613; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 15px; display: inline-block;">
                  Ver mi Invitación y Confirmar Asistencia
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
              Desarrollado con amor en Medellín .Co por Lenipseart Developer - Contacto: 320 804 8128
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  if (resend && guest.email) {
    try {
      const data = await resend.emails.send({
        from: fromEmail,
        to: guest.email,
        subject: `🎉 Invitación Especial: ${config.eventName} - ${config.companyName}`,
        html: htmlContent,
      });
      return { success: true, messageId: data.data?.id };
    } catch (e: any) {
      console.warn('Error enviando correo de invitación:', e);
      return { success: false, error: e.message };
    }
  }

  console.log(`[Simulación de Correo] Invitación enviada a ${guest.email} para ${guest.fullName}`);
  return { success: true, simulated: true };
}
