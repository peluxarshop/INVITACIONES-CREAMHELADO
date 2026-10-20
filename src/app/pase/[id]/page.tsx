import { Suspense } from 'react';
import { Metadata } from 'next';
import { PaseClient } from './PaseClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: 'Verificación de Pase VIP | Crem Helado',
    description: 'Control de acceso y verificación de pase para la fiesta de despedida Crem Helado.',
  };
}

async function PaseContent({ params }: PageProps) {
  const resolvedParams = await params;
  return <PaseClient guestId={resolvedParams.id} />;
}

export default function PasePage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fbfbfc] text-slate-800 flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 border-4 border-[#E30613] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-600 font-semibold text-sm">
            Verificando pase de acceso...
          </p>
        </div>
      }
    >
      <PaseContent {...props} />
    </Suspense>
  );
}
