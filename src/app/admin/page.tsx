import { Suspense } from 'react';
import { Metadata } from 'next';
import { AdminClient } from './AdminClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Panel de Administración | Sistema de Invitaciones',
  description: 'Gestión de invitados, KPIs, confirmaciones y configuración de la fiesta de empresa.',
};

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fbfbfc] text-slate-800 flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 border-4 border-[#E30613] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-600 font-semibold text-sm">Cargando panel...</p>
        </div>
      }
    >
      <AdminClient />
    </Suspense>
  );
}
