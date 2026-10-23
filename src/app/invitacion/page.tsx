import { Suspense } from 'react';
import { Metadata } from 'next';
import { InvitationClient } from './[id]/InvitationClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Invitación Especial - Fiesta de Fin de Año | Crem Helado',
  description: 'Celebra con nosotros este gran año. Confirma tu asistencia y obtén tu pase VIP.',
  icons: {
    icon: '/logo-cremhelado.png',
    shortcut: '/logo-cremhelado.png',
    apple: '/logo-cremhelado.png',
  },
  openGraph: {
    title: '🎉 Tienes una Invitación Especial | Crem Helado',
    description: 'Confirma tu asistencia y obtén tu pase digital VIP para la gran fiesta de empresa.',
    images: [
      {
        url: '/og-cremhelado.jpg',
        width: 1200,
        height: 630,
        alt: 'Invitación Especial Crem Helado',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🎉 Tienes una Invitación Especial | Crem Helado',
    description: 'Confirma tu asistencia y obtén tu pase digital VIP para la gran fiesta de empresa.',
    images: ['/og-cremhelado.jpg'],
  },
};

export default function GeneralInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fbfbfc] text-slate-800 flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 border-4 border-[#E30613] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-600 font-semibold text-sm">Cargando invitación...</p>
        </div>
      }
    >
      <InvitationClient isGeneralRegistration={true} />
    </Suspense>
  );
}
