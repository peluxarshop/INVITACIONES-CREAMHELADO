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
    // 1. Probar SELECT en event_config
    const { data: configData, error: configError } = await supabase
      .from('event_config')
      .select('*')
      .limit(1);

    // 2. Probar SELECT en guests
    const { data: guestsData, error: guestsError, count: guestsCount } = await supabase
      .from('guests')
      .select('*', { count: 'exact' });

    // 3. Probar INSERT en guests (para verificar permisos de escritura / RLS)
    const testGuest = {
      full_name: 'Test Diagnosis Conexión',
      first_name: 'Test',
      last_name: 'Diagnosis',
      phone: '573000000000',
      email: 'test@diagnostico.com',
      status: 'pending',
    };

    const { data: insertData, error: insertError } = await supabase
      .from('guests')
      .insert([testGuest])
      .select()
      .maybeSingle();

    let insertTestResult: Record<string, unknown> = {
      success: !insertError && Boolean(insertData),
    };

    if (insertError) {
      insertTestResult = {
        success: false,
        error: {
          message: insertError.message,
          code: insertError.code,
          details: insertError.details,
          hint: (insertError as any).hint,
        },
      };
    } else if (insertData?.id) {
      // Limpiar el registro de prueba creado
      await supabase.from('guests').delete().eq('id', insertData.id);
      insertTestResult = {
        success: true,
        message: 'Escritura y lectura permitidas en la tabla guests.',
      };
    }

    const hasAnyError = Boolean(configError || guestsError || insertError);

    return NextResponse.json({
      status: hasAnyError ? 'partial_error' : 'connected',
      message: hasAnyError ? 'Hay problemas con algunos permisos o tablas.' : '¡Conexión y permisos 100% operativos!',
      readConfig: {
        success: !configError,
        rows: configData?.length || 0,
        error: configError ? configError.message : null,
      },
      readGuests: {
        success: !guestsError,
        count: guestsCount ?? guestsData?.length ?? 0,
        error: guestsError ? guestsError.message : null,
      },
      writeGuests: insertTestResult,
      diagnostics,
    }, { status: hasAnyError ? 207 : 200 });
  } catch (err: any) {
    return NextResponse.json({
      status: 'exception',
      message: err.message,
      diagnostics,
    }, { status: 500 });
  }
}
