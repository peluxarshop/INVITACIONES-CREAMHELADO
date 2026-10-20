import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const expectedUser = process.env.ADMIN_USERNAME || 'admin';
    const expectedPass = process.env.ADMIN_PASSWORD || 'cremhelado2026';

    if (username === expectedUser && password === expectedPass) {
      // Retornar token de sesión simple
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json({ success: false, error: 'Usuario o contraseña incorrectos' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: 'Error procesando autenticación' }, { status: 500 });
  }
}
