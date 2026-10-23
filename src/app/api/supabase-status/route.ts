import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim();

  const diagnostics: Record<string, unknown> = {
    configured: isSupabaseConfigured,
    hasUrl: Boolean(url),
    urlSnippet: url ? `${url.substring(0, 20)}...` : null,
    hasAnonKey: Boolean(anonKey),
    keyLength: anonKey.length,
    keyPrefix: anonKey ? anonKey.substring(0, 10) : null,
  };

  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({
      status: 'error',
      message: 'Supabase no está configurado en las variables de entorno.',
      diagnostics,
    }, { status: 500 });
  }

  try {
    // 1. Probar tabla event_config
    const { data: configData, error: configError } = await supabase
      .from('event_config')
      .select('*')
      .limit(1);

    // 2. Probar tabla guests
    const { data: guestsData, error: guestsError, count: guestsCount } = await supabase
      .from('guests')
      .select('*', { count: 'exact' });

    if (configError || guestsError) {
      return NextResponse.json({
        status: 'supabase_error',
        message: 'Supabase respondió con error.',
        configError: configError ? {
          message: configError.message,
          hint: (configError as any).hint,
          details: configError.details,
          code: configError.code,
        } : null,
        guestsError: guestsError ? {
          message: guestsError.message,
          hint: (guestsError as any).hint,
          details: guestsError.details,
          code: guestsError.code,
        } : null,
        diagnostics,
      }, { status: 502 });
    }

    return NextResponse.json({
      status: 'connected',
      message: '¡Conexión exitosa con Supabase!',
      eventConfigRows: configData?.length || 0,
      guestsCount: guestsCount ?? guestsData?.length ?? 0,
      diagnostics,
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'exception',
      message: err.message,
      diagnostics,
    }, { status: 500 });
  }
}
