'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faFileCsv,
  faCog,
  faSyncAlt,
  faExternalLinkAlt,
  faIceCream,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { EventConfig, Guest, GuestStatus, DashboardMetrics } from '@/types';
import { AdminKpiCards } from '@/components/admin/AdminKpiCards';
import { AdminGuestTable } from '@/components/admin/AdminGuestTable';
import { AdminCsvUpload } from '@/components/admin/AdminCsvUpload';
import { AdminEventConfig } from '@/components/admin/AdminEventConfig';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { Footer } from '@/components/Footer';
import { SnowEffect } from '@/components/SnowEffect';
import {
  fetchEventConfig,
  saveEventConfig,
  fetchGuests,
  addGuest,
  addGuestsBulk,
  deleteGuest,
  updateGuestStatus,
  DEFAULT_CONFIG,
} from '@/lib/dataService';

export const AdminClient: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'guests' | 'csv' | 'config'>('guests');
  const [config, setConfig] = useState<EventConfig>(DEFAULT_CONFIG);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Verificar autenticación
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('cremhelado_admin_auth_token') : null;
    setIsAuthenticated(Boolean(token));
  }, []);

  const loadAll = async () => {
    try {
      const [loadedConfig, loadedGuests] = await Promise.all([
        fetchEventConfig(),
        fetchGuests(),
      ]);
      setConfig(loadedConfig);
      setGuests(loadedGuests);
    } catch (e) {
      console.error('Error cargando datos del admin:', e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAll();
    }
  }, [isAuthenticated]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadAll();
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cremhelado_admin_auth_token');
    }
    setIsAuthenticated(false);
  };

  // KPIs
  const total = guests.length;
  const confirmed = guests.filter((g) => g.status === 'confirmed').length;
  const declined = guests.filter((g) => g.status === 'declined').length;
  const pending = guests.filter((g) => g.status === 'pending').length;
  const confirmationRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;

  const metrics: DashboardMetrics = {
    total,
    confirmed,
    declined,
    pending,
    confirmationRate,
  };

  const handleAddGuest = async (newGuest: Omit<Guest, 'id' | 'createdAt'>) => {
    const created = await addGuest(newGuest);
    setGuests((prev) => [created, ...prev]);
  };

  const handleDeleteGuest = async (id: string) => {
    await deleteGuest(id);
    setGuests((prev) => prev.filter((g) => g.id !== id));
  };

  const handleStatusChange = async (id: string, status: GuestStatus) => {
    const updated = await updateGuestStatus(id, status);
    if (updated) {
      setGuests((prev) => prev.map((g) => (g.id === id ? updated : g)));
    }
  };

  const handleBulkImport = async (newGuests: Array<Omit<Guest, 'id' | 'createdAt'>>) => {
    const created = await addGuestsBulk(newGuests);
    setGuests((prev) => [...created, ...prev]);
    setActiveTab('guests');
  };

  const handleSaveConfig = async (newConfig: EventConfig) => {
    const saved = await saveEventConfig(newConfig);
    setConfig(saved);
  };

  // Pantalla de carga mientras se verifica la sesión
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#fbfbfc] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#E30613] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Si no está autenticado, muestra el formulario de login protegido
  if (!isAuthenticated) {
    return <AdminLoginForm onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbfbfc] text-slate-800 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#E30613] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-semibold text-sm">Cargando panel de administración...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6ee] text-slate-800 flex flex-col selection:bg-[#E30613] selection:text-white relative overflow-hidden">
      {/* Efecto de Nieve Suave */}
      <SnowEffect />

      {/* Franja festiva superior caramelo */}
      <div className="relative z-50 h-2 w-full candy-stripe" />

      {/* Header del Administrador */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#ebd9c8] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-36 h-10 shrink-0">
              <Image
                src="/logo-cremhelado.png"
                alt="Crem Helado"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <div className="hidden sm:block border-l border-slate-200 pl-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#E30613] tracking-wide uppercase">
                  Panel Administrativo
                </span>
                <span className="text-[10px] font-black text-[#006837] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Sueño de Navidad
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Gestión de Invitaciones &bull; Celebración Fin de Año 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
              title="Actualizar datos"
            >
              <FontAwesomeIcon icon={faSyncAlt} className={`text-xs ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <Link
              href="/invitacion"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 transition-all hover:scale-105"
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs text-[#E30613]" />
              <span className="hidden sm:inline">Ver Invitación Pública</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-[#E30613] text-slate-600 text-xs font-bold border border-slate-200 transition-colors"
              title="Cerrar Sesión"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="text-xs" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas Principales (KPIs) */}
        <AdminKpiCards metrics={metrics} />

        {/* Pestañas de Navegación */}
        <div className="flex border-b border-slate-200 mb-6 gap-2 sm:gap-4 overflow-x-auto text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('guests')}
            className={`inline-flex items-center gap-2 pb-3 px-3 font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'guests'
                ? 'border-[#E30613] text-[#E30613]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FontAwesomeIcon icon={faUsers} />
            <span>Lista de Invitados ({guests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('csv')}
            className={`inline-flex items-center gap-2 pb-3 px-3 font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'csv'
                ? 'border-[#E30613] text-[#E30613]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FontAwesomeIcon icon={faFileCsv} />
            <span>Carga Masiva (CSV)</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`inline-flex items-center gap-2 pb-3 px-3 font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'config'
                ? 'border-[#E30613] text-[#E30613]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FontAwesomeIcon icon={faCog} />
            <span>Configuración del Evento & Marca</span>
          </button>
        </div>

        {/* Vista Activa */}
        {activeTab === 'guests' && (
          <AdminGuestTable
            guests={guests}
            config={config}
            onAddGuest={handleAddGuest}
            onDeleteGuest={handleDeleteGuest}
            onStatusChange={handleStatusChange}
          />
        )}

        {activeTab === 'csv' && (
          <AdminCsvUpload onImportSuccess={handleBulkImport} />
        )}

        {activeTab === 'config' && (
          <AdminEventConfig
            initialConfig={config}
            onSaveConfig={handleSaveConfig}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
