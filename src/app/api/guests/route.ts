import { NextResponse } from 'next/server';
import {
  serverGetGuests,
  serverAddGuest,
  serverUpdateFullGuest,
  serverDeleteGuest,
} from '@/lib/serverStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const guests = await serverGetGuests();
    return NextResponse.json({ success: true, guests });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guest, guests: guestList } = body;

    if (guestList && Array.isArray(guestList)) {
      const created = [];
      for (const item of guestList) {
        const c = await serverAddGuest(item);
        created.push(c);
      }
      return NextResponse.json({ success: true, guests: created });
    }

    if (!guest || !guest.fullName || !guest.phone) {
      return NextResponse.json({ success: false, error: 'Datos incompletos de invitado' }, { status: 400 });
    }

    const created = await serverAddGuest(guest);
    return NextResponse.json({ success: true, guest: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { guest } = body;

    if (!guest || !guest.id) {
      return NextResponse.json({ success: false, error: 'Falta el objeto guest con su id' }, { status: 400 });
    }

    const updated = await serverUpdateFullGuest(guest);
    return NextResponse.json({ success: true, guest: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Falta el parámetro id' }, { status: 400 });
    }

    await serverDeleteGuest(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
