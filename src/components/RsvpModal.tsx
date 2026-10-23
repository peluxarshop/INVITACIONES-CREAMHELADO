'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faTimesCircle,
  faUser,
  faIdCard,
  faEnvelope,
  faHeart,
  faExclamationCircle,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';
import { Guest } from '@/types';
import { StitchedCard } from '@/components/festive/Festive';

interface RsvpModalProps {
  isOpen: boolean;
  type: 'confirm' | 'decline';
  guest: Guest;
  companyName: string;
  onClose: () => void;
  onConfirmSuccess: (data: { fullName: string; cedula: string; email: string; area: string }) => Promise<void>;
  onDeclineSuccess: (reason?: string) => Promise<void>;
}

export const RsvpModal: React.FC<RsvpModalProps> = ({
  isOpen,
  type,
  guest,
  companyName,
  onClose,
  onConfirmSuccess,
  onDeclineSuccess,
}) => {
  const [fullName, setFullName] = useState(guest.fullName || '');
  const [cedula, setCedula] = useState(guest.cedula || '');
  const [email, setEmail] = useState(guest.email || '');
  const [area, setArea] = useState(guest.area || '');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const launchCelebrationConfetti = () => {
    try {
      const end = Date.now() + 2.5 * 1000;
      const colors = ['#E30613', '#0B8A3E', '#FFFFFF', '#F2C94C'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!cedula.trim()) {
      setError('Por favor ingresa tu número de cédula para el control de acceso.');
      return;
    }
    if (!area.trim()) {
      setError('Por favor selecciona tu Área de trabajo.');
      return;
    }

    try {
      setLoading(true);
      await onConfirmSuccess({
        fullName: fullName.trim(),
        cedula: cedula.trim(),
        email: email.trim(),
        area: area.trim(),
      });
      launchCelebrationConfetti();
      onClose();
    } catch {
      setError('Hubo un error al confirmar tu asistencia. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onDeclineSuccess(reason.trim());
      onClose();
    } catch {
      setError('Hubo un error registrando tu respuesta. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg">
        <StitchedCard bodyClassName="overflow-hidden">
          <div className="h-3 w-full candy-stripe" aria-hidden="true" />

          <div className="p-6 sm:p-8">
            {type === 'confirm' ? (
              <div>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-crem-red text-white flex items-center justify-center text-xl shrink-0 shadow-md">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                  <div>
                    <h3 className="font-display text-slate-900 text-2xl sm:text-3xl leading-none">
                      ¡Genial que nos acompañes!
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Ingresa tus datos para generar tu pase oficial
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-crem-red text-xs font-bold flex items-center gap-2">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleConfirmSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                      <FontAwesomeIcon icon={faUser} className="text-crem-red text-xs" />
                      <span>Nombre Completo *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-crem-green focus:bg-white text-sm transition-all"
                      placeholder="Ej: Juan David Pérez Gómez"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                      <FontAwesomeIcon icon={faIdCard} className="text-crem-red text-xs" />
                      <span>Número de Cédula / Documento *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={cedula}
                      onChange={(e) => setCedula(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-crem-green focus:bg-white text-sm transition-all"
                      placeholder="Ej: 1020304050"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Requerido para control de acceso y seguridad en portería.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                      <FontAwesomeIcon icon={faBuilding} className="text-crem-green text-xs" />
                      <span>Área *</span>
                    </label>
                    <select
                      required
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 focus:outline-none focus:border-crem-green focus:bg-white text-sm transition-all cursor-pointer font-medium"
                    >
                      <option value="" disabled>Selecciona tu área...</option>
                      <option value="Logística">Logística</option>
                      <option value="Comercial">Comercial</option>
                      <option value="Mantenimiento">Mantenimiento</option>
                      <option value="Administración">Administración</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                      <FontAwesomeIcon icon={faEnvelope} className="text-crem-green text-xs" />
                      <span>Correo Electrónico (para enviarte tu pase)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-crem-green focus:bg-white text-sm transition-all"
                      placeholder="juan.perez@cremhelado.com.co"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={loading}
                      className="px-4 py-2.5 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-crem-red hover:bg-crem-red-dark text-white font-display text-base tracking-wide shadow-[0_4px_0_#8E0A12] hover:translate-y-0.5 active:translate-y-1 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faCheckCircle} />
                      <span>{loading ? 'Confirmando...' : '¡Confirmar Asistencia!'}</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-crem-red flex items-center justify-center text-xl shrink-0">
                    <FontAwesomeIcon icon={faHeart} />
                  </div>
                  <div>
                    <h3 className="font-display text-slate-900 text-2xl sm:text-3xl leading-none">
                      Te extrañaremos en la fiesta
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Agradecemos que nos avises para coordinar el catering
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#e5d8c3] text-xs text-slate-700 mb-5 leading-relaxed">
                  Sabemos que a veces se presentan compromisos y viajes imprevistos. Desde ya,{' '}
                  <strong className="text-slate-900">{companyName}</strong> te agradece inmensamente por toda
                  tu entrega, pasión y esfuerzo en este gran año.
                </div>

                <form onSubmit={handleDeclineSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      ¿Deseas dejarnos un mensaje o motivo? (Opcional)
                    </label>
                    <textarea
                      rows={2}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-400 focus:bg-white"
                      placeholder="Ej: Compromiso familiar fuera de la ciudad..."
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={loading}
                      className="px-4 py-2.5 rounded-full text-slate-500 hover:text-slate-800 text-xs font-bold cursor-pointer"
                    >
                      Regresar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-display text-sm tracking-wide transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faTimesCircle} />
                      <span>{loading ? 'Guardando...' : 'Confirmar no asistencia'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </StitchedCard>
      </div>
    </div>
  );
};
