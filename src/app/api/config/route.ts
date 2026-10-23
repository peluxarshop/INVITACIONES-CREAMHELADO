import { NextResponse } from 'next/server';
import { serverGetEventConfig, serverSaveEventConfig } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = await serverGetEventConfig();
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { config } = body;

    if (!config || !config.eventName) {
      return NextResponse.json({ success: false, error: 'Configuración inválida' }, { status: 400 });
    }

    const saved = await serverSaveEventConfig(config);
    return NextResponse.json({ success: true, config: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}
