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
    title: 'Invitación Especial - Fiesta de Fin de Año',
    description: 'Tienes una invitación muy especial para celebrar con nosotros. Confirma tu asistencia aquí.',
    openGraph: {
      title: '🎉 Tienes una Invitación Especial | Fiesta de Celebración',
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
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-amber-200/80 font-medium text-sm animate-pulse">
            Cargando invitación...
          </p>
        </div>
      }
    >
      <InvitationContent {...props} />
    </Suspense>
  );
}
