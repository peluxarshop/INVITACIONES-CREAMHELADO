import type { Metadata } from 'next';
import { Geist, Geist_Mono, Lilita_One } from 'next/font/google';
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

// Tipografía display redondeada y gruesa, inspirada en el lettering "SUEÑO DE NAVIDAD"
const lilitaOne = Lilita_One({
  variable: '--font-lilita',
  weight: '400',
  subsets: ['latin'],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://meals.peluxar.com';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'Gran Fiesta de Fin de Año & Celebración 2026 | Crem Helado',
  description: 'Sistema oficial de invitaciones y pases VIP para la fiesta de despedida de empresa Crem Helado.',
  icons: {
    icon: [
      { url: '/logo-cremhelado.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/logo-cremhelado.png',
    apple: '/logo-cremhelado.png',
  },
  openGraph: {
    title: '🎉 Tienes una Invitación Especial | Crem Helado',
    description: 'Confirma tu asistencia y descarga tu Pase Digital VIP para la gran fiesta de empresa.',
    url: appUrl,
    siteName: 'Crem Helado Eventos',
    images: [
      {
        url: '/og-cremhelado.jpg',
        width: 1200,
        height: 630,
        alt: 'Invitación Especial Fiesta Crem Helado 2026',
      },
    ],
    type: 'website',
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🎉 Tienes una Invitación Especial | Crem Helado',
    description: 'Confirma tu asistencia y descarga tu Pase Digital VIP para la gran fiesta de empresa.',
    images: ['/og-cremhelado.jpg'],
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
      className={`${geistSans.variable} ${geistMono.variable} ${lilitaOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
