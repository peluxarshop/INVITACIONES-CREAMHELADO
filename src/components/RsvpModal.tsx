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
} from '@fortawesome/free-solid-svg-icons';
import { Guest } from '@/types';

interface RsvpModalProps {
  isOpen: boolean;
  type: 'confirm' | 'decline';
  guest: Guest;
  companyName: string;
  onClose: () => void;
  onConfirmSuccess: (data: { fullName: string; cedula: string; email: string }) => Promise<void>;
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
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const launchCelebrationConfetti = () => {
    try {
      const end = Date.now() + 2.5 * 1000;
      const colors = ['#E30613', '#FFB800', '#005CA9', '#10b981', '#f43f5e'];

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

    try {
      setLoading(true);
      await onConfirmSuccess({
        fullName: fullName.trim(),
        cedula: cedula.trim(),
        email: email.trim(),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden text-slate-800">
        {/* Barra superior de acento */}
        <div
          className={`absolute top-0 left-0 right-0 h-2 ${
            type === 'confirm' ? 'bg-[#E30613]' : 'bg-slate-400'
          }`}
        />

        {type === 'confirm' ? (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E30613] flex items-center justify-center text-xl shrink-0">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">¡Genial que nos acompañes!</h3>
                <p className="text-xs text-slate-500">
                  Ingresa tus datos para generar tu pase de acceso oficial
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <FontAwesomeIcon icon={faExclamationCircle} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleConfirmSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} className="text-[#E30613] text-xs" />
                  <span>Nombre Completo *</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#E30613] focus:bg-white text-sm transition-all"
                  placeholder="Ej: Juan David Pérez Gómez"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                  <FontAwesomeIcon icon={faIdCard} className="text-[#E30613] text-xs" />
                  <span>Número de Cédula / Documento *</span>
                </label>
                <input
                  type="text"
                  required
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#E30613] focus:bg-white text-sm transition-all"
                  placeholder="Ej: 1020304050"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Requerido para control de seguridad en portería y rifas.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-[#E30613] text-xs" />
                  <span>Correo Electrónico (para enviarte tu pase)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#E30613] focus:bg-white text-sm transition-all"
                  placeholder="juan.perez@cremhelado.com.co"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E30613] hover:bg-[#c40510] text-white font-black text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>{loading ? 'Confirmando...' : '¡Confirmar mi Asistencia!'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center text-xl shrink-0">
                <FontAwesomeIcon icon={faHeart} className="text-[#E30613]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Te extrañaremos en la fiesta</h3>
                <p className="text-xs text-slate-500">
                  Agradecemos que nos avises para coordinar el catering del evento
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 mb-5 leading-relaxed">
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
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-slate-400 focus:bg-white"
                  placeholder="Ej: Compromiso familiar fuera de la ciudad..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-bold"
                >
                  Regresar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faTimesCircle} />
                  <span>{loading ? 'Guardando...' : 'Confirmar que no podré ir'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
