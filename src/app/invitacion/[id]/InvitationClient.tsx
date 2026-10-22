'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faClock,
  faMapMarkerAlt,
  faShirt,
  faCheckCircle,
  faTimesCircle,
  faHeart,
  faChevronRight,
  faGift,
  faEnvelope,
  faExclamationTriangle,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { EventConfig, Guest } from '@/types';
import { CountdownTimer } from '@/components/CountdownTimer';
import { DigitalPass } from '@/components/DigitalPass';
import { RsvpModal } from '@/components/RsvpModal';
import { Footer } from '@/components/Footer';
import { SnowEffect } from '@/components/SnowEffect';
import { FestiveMusicPlayer } from '@/components/festive/FestiveMusicPlayer';
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
import {
  fetchEventConfig,
  fetchGuestById,
  updateGuestStatus,
  DEFAULT_CONFIG,
} from '@/lib/dataService';

interface InvitationClientProps {
  guestId: string;
}

export const InvitationClient: React.FC<InvitationClientProps> = ({ guestId }) => {
  const [config, setConfig] = useState<EventConfig>(DEFAULT_CONFIG);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<'confirm' | 'decline' | null>(null);
  const [emailFeedback, setEmailFeedback] = useState<{ status: 'sent' | 'warn' | 'sending'; message: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [loadedConfig, loadedGuest] = await Promise.all([
          fetchEventConfig(),
          fetchGuestById(guestId),
        ]);
        setConfig(loadedConfig);

        if (loadedGuest) {
          setGuest(loadedGuest);
        } else {
          setGuest({
            id: guestId || 'inv-invitado-especial',
            fullName: 'Invitado(a) de Honor',
            firstName: 'Apreciado(a) Colaborador(a)',
            phone: '573000000000',
            email: 'invitado@cremhelado.com.co',
            status: 'pending',
            createdAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error('Error cargando invitación:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [guestId]);

  const fireConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E30613', '#0B8A3E', '#FFFFFF', '#F2C94C'],
    });
  };

  const handleConfirm = async (data: { fullName: string; cedula: string; email: string }) => {
    if (!guest) return;
    const updated = await updateGuestStatus(guest.id, 'confirmed', {
      fullName: data.fullName,
      cedula: data.cedula,
      email: data.email,
    });

    const finalGuest = updated || {
      ...guest,
      status: 'confirmed' as const,
      fullName: data.fullName,
      cedula: data.cedula,
      email: data.email,
      confirmedAt: new Date().toISOString(),
    };
    setGuest(finalGuest);
    fireConfetti();

    // Disparar envío automático de correo de confirmación si hay email
    if (finalGuest.email) {
      setEmailFeedback({ status: 'sending', message: `Enviando tu Pase VIP a ${finalGuest.email}...` });
      try {
        const passUrl = typeof window !== 'undefined' ? `${window.location.origin}/invitacion/${guest.id}` : '';
        const res = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'confirmation',
            guest: finalGuest,
            config,
            url: passUrl,
          }),
        });
        const resData = await res.json();
        if (resData.success) {
          setEmailFeedback({
            status: 'sent',
            message: `¡Pase VIP enviado con éxito a tu correo (${finalGuest.email})! Revisa tu bandeja de entrada o spam.`,
          });
        } else {
          setEmailFeedback({
            status: 'warn',
            message: resData.error || 'No se pudo entregar el correo automático.',
          });
        }
      } catch (e) {
        setEmailFeedback({
          status: 'warn',
          message: 'Tu asistencia quedó confirmada en el sistema, pero ocurrió un detalle al conectar con el servicio de correo.',
        });
      }
    }
  };

  const handleDecline = async (reason?: string) => {
    if (!guest) return;
    const updated = await updateGuestStatus(guest.id, 'declined', { notes: reason });
    if (updated) {
      setGuest(updated);
    } else {
      setGuest({
        ...guest,
        status: 'declined',
        notes: reason,
      });
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(`${dateStr}T12:00:00`);
      return date.toLocaleDateString('es-CO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-harlequin flex flex-col items-center justify-center p-4 gap-4">
        <Snowflake className="w-16 text-white animate-spin" style={{ animationDuration: '3s' }} />
        <p className="font-display text-pop-sm text-xl">Preparando tu invitación especial...</p>
      </div>
    );
  }

  const displayName = guest?.fullName || 'Invitado(a) Especial';
  const firstName = guest?.firstName || displayName.split(' ')[0];

  const details = [
    {
      icon: faCalendarAlt,
      tone: 'bg-crem-red',
      label: 'Fecha',
      value: <span className="capitalize">{formatDate(config.eventDate)}</span>,
    },
    {
      icon: faClock,
      tone: 'bg-crem-green',
      label: 'Hora',
      value: `${config.eventTime} horas (7:00 PM)`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-harlequin text-slate-800 selection:bg-crem-red selection:text-white relative">
      <SnowEffect />
      <FestiveMusicPlayer enabled={config.musicEnabled} src={config.musicUrl} />
      <FestiveScatteredDecor />

      {/* ================= CABECERA ================= */}
      <header className="relative overflow-hidden">
        <FestiveHeroBackdrop />

        {/* Capa de copos, destellos y heladitos en primer plano (POR ENCIMA de la cinta roja) */}
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
          {/* Copo grande superior izquierdo: solo en pantallas medianas/grandes para proteger 100% el logo en móvil */}
          <Snowflake
            className="absolute text-white w-20 sm:w-28 top-[4%] left-[2%] sm:left-[4%] drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] animate-float-slow hidden md:block"
          />
          {/* Copo central sutil para móvil en espacio libre entre logo y etiqueta */}
          <SnowflakeCrystal
            className="absolute text-white/80 w-7 h-7 top-[3%] left-[44%] drop-shadow animate-twinkle md:hidden"
          />
          {/* Copo cristalino superior */}
          <SnowflakeCrystal
            className="absolute text-white/95 w-11 sm:w-16 top-[5%] right-[32%] sm:right-[26%] drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)] animate-twinkle"
          />
          {/* Heladito Chococono flotando sobre la cinta izquierda */}
          <div className="absolute top-[48%] left-2 sm:left-6 -rotate-12 animate-float-slow block">
            <ChococonoVector className="w-12 h-16 sm:w-16 sm:h-22 drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)]" />
          </div>
          {/* Paleta Polet con mordisco flotando a la derecha sobre la cinta */}
          <div className="absolute top-[42%] right-2 sm:right-6 rotate-12 animate-float-slow block" style={{ animationDelay: '1.8s' }}>
            <PoletVector className="w-10 h-16 sm:w-14 sm:h-22 drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)]" />
          </div>
          {/* Copo inferior derecho */}
          <Snowflake
            arms={6}
            className="absolute text-white/95 w-16 sm:w-24 bottom-[4%] right-[3%] sm:right-[6%] drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] animate-float-slow"
            style={{ animationDelay: '2.4s' }}
          />
          {/* Destellos mágicos */}
          <Sparkle className="absolute text-yellow-200 w-7 h-7 top-[30%] left-[16%] drop-shadow animate-twinkle" />
          <Sparkle className="absolute text-white w-6 h-6 bottom-[14%] left-[20%] drop-shadow animate-twinkle" style={{ animationDelay: '1.2s' }} />
          <Sparkle className="absolute text-yellow-200 w-8 h-8 top-[28%] right-[14%] drop-shadow animate-twinkle" style={{ animationDelay: '0.8s' }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7 pb-16 sm:pb-24">
          {/* Fila superior con z-30 para que Invitación Especial quede SIEMPRE por encima de la cinta roja */}
          <div className="relative z-30 flex items-start justify-between gap-3">
            <LogoOutlined className="w-28 h-16 sm:w-40 sm:h-24 drop-shadow-lg" />
            <FestiveTag tone="red" className="rotate-3 mt-1">
              <span className="block text-base sm:text-2xl text-center leading-[0.95]">
                Invitación
                <br />
                <span className="text-crem-green">Especial</span>
              </span>
            </FestiveTag>
          </div>

          <div className="relative mt-12 sm:mt-10">
            <RedBand className="-top-9 -bottom-12 sm:-top-12 sm:-bottom-16" />
            <div className="relative">
              <SuenoLockup size="md" />
              <h1 className="font-display text-pop-sm text-center text-xl sm:text-3xl mt-4 sm:mt-5 leading-tight max-w-xl mx-auto px-2">
                {config.eventName}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* ================= CONTENIDO ================= */}
      <main className="relative z-10 flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 pb-16 space-y-12 sm:space-y-16">
        {/* Saludo personal */}
        <StitchedCard className="z-[1]" bodyClassName="px-5 py-8 sm:px-10 sm:py-10 text-center">
          <div className="w-16 h-16 rounded-full bg-crem-red text-white flex items-center justify-center mx-auto text-2xl shadow-lg ring-4 ring-red-100">
            <FontAwesomeIcon icon={faGift} />
          </div>
          <p className="font-display uppercase tracking-wider text-crem-green text-sm sm:text-base mt-4">
            Invitación personal de honor
          </p>
          <h2 className="font-display text-slate-900 text-4xl sm:text-5xl leading-[0.95] mt-1 break-words">
            ¡Hola, <span className="text-crem-red">{firstName}</span>!
          </h2>

          <p className="font-display uppercase leading-[1.05] text-lg sm:text-2xl mt-5 max-w-md mx-auto">
            <span className="text-crem-green">Cambiemos grandes </span>
            <span className="text-crem-red">regalos </span>
            <span className="text-crem-green">por grandes </span>
            <span className="text-crem-red">sonrisas</span>
          </p>

          <div className="h-1.5 w-24 candy-stripe rounded-full mx-auto my-5" aria-hidden="true" />

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            {config.motivationalMessage}
          </p>
        </StitchedCard>

        {/* Cuenta regresiva sobre franja roja */}
        <section className="relative py-12 sm:py-14">
          <RedBand className="top-0 bottom-0" skew="right" />
          <div className="relative">
            <h2 className="font-display text-pop text-center text-4xl sm:text-5xl uppercase leading-none">
              ¡Falta muy poco!
            </h2>
            <p className="text-white font-semibold text-center text-sm sm:text-base mt-2 mb-6">
              Tiempo restante para la celebración
            </p>
            <CountdownTimer targetDate={config.eventDate} targetTime={config.eventTime} />
          </div>
        </section>

        {/* Detalles del evento */}
        <StitchedCard className="z-[1]" bodyClassName="px-5 py-7 sm:px-9 sm:py-9">
          <h2 className="font-display uppercase text-3xl sm:text-4xl leading-none text-crem-green text-center">
            Detalles del <span className="text-crem-red">evento</span>
          </h2>
          <div className="h-1.5 w-20 candy-stripe rounded-full mx-auto mt-3 mb-7" aria-hidden="true" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {details.map((d) => (
              <div key={d.label} className="flex items-start gap-3.5">
                <div className={`w-11 h-11 rounded-xl ${d.tone} text-white flex items-center justify-center shrink-0 shadow-md`}>
                  <FontAwesomeIcon icon={d.icon} />
                </div>
                <div className="min-w-0">
                  <span className="font-display uppercase text-xs tracking-wider text-slate-500 block">{d.label}</span>
                  <span className="text-base font-bold text-slate-900 leading-snug block">{d.value}</span>
                </div>
              </div>
            ))}

            <div className="flex items-start gap-3.5 sm:col-span-2">
              <div className="w-11 h-11 rounded-xl bg-crem-red text-white flex items-center justify-center shrink-0 shadow-md">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-display uppercase text-xs tracking-wider text-slate-500 block">Lugar</span>
                <span className="text-base font-bold text-slate-900 block leading-snug">{config.locationName}</span>
                <span className="text-sm text-slate-600 block">{config.locationAddress}</span>
                {config.mapsUrl && (
                  <a
                    href={config.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-crem-green text-white text-xs font-bold shadow-md hover:bg-crem-green-dark transition-colors"
                  >
                    <span>Ver ubicación en Google Maps</span>
                    <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                  </a>
                )}
              </div>
            </div>

            {config.dressCode && (
              <div className="flex items-start gap-3.5 sm:col-span-2 pt-5 border-t-2 border-dashed border-slate-200">
                <div className="w-11 h-11 rounded-xl bg-crem-green text-white flex items-center justify-center shrink-0 shadow-md">
                  <FontAwesomeIcon icon={faShirt} />
                </div>
                <div className="min-w-0">
                  <span className="font-display uppercase text-xs tracking-wider text-slate-500 block">
                    Código de vestimenta
                  </span>
                  <span className="text-base font-bold text-slate-900">{config.dressCode}</span>
                </div>
              </div>
            )}
          </div>
        </StitchedCard>

        {/* ================= ESTADO DE RESPUESTA ================= */}
        {guest?.status === 'confirmed' ? (
          <section>
            {emailFeedback && (
              <div
                className={`mb-6 p-4 rounded-2xl bg-white shadow-lg border-l-8 text-sm flex items-start gap-3 ${
                  emailFeedback.status === 'sent'
                    ? 'border-crem-green text-crem-green-dark'
                    : emailFeedback.status === 'sending'
                    ? 'border-sky-500 text-sky-800'
                    : 'border-amber-500 text-amber-900'
                }`}
              >
                <FontAwesomeIcon
                  icon={
                    emailFeedback.status === 'sent'
                      ? faEnvelope
                      : emailFeedback.status === 'sending'
                      ? faSpinner
                      : faExclamationTriangle
                  }
                  className={`text-base mt-0.5 ${emailFeedback.status === 'sending' ? 'animate-spin' : ''}`}
                />
                <p className="font-semibold flex-1">{emailFeedback.message}</p>
              </div>
            )}

            <div className="text-center">
              <h2 className="font-display text-pop text-3xl sm:text-4xl uppercase leading-none inline-flex items-center gap-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-2xl sm:text-3xl" />
                <span>¡Asistencia confirmada!</span>
              </h2>
              <p className="text-white font-semibold text-sm mt-2">Este es tu pase oficial de ingreso</p>
            </div>

            <DigitalPass guest={guest} config={config} />

            <div className="text-center">
              <button
                onClick={() => setModalType('confirm')}
                className="text-sm text-white font-semibold underline underline-offset-4 decoration-2 hover:text-crem-gold cursor-pointer"
              >
                ¿Deseas actualizar tu nombre, cédula o correo? Haz clic aquí
              </button>
            </div>
          </section>
        ) : guest?.status === 'declined' ? (
          <StitchedCard className="z-[1]" bodyClassName="px-6 py-8 sm:px-10 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 text-crem-red flex items-center justify-center mx-auto mb-3 text-2xl ring-4 ring-red-100">
              <FontAwesomeIcon icon={faHeart} />
            </div>
            <h3 className="font-display text-3xl text-slate-900 leading-none">Respuesta registrada</h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto mt-3">
              Indicaste que no podrás acompañarnos. ¡Te extrañaremos, pero agradecemos tu compromiso constante
              con la familia Crem Helado!
            </p>

            <div className="mt-6 pt-5 border-t-2 border-dashed border-slate-200">
              <p className="text-sm text-slate-500 mb-3">¿Cambiaste de planes y finalmente sí puedes venir?</p>
              <button
                onClick={() => setModalType('confirm')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-crem-green text-white font-display text-lg tracking-wide shadow-[0_5px_0_#043F1E] hover:translate-y-0.5 active:translate-y-1 transition-all cursor-pointer"
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>¡Sí puedo ir!</span>
              </button>
            </div>
          </StitchedCard>
        ) : (
          /* Estado pendiente */
          <div className="relative pt-6">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-[2]">
              <FestiveTag tone="red" className="-rotate-2">
                <span className="text-xl sm:text-2xl whitespace-nowrap">¡Confírmanos!</span>
              </FestiveTag>
            </div>
            <StitchedCard className="z-[1]" bodyClassName="px-5 pt-14 pb-8 sm:px-10 sm:pt-16 text-center">
              <h3 className="font-display text-slate-900 text-3xl sm:text-4xl leading-none">
                ¿Nos acompañarás a <span className="text-crem-red">celebrar</span>?
              </h3>
              <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto mt-3 mb-7">
                Confirma antes del evento para asegurar tu cena de gala, la estación de helados y tu participación en las rifas.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
                <button
                  onClick={() => setModalType('confirm')}
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-crem-red text-white font-display text-xl sm:text-2xl tracking-wide border-[3px] border-white ring-2 ring-crem-red shadow-[0_6px_0_#8E0A12,0_14px_24px_rgba(0,0,0,0.25)] hover:translate-y-0.5 hover:shadow-[0_4px_0_#8E0A12,0_10px_18px_rgba(0,0,0,0.25)] active:translate-y-1.5 active:shadow-none transition-all cursor-pointer"
                >
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>¡Sí, allá estaré!</span>
                </button>

                <button
                  onClick={() => setModalType('decline')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
                >
                  <FontAwesomeIcon icon={faTimesCircle} className="text-slate-400" />
                  <span>No podré asistir</span>
                </button>
              </div>
            </StitchedCard>
          </div>
        )}
      </main>

      {/* Modal de Confirmación */}
      {guest && (
        <RsvpModal
          isOpen={modalType !== null}
          type={modalType || 'confirm'}
          guest={guest}
          companyName={config.companyName}
          onClose={() => setModalType(null)}
          onConfirmSuccess={handleConfirm}
          onDeclineSuccess={handleDecline}
        />
      )}

      <Footer />
    </div>
  );
};
