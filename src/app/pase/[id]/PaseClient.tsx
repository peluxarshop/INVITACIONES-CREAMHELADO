'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faTimesCircle,
  faClock,
  faCalendarAlt,
  faMapMarkerAlt,
  faUtensils,
  faGift,
  faArrowLeft,
  faShieldAlt,
  faSearch,
  faUserCheck,
  faQrcode,
} from '@fortawesome/free-solid-svg-icons';
import { EventConfig, Guest } from '@/types';
import { formatEventSchedule } from '@/lib/timeUtils';
import { Footer } from '@/components/Footer';
import { SnowEffect } from '@/components/SnowEffect';
import {
  FestiveTag,
  LogoOutlined,
  Snowflake,
  StitchedCard,
  SuenoLockup,
  FestiveScatteredDecor,
} from '@/components/festive/Festive';
import {
  fetchEventConfig,
  fetchGuestById,
  fetchGuests,
  updateGuestStatus,
  DEFAULT_CONFIG,
} from '@/lib/dataService';

interface PaseClientProps {
  guestId: string;
}

export const PaseClient: React.FC<PaseClientProps> = ({ guestId }) => {
  const [config, setConfig] = useState<EventConfig>(DEFAULT_CONFIG);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedInTime, setCheckedInTime] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [loadedConfig, loadedGuest] = await Promise.all([
          fetchEventConfig(),
          fetchGuestById(guestId),
        ]);
        setConfig(loadedConfig);
        setGuest(loadedGuest);
      } catch (err) {
        console.error('Error cargando pase:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [guestId]);

  const handleCheckIn = () => {
    const time = new Date().toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setCheckedInTime(time);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchError('');
    try {
      const allGuests = await fetchGuests();
      const term = searchQuery.trim().toLowerCase();
      const found = allGuests.find(
        (g) =>
          g.id.toLowerCase() === term ||
          (g.cedula && g.cedula.toLowerCase().includes(term)) ||
          g.fullName.toLowerCase().includes(term) ||
          g.phone.includes(term)
      );

      if (found) {
        setGuest(found);
      } else {
        setSearchError('No se encontró ningún invitado con ese número de cédula o nombre.');
      }
    } catch {
      setSearchError('Error al buscar invitado.');
    }
  };

  const handleQuickConfirm = async () => {
    if (!guest) return;
    const updated = await updateGuestStatus(guest.id, 'confirmed');
    if (updated) setGuest(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-harlequin flex flex-col items-center justify-center p-4 gap-4">
        <Snowflake className="w-16 text-white animate-spin" style={{ animationDuration: '3s' }} />
        <p className="font-display text-pop-sm text-xl">Verificando pase de acceso oficial...</p>
      </div>
    );
  }

  const isConfirmed = guest?.status === 'confirmed';
  const isDeclined = guest?.status === 'declined';

  return (
    <div className="min-h-screen flex flex-col bg-harlequin text-slate-800 selection:bg-crem-red selection:text-white relative">
      <SnowEffect />
      <FestiveScatteredDecor />

      {/* Barra superior con logo oficial */}
      <header className="bg-crem-green-deep/95 backdrop-blur-md border-b-2 border-white/20 py-3.5 px-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoOutlined className="w-28 h-12" />
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-bold text-white bg-white/15 px-3 py-1.5 rounded-full border border-white/30">
            <FontAwesomeIcon icon={faShieldAlt} className="text-crem-gold" />
            <span>Control de Ingreso</span>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 sm:p-6 my-auto relative z-20">
        {guest ? (
          <StitchedCard bodyClassName="overflow-hidden text-center">
            {/* Header de Estado con indicador visual potente */}
            <div
              className={`p-6 sm:p-7 ${
                isConfirmed
                  ? 'bg-crem-green text-white'
                  : isDeclined
                  ? 'bg-rose-700 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              <div
                className={`w-20 h-20 rounded-full mx-auto mb-3.5 flex items-center justify-center text-3xl shadow-xl ring-4 ring-white/40 ${
                  isConfirmed ? 'bg-white text-crem-green' : isDeclined ? 'bg-white text-rose-700' : 'bg-white text-amber-600'
                }`}
              >
                <FontAwesomeIcon
                  icon={isConfirmed ? faCheckCircle : isDeclined ? faTimesCircle : faClock}
                />
              </div>

              <span className="font-display uppercase text-xs tracking-widest text-white/90 block">
                Pase Digital VIP Oficial &bull; Crem Helado
              </span>

              <h1 className="font-display text-3xl sm:text-4xl mt-1 leading-none text-white drop-shadow-sm">
                {isConfirmed
                  ? '¡PASE AUTORIZADO!'
                  : isDeclined
                  ? 'ASISTENCIA DECLINADA'
                  : 'PASE PENDIENTE'}
              </h1>

              <p className="text-xs text-white/95 font-medium mt-2 max-w-xs mx-auto">
                {isConfirmed
                  ? 'Acceso personal habilitado para 1 colaborador'
                  : isDeclined
                  ? 'El colaborador indicó previamente que no podría asistir'
                  : 'Este invitado aún no ha confirmado formalmente su asistencia'}
              </p>
            </div>

            {/* Información del Colaborador */}
            <div className="p-6 space-y-4 text-left text-sm">
              <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#e5d8c3]">
                <span className="font-display uppercase text-xs tracking-wider text-crem-green block">
                  Colaborador(a) / Invitado(a):
                </span>
                <div className="font-display text-slate-900 text-2xl leading-tight mt-0.5 break-words">
                  {guest.fullName}
                </div>

                {guest.cedula && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-600">C.C. / Documento:</span>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                      {guest.cedula}
                    </span>
                  </div>
                )}

                {guest.confirmedAt && (
                  <div className="mt-1.5 text-xs text-slate-500">
                    Confirmado el: {new Date(guest.confirmedAt).toLocaleString('es-CO')}
                  </div>
                )}
              </div>

              {/* Detalles del Evento */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-crem-red mt-0.5" />
                  <span>
                    <strong>Fecha:</strong> {config.eventDate} | <strong>Horario:</strong> {formatEventSchedule(config.eventTime, config.eventEndTime)}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-crem-green mt-0.5" />
                  <span>
                    <strong>Lugar:</strong> {config.locationName} ({config.locationAddress})
                  </span>
                </div>
              </div>

              {/* Check-In Interactivo de Puerta */}
              <div className="pt-2">
                {checkedInTime ? (
                  <div className="p-4 rounded-2xl bg-crem-green text-white text-center shadow-lg animate-in zoom-in-95">
                    <div className="font-display text-lg flex items-center justify-center gap-2">
                      <FontAwesomeIcon icon={faUserCheck} />
                      <span>INGRESO REGISTRADO EN PUERTA</span>
                    </div>
                    <p className="text-xs text-white/90 font-medium mt-1">
                      Hora de ingreso: {checkedInTime}
                    </p>
                  </div>
                ) : isConfirmed ? (
                  <button
                    type="button"
                    onClick={handleCheckIn}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-crem-green hover:bg-crem-green-dark text-white font-display text-base tracking-wide shadow-[0_5px_0_#043F1E] hover:translate-y-0.5 active:translate-y-1 transition-all cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faUserCheck} />
                    <span>MARCAR INGRESO EN PUERTA</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleQuickConfirm}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-crem-red hover:bg-crem-red-dark text-white font-display text-base tracking-wide shadow-[0_5px_0_#8E0A12] hover:translate-y-0.5 active:translate-y-1 transition-all cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>CONFIRMAR ASISTENCIA EN PUERTA</span>
                  </button>
                )}
              </div>

              {/* Enlace a Invitación */}
              <div className="pt-1">
                <Link
                  href={`/invitacion/${guest.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <span>Ver Invitación Completa</span>
                </Link>
              </div>
            </div>
          </StitchedCard>
        ) : (
          /* En caso de que el ID escaneado no exista */
          <StitchedCard bodyClassName="p-6 sm:p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 text-2xl border border-amber-200">
              <FontAwesomeIcon icon={faQrcode} />
            </div>

            <h2 className="font-display text-slate-900 text-3xl leading-none mb-1">
              Verificación de Pase
            </h2>
            <p className="text-xs text-slate-600 mb-6">
              El código escaneado no coincide con ningún registro previo. Puedes buscar al colaborador por cédula o nombre:
            </p>

            <form onSubmit={handleSearch} className="space-y-3 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Número de Cédula o Nombre..."
                className="w-full px-4 py-3 rounded-full border-2 border-slate-300 text-sm focus:outline-none focus:border-crem-green text-slate-900 bg-white"
              />

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-crem-green hover:bg-crem-green-dark text-white font-display text-base tracking-wide shadow-[0_4px_0_#043F1E] hover:translate-y-0.5 active:translate-y-1 transition-all cursor-pointer"
              >
                <FontAwesomeIcon icon={faSearch} />
                <span>Buscar Invitado</span>
              </button>
            </form>

            {searchError && (
              <p className="text-xs text-crem-red font-bold mb-3">{searchError}</p>
            )}

            <Link
              href="/"
              className="text-xs text-crem-green font-bold underline block"
            >
              Volver a la página principal
            </Link>
          </StitchedCard>
        )}
      </main>

      <Footer />
    </div>
  );
};
