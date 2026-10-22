import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt,
  faUtensils,
  faGift,
  faQrcode,
  faEnvelopeOpenText,
  faCircleCheck,
  faTicket,
} from '@fortawesome/free-solid-svg-icons';
import { Footer } from '@/components/Footer';
import { SnowEffect } from '@/components/SnowEffect';
import {
  FestiveHeroBackdrop,
  FestiveTag,
  LogoOutlined,
  RedBand,
  Snowflake,
  SnowflakeCrystal,
  Sparkle,
  StitchedCard,
  SuenoLockup,
  ChococonoVector,
  PoletVector,
  FestiveScatteredDecor,
} from '@/components/festive/Festive';

const features = [
  {
    icon: faQrcode,
    iconBg: 'bg-crem-red',
    title: 'Pase VIP',
    highlight: 'con QR',
    highlightColor: 'text-crem-red',
    text: 'Confirmación inmediata y un código QR personal para entrar sin filas a la fiesta.',
  },
  {
    icon: faUtensils,
    iconBg: 'bg-crem-green',
    title: 'Banquete &',
    highlight: 'Heladería',
    highlightColor: 'text-crem-green',
    text: 'Cena de gala, brindis de honor y estación ilimitada de postres y helados Crem Helado.',
  },
  {
    icon: faGift,
    iconBg: 'bg-crem-red',
    title: 'Grandes',
    highlight: 'Rifas',
    highlightColor: 'text-crem-red',
    text: 'Sorteos, bonos navideños y sorpresas para todos los colaboradores confirmados.',
  },
];

