import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faChartLine,
  faTruck,
  faBriefcase,
  faWrench,
  faBuilding,
  faSitemap,
} from '@fortawesome/free-solid-svg-icons';
import { DashboardMetrics, Guest } from '@/types';

interface AdminKpiCardsProps {
  metrics: DashboardMetrics;
  guests?: Guest[];
}

const AREAS = [
  { name: 'Logística', icon: faTruck, color: 'text-blue-600', bg: 'bg-blue-50', bar: 'bg-blue-500' },
  { name: 'Comercial', icon: faBriefcase, color: 'text-amber-600', bg: 'bg-amber-50', bar: 'bg-amber-500' },
  { name: 'Mantenimiento', icon: faWrench, color: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-500' },
  { name: 'Administración', icon: faBuilding, color: 'text-rose-600', bg: 'bg-rose-50', bar: 'bg-rose-500' },
] as const;

export const AdminKpiCards: React.FC<AdminKpiCardsProps> = ({ metrics, guests = [] }) => {
  const confirmedGuests = guests.filter((g) => g.status === 'confirmed');
  const totalConfirmed = confirmedGuests.length || metrics.confirmed;

  const areaCounts = AREAS.map((area) => {
    const count = confirmedGuests.filter((g) => g.area === area.name).length;
    const percentage = totalConfirmed > 0 ? Math.round((count / totalConfirmed) * 100) : 0;
    return {
      ...area,
      count,
      percentage,
    };
  });

  const unassignedCount = confirmedGuests.filter((g) => !g.area || !AREAS.some((a) => a.name === g.area)).length;

  return (
    <div className="space-y-6 mb-8">
      {/* 1. Métricas Principales */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Invitados */}
        <div className="col-span-2 sm:col-span-1 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Invitados
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#005CA9] flex items-center justify-center">
              <FontAwesomeIcon icon={faUsers} className="text-sm" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{metrics.total}</div>
          <div className="text-[11px] text-slate-400 mt-1">Base de datos cargada</div>
        </div>

        {/* Confirmados (SÍ) */}
        <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Confirmados
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FontAwesomeIcon icon={faCheckCircle} className="text-sm" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {metrics.confirmed}
          </div>
          <div className="text-[11px] text-emerald-700/80 mt-1">Con pase VIP generado</div>
        </div>

        {/* No Asisten (NO) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              No Asisten
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E30613] flex items-center justify-center">
              <FontAwesomeIcon icon={faTimesCircle} className="text-sm" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-800">
            {metrics.declined}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Declinaron invitación</div>
        </div>

        {/* Pendientes */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Por Confirmar
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-sm" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">
            {metrics.pending}
          </div>
          <div className="text-[11px] text-amber-700/80 mt-1">Pendientes de respuesta</div>
        </div>

        {/* Tasa de Asistencia */}
        <div className="col-span-2 lg:col-span-1 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              % Asistencia
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E30613] flex items-center justify-center">
              <FontAwesomeIcon icon={faChartLine} className="text-sm" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#E30613]">
            {metrics.confirmationRate}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div
              className="bg-[#E30613] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${metrics.confirmationRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. KPI Específico: Asistentes Confirmados por Área */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-crem-red flex items-center justify-center text-sm shadow-xs">
              <FontAwesomeIcon icon={faSitemap} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Asistentes Confirmados por Área
              </h3>
              <p className="text-xs text-slate-500">
                Distribución en tiempo real de colaboradores con pase VIP generado por departamento
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            <span>Total Confirmados:</span>
            <span className="text-crem-red font-black text-sm">{totalConfirmed}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {areaCounts.map((area) => (
            <div
              key={area.name}
              className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  {area.name}
                </span>
                <div className={`w-7 h-7 rounded-lg ${area.bg} ${area.color} flex items-center justify-center text-xs`}>
                  <FontAwesomeIcon icon={area.icon} />
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{area.count}</span>
                <span className="text-xs font-bold text-slate-500">
                  {area.percentage}%
                </span>
              </div>

              <div className="w-full bg-slate-200/80 rounded-full h-2 mt-2.5 overflow-hidden">
                <div
                  className={`${area.bar} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${area.percentage}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 mt-1.5">
                {area.count === 1 ? '1 colaborador' : `${area.count} colaboradores`}
              </div>
            </div>
          ))}
        </div>

        {unassignedCount > 0 && (
          <div className="mt-3 text-[11px] text-slate-500 text-right">
            * Hay {unassignedCount} colaborador(es) confirmado(s) pendiente(s) por asignación de área.
          </div>
        )}
      </div>
    </div>
  );
};
