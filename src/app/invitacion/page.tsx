import { Suspense } from 'react';
import { Metadata } from 'next';
import { InvitationClient } from './[id]/InvitationClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Invitación a la Fiesta de Fin de Año',
  description: 'Celebra con nosotros este gran año. Confirma tu asistencia.',
};

export default function GeneralInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-amber-200/80 font-medium text-sm animate-pulse">
            Cargando...
          </p>
        </div>
      }
    >
      <InvitationClient guestId="invitado-general" />
    </Suspense>
  );
}
