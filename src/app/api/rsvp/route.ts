import { NextResponse } from 'next/server';
import { serverUpdateGuestRsvp, serverGetGuestById } from '@/lib/serverStore';
import { GuestStatus } from '@/types';
import { isGenericGuestName } from '@/lib/guestValidation';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, status, fullName, cedula, email, area, notes } = body as {
      id: string;
      status: GuestStatus;
      fullName?: string;
      cedula?: string;
      email?: string;
      area?: string;
      notes?: string;
    };

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Faltan parámetros requeridos (id, status)' }, { status: 400 });
    }

    if (fullName && isGenericGuestName(fullName)) {
      return NextResponse.json(
        { success: false, error: 'Por favor ingresa tu Nombre y Apellido real completo' },
        { status: 400 }
      );
    }

    const updated = await serverUpdateGuestRsvp(id, status, {
      fullName,
      cedula,
      email,
      area,
      notes,
    });

    return NextResponse.json({ success: true, guest: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Parámetro id requerido' }, { status: 400 });
    }

    const guest = await serverGetGuestById(id);
    return NextResponse.json({ success: true, guest });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