const steps = [
  { icon: faEnvelopeOpenText, title: 'Abre tu invitación', text: 'Recibe tu enlace personal por WhatsApp o correo.' },
  { icon: faCircleCheck, title: 'Confirma asistencia', text: 'Registra tu nombre y cédula en segundos.' },
  { icon: faTicket, title: 'Recibe tu Pase VIP', text: 'Preséntalo en la entrada desde tu celular.' },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-harlequin text-slate-800 selection:bg-crem-red selection:text-white relative">
      <SnowEffect />
      <FestiveScatteredDecor />

      {/* ================= HERO ================= */}
      <header className="relative overflow-hidden">
        <FestiveHeroBackdrop />

        {/* Copos, destellos y heladitos en primer plano (POR ENCIMA de la cinta roja) */}
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
          {/* Copo grande superior izquierdo */}
          <Snowflake
            className="absolute text-white w-20 sm:w-32 top-[4%] left-[2%] sm:left-[4%] drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] animate-float-slow"
          />
          {/* Copo cristalino superior derecho */}
          <SnowflakeCrystal
            className="absolute text-white/95 w-12 sm:w-16 top-[5%] right-[10%] sm:right-[15%] drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)] animate-twinkle"
          />
          {/* Heladito Chococono flotando sobre el borde izquierdo */}
          <div className="absolute top-[42%] left-2 sm:left-8 -rotate-12 animate-float-slow block">
            <ChococonoVector className="w-12 h-16 sm:w-16 sm:h-24 drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)]" />
          </div>
          {/* Paleta Polet con mordisco flotando a la derecha sobre la cinta */}
          <div className="absolute top-[40%] right-2 sm:right-8 rotate-12 animate-float-slow block" style={{ animationDelay: '1.8s' }}>
            <PoletVector className="w-11 h-16 sm:w-15 sm:h-24 drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)]" />
          </div>
          {/* Copo inferior derecho */}
          <Snowflake
            arms={6}
            className="absolute text-white/95 w-16 sm:w-28 bottom-[6%] right-[2%] sm:right-[5%] drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] animate-float-slow"
            style={{ animationDelay: '2.5s' }}
          />
          {/* Destellos mágicos */}
          <Sparkle className="absolute text-yellow-200 w-7 h-7 top-[26%] left-[18%] drop-shadow animate-twinkle" />
          <Sparkle className="absolute text-white w-6 h-6 bottom-[18%] left-[24%] drop-shadow animate-twinkle" style={{ animationDelay: '1.2s' }} />
          <Sparkle className="absolute text-yellow-200 w-8 h-8 top-[32%] right-[20%] drop-shadow animate-twinkle" style={{ animationDelay: '0.8s' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7 pb-20 sm:pb-28">
          {/* Barra superior con z-30 */}
          <div className="relative z-30 flex items-start justify-between gap-3">
            <LogoOutlined className="w-28 h-16 sm:w-44 sm:h-24 drop-shadow-lg" />
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-full bg-white text-crem-green-dark text-xs font-bold shadow-lg hover:scale-105 transition-transform"
            >
              <FontAwesomeIcon icon={faShieldAlt} className="text-crem-red" />
              <span className="hidden sm:inline">Administración</span>
            </Link>
          </div>

          {/* Etiqueta inclinada con z-30 */}
          <div className="relative z-30 flex justify-center mt-4 sm:-mt-6">
            <FestiveTag tone="green" className="-rotate-3">
              <span className="text-xl sm:text-3xl">Fin de Año 2026</span>
            </FestiveTag>
          </div>

          {/* Lockup sobre franja roja */}
          <div className="relative mt-10 sm:mt-12">
            <RedBand className="-top-10 -bottom-12 sm:-top-14 sm:-bottom-16" />
            <div className="relative">
              <SuenoLockup size="lg" />
              <p className="font-display text-pop-sm text-center text-lg sm:text-2xl md:text-3xl mt-4 sm:mt-5 max-w-2xl mx-auto leading-tight">
                La gran gala de la familia Crem Helado
              </p>
            </div>
          </div>

          {/* Frase de campaña centrada */}
          <div className="mt-14 sm:mt-20 max-w-2xl mx-auto flex justify-center">
            <StitchedCard className="w-full rotate-[-1deg]" bodyClassName="px-6 py-6 sm:px-10 sm:py-8">
              <p className="font-display uppercase text-center leading-[1.05] text-2xl sm:text-3xl">
                <span className="text-crem-green">Cambiemos grandes </span>
                <span className="text-crem-red">regalos </span>
                <span className="text-crem-green">por grandes </span>
                <span className="text-crem-red">sonrisas</span>
              </p>
              <p className="text-center text-slate-600 text-sm sm:text-base mt-3 leading-relaxed max-w-lg mx-auto">
                Gracias por un año lleno de pasión y entrega. La gran familia Crem Helado se reúne para celebrar sus logros y vivir una noche inolvidable.
              </p>
            </StitchedCard>
          </div>
        </div>
      </header>

      {/* ================= EXPERIENCIA ================= */}
      <main className="relative z-10 flex-1">
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="font-display text-pop text-4xl sm:text-5xl md:text-6xl uppercase leading-none">
              Una noche mágica
            </h2>
            <p className="text-white/90 font-semibold text-sm sm:text-base mt-3">
              Esto es lo que te espera en la celebración
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {features.map((f, i) => (
              <StitchedCard
                key={f.highlight}
                className={`transition-transform hover:-translate-y-1.5 hover:rotate-0 ${
                  i === 1 ? 'lg:rotate-1' : i === 0 ? 'lg:-rotate-1' : 'lg:rotate-[0.6deg]'
                } ${i === 2 ? 'sm:col-span-2 lg:col-span-1 sm:max-w-md sm:mx-auto sm:w-full lg:max-w-none' : ''}`}
                bodyClassName="p-6 sm:p-7 pt-8"
              >
                <div className={`w-14 h-14 rounded-2xl ${f.iconBg} text-white flex items-center justify-center text-2xl shadow-lg mb-4 ring-4 ring-white`}>
                  <FontAwesomeIcon icon={f.icon} />
                </div>
                <h3 className="font-display uppercase text-3xl leading-none text-slate-900">
                  {f.title} <span className={f.highlightColor}>{f.highlight}</span>
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-3">{f.text}</p>
              </StitchedCard>
            ))}
          </div>
        </section>

        {/* ================= CÓMO FUNCIONA (franja roja) ================= */}
        <section className="relative py-20 sm:py-28 overflow-hidden">
          <RedBand className="top-8 bottom-8 sm:top-10 sm:bottom-10" skew="right" />
          <Snowflake className="absolute text-white/90 w-14 sm:w-20 top-14 left-[5%] animate-float-slow" />
          <Sparkle className="absolute text-white w-8 bottom-16 right-[8%] animate-twinkle" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-pop text-center text-4xl sm:text-5xl uppercase leading-none mb-10 sm:mb-12">
              ¿Cómo funciona?
            </h2>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              {steps.map((s, i) => (
                <li key={s.title} className="flex md:flex-col items-center md:text-center gap-4">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-crem-red flex items-center justify-center text-2xl sm:text-3xl shadow-[0_6px_0_rgba(0,0,0,0.2)]">
                      <FontAwesomeIcon icon={s.icon} />
                    </div>
                    <span className="de-badge absolute -top-1 -right-1 w-8 h-8 text-base">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-pop-sm text-2xl sm:text-3xl leading-none">{s.title}</h3>
                    <p className="text-white/95 text-sm mt-1.5 font-medium">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div className="h-10 sm:h-14" />
      </main>

      <Footer />
    </div>
  );
}
