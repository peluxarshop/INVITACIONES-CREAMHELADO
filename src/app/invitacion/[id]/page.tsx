import { Suspense } from 'react';
import { Metadata } from 'next';
import { InvitationClient } from './InvitationClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const ogImageUrl = 'https://meals.peluxar.com/og-cremhelado.jpg';
  const pageUrl = `https://meals.peluxar.com/invitacion/${resolvedParams.id}`;

  return {
    title: 'Invitación Especial - Fiesta de Fin de Año | Crem Helado',
    description: 'Tienes una invitación muy especial para celebrar con nosotros. Confirma tu asistencia aquí.',
    icons: {
      icon: '/logo-cremhelado.png',
      shortcut: '/logo-cremhelado.png',
      apple: '/logo-cremhelado.png',
    },
    openGraph: {
      title: '🎉 Tienes una Invitación Especial | Crem Helado',
      description: 'Confirma tu asistencia y obtén tu pase digital VIP para la gran fiesta de empresa.',
      url: pageUrl,
      siteName: 'Crem Helado Eventos',
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          type: 'image/jpeg',
          alt: 'Invitación Especial Crem Helado',
        },
      ],
      type: 'website',
      locale: 'es_CO',
    },
    twitter: {
      card: 'summary_large_image',
      title: '🎉 Tienes una Invitación Especial | Crem Helado',
      description: 'Confirma tu asistencia y obtén tu pase digital VIP para la gran fiesta de empresa.',
      images: [ogImageUrl],
    },
  };
}

async function InvitationContent({ params }: PageProps) {
  const resolvedParams = await params;
  return <InvitationClient guestId={resolvedParams.id} />;
}

export default function InvitationPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fbfbfc] text-slate-800 flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 border-4 border-[#E30613] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-600 font-semibold text-sm">
            Cargando invitación...
          </p>
        </div>
      }
    >
      <InvitationContent {...props} />
    </Suspense>
  );
}
