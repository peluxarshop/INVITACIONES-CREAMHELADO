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
  return {
    title: 'Invitación Especial - Fiesta de Fin de Año | Crem Helado',
    description: 'Tienes una invitación muy especial para celebrar con nosotros. Confirma tu asistencia aquí.',
    openGraph: {
      title: '🎉 Tienes una Invitación Especial | Crem Helado',
      description: 'Confirma tu asistencia y obtén tu pase digital VIP para la gran fiesta de empresa.',
      type: 'website',
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
