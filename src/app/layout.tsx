import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import './globals.css';

config.autoAddCss = false;

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Gran Fiesta de Fin de Año | Crem Helado',
  description: 'Sistema oficial de invitaciones y pases VIP para la fiesta de despedida de empresa.',
  openGraph: {
    title: '🎉 Tienes una Invitación Especial | Crem Helado',
    description: 'Confirma tu asistencia y descarga tu Pase Digital VIP para la celebración.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fbfbfc] text-slate-800 font-sans">
        {children}
      </body>
    </html>
  );
}
