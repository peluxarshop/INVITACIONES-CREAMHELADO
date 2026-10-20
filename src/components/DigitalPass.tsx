'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faClock,
  faMapMarkerAlt,
  faCheckCircle,
  faCalendarPlus,
  faMapMarkedAlt,
  faShirt,
} from '@fortawesome/free-solid-svg-icons';
import { EventConfig, Guest } from '@/types';

interface DigitalPassProps {
  guest: Guest;
  config: EventConfig;
}

export const DigitalPass: React.FC<DigitalPassProps> = ({ guest, config }) => {
  const qrData = JSON.stringify({
    passId: guest.id,
    name: guest.fullName,
    cedula: guest.cedula || 'N/A',
    event: config.eventName,
    verified: true,
  });

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(`${dateStr}T12:00:00`);
      return date.toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getCalendarLink = () => {
    const title = encodeURIComponent(`${config.eventName} - ${config.companyName}`);
    const details = encodeURIComponent(
      `Pase de Entrada VIP para ${guest.fullName}.\nCódigo de Vestimenta: ${config.dressCode}\nLugar: ${config.locationName} (${config.locationAddress})`
    );
    const location = encodeURIComponent(`${config.locationName}, ${config.locationAddress}`);
    const dateFormatted = config.eventDate.replace(/-/g, '');
    const startTime = config.eventTime.replace(':', '') + '00';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateFormatted}T${startTime}/${dateFormatted}T235900&details=${details}&location=${location}`;
  };

  return (
    <div className="w-full max-w-md mx-auto my-6 animate-in fade-in duration-300">
      {/* Tarjeta del Pase VIP - Tema Claro Crem Helado */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl">
        {/* Adorno superior rojo Crem Helado */}
        <div className="h-2.5 bg-[#E30613]" />

        <div className="p-6 sm:p-8">
          {/* Encabezado sin badges cápsula */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#E30613]">
                Pase de Acceso VIP
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">
                {config.companyName}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500" />
              <span>Confirmado</span>
            </div>
          </div>

          {/* Nombre y Cédula */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Invitado(a) de Honor:
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
              {guest.fullName}
            </div>
            {guest.cedula && (
              <div className="text-xs text-slate-600 mt-1.5 flex items-center gap-2">
                <span className="font-semibold text-slate-500">C.C. / Identificación:</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                  {guest.cedula}
                </span>
              </div>
            )}
          </div>

          {/* Detalles del Evento */}
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-red-50 text-[#E30613] flex items-center justify-center shrink-0 mt-0.5">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
              </div>
              <div>
                <p className="font-bold text-slate-900 capitalize">{formatDate(config.eventDate)}</p>
                <p className="text-slate-500 text-xs">Hora de inicio: {config.eventTime} hrs</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-red-50 text-[#E30613] flex items-center justify-center shrink-0 mt-0.5">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{config.locationName}</p>
                <p className="text-slate-500 text-xs">{config.locationAddress}</p>
              </div>
            </div>

            {config.dressCode && (
              <div className="flex items-start gap-3 pt-1">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-[#E30613] flex items-center justify-center shrink-0 mt-0.5">
                  <FontAwesomeIcon icon={faShirt} className="text-xs" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Código de Vestimenta:</span>
                  <span className="text-slate-600 text-xs">{config.dressCode}</span>
                </div>
              </div>
            )}
          </div>

          {/* Línea de corte tipo ticket */}
          <div className="relative my-6 -mx-8 flex items-center">
            <div className="w-5 h-8 rounded-r-full bg-[#fbfbfc] border-r border-y border-slate-200" />
            <div className="flex-1 border-t-2 border-dashed border-slate-300 mx-2" />
            <div className="w-5 h-8 rounded-l-full bg-[#fbfbfc] border-l border-y border-slate-200" />
          </div>

          {/* Código QR para ingreso rápido */}
          <div className="flex flex-col items-center justify-center pt-1">
            <div className="p-3.5 bg-white rounded-2xl shadow-md border border-slate-200">
              <QRCodeSVG
                value={qrData}
                size={140}
                level="M"
                includeMargin={false}
              />
            </div>
            <p className="text-xs text-slate-600 mt-3 text-center font-medium">
              Presenta este código QR en la entrada para tu registro y rifas
            </p>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              ID: {guest.id}
            </p>
          </div>
        </div>

        {/* Acciones del pase */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row gap-2.5">
          <a
            href={getCalendarLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E30613] hover:bg-[#c40510] text-white font-bold text-xs transition-colors shadow-sm"
          >
            <FontAwesomeIcon icon={faCalendarPlus} />
            <span>Añadir a Calendario</span>
          </a>

          {config.mapsUrl && (
            <a
              href={config.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-300 transition-colors"
            >
              <FontAwesomeIcon icon={faMapMarkedAlt} className="text-[#E30613]" />
              <span>Ver en Google Maps</span>
            </a>
          )}
        </div>
      </div>

      <div className="text-center mt-3 text-xs text-slate-500">
        💡 <strong className="text-slate-700">Tip:</strong> Toma una captura de pantalla a este pase para tenerlo a mano el día del evento.
      </div>
    </div>
  );
};
