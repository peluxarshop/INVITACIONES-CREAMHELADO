'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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
  faUtensils,
  faIceCream,
} from '@fortawesome/free-solid-svg-icons';
import { EventConfig, Guest } from '@/types';
import { CountdownTimer } from '@/components/CountdownTimer';
import { DigitalPass } from '@/components/DigitalPass';
import { RsvpModal } from '@/components/RsvpModal';
import { Footer } from '@/components/Footer';
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
      colors: ['#E30613', '#D4AF37', '#005CA9', '#FFB800'],
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

    // Disparar envío automático de correo de confirmación
    try {
      const passUrl = typeof window !== 'undefined' ? `${window.location.origin}/invitacion/${guest.id}` : '';
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'confirmation',
          guest: finalGuest,
          config,
          url: passUrl,
        }),
      });
    } catch (e) {
      console.warn('No se pudo enviar correo automático:', e);
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
      <div className="min-h-screen bg-[#faf8f5] text-slate-800 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#E30613] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-700 font-semibold text-sm">
          Cargando tu invitación especial...
        </p>
      </div>
    );
  }

  const displayName = guest?.fullName || 'Invitado(a) Especial';
  const firstName = guest?.firstName || displayName.split(' ')[0];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 flex flex-col selection:bg-[#E30613] selection:text-white relative overflow-hidden">
      {/* Resplandor cálido festivo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-red-100/50 via-amber-100/40 to-transparent blur-3xl pointer-events-none" />

      {/* Franja decorativa festiva */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#E30613] via-[#D4AF37] to-[#005CA9]" />

      {/* Contenido principal */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-8 sm:py-12 relative z-10">
        {/* Cabecera / Marca Oficial Crem Helado */}
        <div className="text-center mb-6">
          <div className="relative w-44 sm:w-52 h-14 sm:h-16 mx-auto mb-3">
            <Image
              src="/logo-cremhelado.png"
              alt="Crem Helado"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="inline-block bg-red-50 border border-red-200 px-3.5 py-1 rounded-full mb-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#E30613]">
              Gala de Fin de Año &bull; Celebración 2026
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            {config.eventName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-medium">
            Una noche de gala para celebrar nuestros logros y la alegría de estar juntos
          </p>
        </div>

        {/* Tarjeta de Saludo Personalizado */}
        <div className="relative rounded-3xl p-6 sm:p-7 bg-white border border-[#ebd9c8] shadow-md mb-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E30613] flex items-center justify-center mx-auto mb-3 text-xl">
            <FontAwesomeIcon icon={faGift} />
          </div>

          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block mb-1">
            Invitación Personal de Honor
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ¡Hola, {firstName}!
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed max-w-md mx-auto">
            {config.motivationalMessage}
          </p>
        </div>

        {/* Cuenta Regresiva */}
        <div className="mb-6">
          <div className="text-center mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tiempo restante para la celebración
            </span>
          </div>
          <CountdownTimer targetDate={config.eventDate} targetTime={config.eventTime} />
        </div>

        {/* Detalles del Evento */}
        <div className="rounded-3xl p-6 bg-white border border-[#ebd9c8] shadow-sm mb-6 space-y-4">
          <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100 pb-2.5">
            Detalles del Evento
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E30613] flex items-center justify-center shrink-0 mt-0.5">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block font-medium">Fecha</span>
                <span className="text-sm font-bold text-slate-900 capitalize">
                  {formatDate(config.eventDate)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E30613] flex items-center justify-center shrink-0 mt-0.5">
                <FontAwesomeIcon icon={faClock} className="text-xs" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block font-medium">Hora</span>
                <span className="text-sm font-bold text-slate-900">
                  {config.eventTime} Horas (7:00 PM)
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:col-span-2">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E30613] flex items-center justify-center shrink-0 mt-0.5">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] text-slate-500 block font-medium">Lugar</span>
                <span className="text-sm font-bold text-slate-900 block">
                  {config.locationName}
                </span>
                <span className="text-xs text-slate-500 block">
                  {config.locationAddress}
                </span>
                {config.mapsUrl && (
                  <a
                    href={config.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#005CA9] hover:underline font-bold mt-1.5"
                  >
                    <span>Ver ubicación en Google Maps</span>
                    <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                  </a>
                )}
              </div>
            </div>

            {config.dressCode && (
              <div className="flex items-start gap-3 sm:col-span-2 pt-2 border-t border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E30613] flex items-center justify-center shrink-0 mt-0.5">
                  <FontAwesomeIcon icon={faShirt} className="text-xs" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block font-medium">
                    Código de Vestimenta (Dress Code)
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {config.dressCode}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sección de Confirmación / Estado del Invitado */}
        {guest?.status === 'confirmed' ? (
          <div>
            <div className="text-center mb-3">
              <span className="text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5">
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>¡Asistencia confirmada exitosamente! Tu pase oficial:</span>
              </span>
            </div>
            <DigitalPass guest={guest} config={config} />

            <div className="text-center mt-3">
              <button
                onClick={() => setModalType('confirm')}
                className="text-xs text-slate-500 hover:text-[#E30613] underline underline-offset-4 cursor-pointer"
              >
                ¿Deseas actualizar tu nombre, cédula o correo? Haz clic aquí
              </button>
            </div>
          </div>
        ) : guest?.status === 'declined' ? (
          <div className="rounded-3xl p-6 sm:p-8 bg-white border border-[#ebd9c8] text-center shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3 text-xl">
              <FontAwesomeIcon icon={faHeart} className="text-[#E30613]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Respuesta registrada</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              Indicaste que no podrás acompañarnos. ¡Te extrañaremos, pero agradecemos tu
              compromiso constante con la familia Crem Helado!
            </p>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-2">
                ¿Cambiaste de planes y finalmente sí puedes venir?
              </p>
              <button
                onClick={() => setModalType('confirm')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>¡Cambiar mi respuesta y confirmar asistencia!</span>
              </button>
            </div>
          </div>
        ) : (
          /* Estado Pendiente: Botones de Decisión */
          <div className="rounded-3xl p-6 sm:p-8 bg-white border border-[#ebd9c8] text-center shadow-md">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-1.5">
              ¿Nos acompañarás a celebrar?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6">
              Por favor confirma antes del evento para asegurar tu cena, degustación de helados y rifas.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setModalType('confirm')}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-[#E30613] hover:bg-[#c40510] text-white font-black text-sm tracking-wide shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>¡SÍ, ALLÁ ESTARÉ!</span>
              </button>

              <button
                onClick={() => setModalType('decline')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faTimesCircle} className="text-slate-400" />
                <span>No podré asistir</span>
              </button>
            </div>
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

      {/* Footer */}
      <Footer />
    </div>
  );
};
