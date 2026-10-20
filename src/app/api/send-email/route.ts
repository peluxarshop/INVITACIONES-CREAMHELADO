import { NextResponse } from 'next/server';
import { sendConfirmationEmail, sendInvitationEmail } from '@/lib/emailService';
import { Guest, EventConfig } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, guest, config, url } = body as {
      type: 'confirmation' | 'invitation';
      guest: Guest;
      config: EventConfig;
      url: string;
    };

    if (!guest || !config) {
      return NextResponse.json({ error: 'Faltan datos de invitado o configuración' }, { status: 400 });
    }

    let result;
    if (type === 'confirmation') {
      result = await sendConfirmationEmail(guest, config, url);
    } else {
      result = await sendInvitationEmail(guest, config, url);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error enviando correo' }, { status: 500 });
  }
}
