import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import { DashboardMetrics } from '@/types';

interface AdminKpiCardsProps {
  metrics: DashboardMetrics;
}

export const AdminKpiCards: React.FC<AdminKpiCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
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
  );
};
