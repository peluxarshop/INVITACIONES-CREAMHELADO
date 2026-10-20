'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock,
  faUser,
  faKey,
  faIceCream,
  faArrowRight,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('cremhelado_admin_auth_token', data.token);
        onLoginSuccess();
      } else {
        setError(data.error || 'Credenciales incorrectas');
      }
    } catch {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfc] text-slate-800 flex flex-col justify-center items-center px-4 py-12 relative">
      {/* Fondo suave */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-red-100/60 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#E30613] flex items-center justify-center mx-auto mb-3 text-2xl">
            <FontAwesomeIcon icon={faIceCream} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Acceso Administrativo
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de Invitaciones &bull; Crem Helado
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationCircle} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-[#E30613] text-xs" />
              <span>Usuario Administrador</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#E30613] focus:bg-white text-sm transition-all"
              placeholder="Ingresa tu usuario (ej: admin)"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-2">
              <FontAwesomeIcon icon={faKey} className="text-[#E30613] text-xs" />
              <span>Contraseña</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#E30613] focus:bg-white text-sm transition-all"
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#E30613] hover:bg-[#c40510] text-white font-black text-sm tracking-wide shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faLock} />
              <span>{loading ? 'Verificando...' : 'Iniciar Sesión'}</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Credenciales iniciales por defecto configurables en tu archivo de entorno:
            <br />
            <strong className="text-slate-600">Usuario:</strong> admin | <strong className="text-slate-600">Clave:</strong> cremhelado2026
          </p>
        </div>
      </div>
    </div>
  );
};
