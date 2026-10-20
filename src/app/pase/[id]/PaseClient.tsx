'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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
  faIceCream,
  faQrcode,
} from '@fortawesome/free-solid-svg-icons';
import { EventConfig, Guest } from '@/types';
import { Footer } from '@/components/Footer';
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
    if (updated) {
      setGuest(updated);
    } else {
      setGuest({
        ...guest,
        status: 'confirmed',
        confirmedAt: new Date().toISOString(),
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-slate-800 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#E30613] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-700 font-semibold text-sm">
          Verificando pase de acceso oficial...
        </p>
      </div>
    );
  }

  const isConfirmed = guest?.status === 'confirmed';
  const isDeclined = guest?.status === 'declined';

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 flex flex-col justify-between selection:bg-[#E30613] selection:text-white">
      {/* Barra superior con logo oficial */}
      <header className="bg-white border-b border-[#ebd9c8] py-4 px-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-32 h-11">
              <Image
                src="/logo-cremhelado.png"
                alt="Crem Helado"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <FontAwesomeIcon icon={faShieldAlt} className="text-[#E30613]" />
            <span>Control de Ingreso</span>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 sm:p-6 my-auto">
        {guest ? (
          <div className="bg-white border border-[#ebd9c8] rounded-3xl shadow-xl overflow-hidden text-center">
            {/* Header de Estado con indicador visual potente */}
            <div
              className={`p-6 sm:p-7 ${
                isConfirmed
                  ? 'bg-gradient-to-b from-emerald-50 via-emerald-50/50 to-white border-b border-emerald-100'
                  : isDeclined
                  ? 'bg-gradient-to-b from-rose-50 via-rose-50/50 to-white border-b border-rose-100'
                  : 'bg-gradient-to-b from-amber-50 via-amber-50/50 to-white border-b border-amber-100'
              }`}
            >
              <div
                className={`w-20 h-20 rounded-full mx-auto mb-3.5 flex items-center justify-center text-3xl shadow-sm ${
                  isConfirmed
                    ? 'bg-emerald-600 text-white shadow-emerald-500/25 ring-4 ring-emerald-100'
                    : isDeclined
                    ? 'bg-rose-600 text-white shadow-rose-500/25 ring-4 ring-rose-100'
                    : 'bg-amber-500 text-white shadow-amber-500/25 ring-4 ring-amber-100'
                }`}
              >
                <FontAwesomeIcon
                  icon={isConfirmed ? faCheckCircle : isDeclined ? faTimesCircle : faClock}
                />
              </div>

              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 block">
                Pase Digital VIP Oficial &bull; Crem Helado
              </span>

              <h1
                className={`text-2xl font-black mt-1 ${
                  isConfirmed
                    ? 'text-emerald-800'
                    : isDeclined
                    ? 'text-rose-800'
                    : 'text-amber-800'
                }`}
              >
                {isConfirmed
                  ? '¡PASE AUTORIZADO!'
                  : isDeclined
                  ? 'ASISTENCIA DECLINADA'
                  : 'PASE PENDIENTE POR CONFIRMAR'}
              </h1>

              <p className="text-xs text-slate-600 mt-1.5 max-w-xs mx-auto">
                {isConfirmed
                  ? 'Acceso habilitado para 1 colaborador + Cena de Gala + Rifas de Fin de Año'
                  : isDeclined
                  ? 'El colaborador indicó previamente que no podría asistir'
                  : 'Este invitado aún no ha confirmado formalmente su asistencia'}
              </p>
            </div>

            {/* Información del Colaborador */}
            <div className="p-6 space-y-4 text-left text-sm">
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#ebd9c8]">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Colaborador(a) / Invitado(a):
                </span>
                <div className="text-xl font-black text-slate-900 mt-0.5 tracking-tight">
                  {guest.fullName}
                </div>

                {guest.cedula && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-500">C.C. / Documento:</span>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                      {guest.cedula}
                    </span>
                  </div>
                )}

                {guest.confirmedAt && (
                  <div className="mt-1.5 text-[11px] text-slate-500">
                    Confirmado el: {new Date(guest.confirmedAt).toLocaleString('es-CO')}
                  </div>
                )}
              </div>

              {/* Beneficios Incluidos */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-red-50/70 border border-red-100 flex items-center gap-2.5 text-slate-800">
                  <FontAwesomeIcon icon={faUtensils} className="text-[#E30613]" />
                  <span className="font-bold">Cena de Gala</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center gap-2.5 text-slate-800">
                  <FontAwesomeIcon icon={faGift} className="text-[#B45309]" />
                  <span className="font-bold">Boleta de Rifas</span>
                </div>
              </div>

              {/* Detalles del Evento */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-[#E30613] mt-0.5" />
                  <span>
                    <strong>Fecha:</strong> {config.eventDate} | <strong>Hora:</strong> {config.eventTime} hrs
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#E30613] mt-0.5" />
                  <span>
                    <strong>Lugar:</strong> {config.locationName} ({config.locationAddress})
                  </span>
                </div>
              </div>

              {/* Check-In Interactivo de Puerta */}
              <div className="pt-2">
                {checkedInTime ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-center animate-in zoom-in-95">
                    <div className="text-emerald-700 font-black text-sm flex items-center justify-center gap-1.5">
                      <FontAwesomeIcon icon={faUserCheck} />
                      <span>INGRESO REGISTRADO EN PUERTA</span>
                    </div>
                    <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                      Hora de ingreso: {checkedInTime}
                    </p>
                  </div>
                ) : isConfirmed ? (
                  <button
                    type="button"
                    onClick={handleCheckIn}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faUserCheck} />
                    <span>MARCAR INGRESO EN PUERTA (CHECK-IN)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleQuickConfirm}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#E30613] hover:bg-[#c40510] text-white font-black text-xs transition-colors shadow-sm cursor-pointer"
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
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <span>Ver Invitación Completa del Invitado</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* En caso de que el ID escaneado no exista */
          <div className="bg-white border border-[#ebd9c8] rounded-3xl shadow-xl p-6 sm:p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 text-2xl">
              <FontAwesomeIcon icon={faQrcode} />
            </div>

            <h2 className="text-xl font-black text-slate-900 mb-1">
              Verificación de Pase
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              El código escaneado no coincide con ningún registro previo. Puedes buscar al colaborador por cédula o nombre:
            </p>

            <form onSubmit={handleSearch} className="space-y-3 mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Número de Cédula o Nombre..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#E30613]"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#E30613] hover:bg-[#c40510] text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faSearch} />
                <span>Buscar Invitado</span>
              </button>
            </form>

            {searchError && (
              <p className="text-xs text-rose-600 font-medium mb-3">{searchError}</p>
            )}

            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-800 underline block"
            >
              Volver a la página principal
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
