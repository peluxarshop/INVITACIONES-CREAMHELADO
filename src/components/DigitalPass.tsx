'use client';

import React, { useState, useEffect } from 'react';
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
  faExternalLinkAlt,
  faCopy,
  faCheck,
  faUtensils,
  faGift,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';
import { EventConfig, Guest } from '@/types';
import { LogoOutlined, StitchedCard } from '@/components/festive/Festive';
import { formatEventSchedule } from '@/lib/timeUtils';

interface DigitalPassProps {
  guest: Guest;
  config: EventConfig;
}

export const DigitalPass: React.FC<DigitalPassProps> = ({ guest, config }) => {
  const [qrUrl, setQrUrl] = useState(`https://meals.peluxar.com/pase/${guest.id}`);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      if (!origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        setQrUrl(`${origin}/pase/${guest.id}`);
      } else {
        setQrUrl(`https://meals.peluxar.com/pase/${guest.id}`);
      }
    }
  }, [guest.id]);

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
      `Pase de Entrada VIP para ${guest.fullName}.\nCódigo de Vestimenta: ${config.dressCode}\nLugar: ${config.locationName} (${config.locationAddress})\nVer Pase: ${qrUrl}`
    );
    const location = encodeURIComponent(`${config.locationName}, ${config.locationAddress}`);
    const dateFormatted = config.eventDate.replace(/-/g, '');
    const startTime = (config.eventTime || '14:00').replace(':', '').slice(0, 4) + '00';
    const endTime = (config.eventEndTime || '18:00').replace(':', '').slice(0, 4) + '00';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateFormatted}T${startTime}/${dateFormatted}T${endTime}&details=${details}&location=${location}`;
  };

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-6 animate-in fade-in duration-300">
      <StitchedCard bodyClassName="overflow-hidden">
        {/* Franja superior de caramelo */}
        <div className="h-3 w-full candy-stripe" aria-hidden="true" />

        <div className="p-6 sm:p-7">
          {/* Encabezado con Logo y estado */}
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4 mb-4">
            <LogoOutlined className="w-28 h-12" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crem-green text-white font-display text-sm uppercase tracking-wider shadow-sm">
              <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
              <span>Confirmado</span>
            </div>
          </div>

          <div className="text-center mb-4">
            <span className="font-display uppercase text-xs tracking-widest text-crem-red block">
              Pase Digital VIP Oficial
            </span>
            <h2 className="font-display text-slate-900 text-xl leading-tight mt-0.5">
              {config.eventName}
            </h2>
          </div>

          {/* Nombre y Cédula */}
          <div className="bg-[#FAF6EE] rounded-2xl p-4 border border-[#e5d8c3] mb-5 text-left">
            <span className="font-display uppercase text-xs tracking-wider text-crem-green block">
              Invitado(a) de Honor
            </span>
            <div className="font-display text-slate-900 text-2xl sm:text-3xl leading-none mt-1 break-words">
              {guest.fullName}
            </div>
            {guest.cedula && (
              <div className="text-xs text-slate-700 mt-2 flex items-center gap-2">
                <span className="font-bold">C.C. / Identificación:</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                  {guest.cedula}
                </span>
              </div>
            )}
            {guest.area && (
              <div className="text-xs text-slate-700 mt-2 flex items-center gap-2">
                <span className="font-bold">Área:</span>
                <span className="font-semibold text-slate-900 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                  {guest.area}
                </span>
              </div>
            )}
          </div>

          {/* Detalles del Evento */}
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 mb-6 text-left">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-crem-red text-white flex items-center justify-center shrink-0 mt-0.5">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
              </div>
              <div>
                <p className="font-bold text-slate-900 capitalize">{formatDate(config.eventDate)}</p>
                <p className="text-slate-500 text-xs">Horario: {formatEventSchedule(config.eventTime, config.eventEndTime)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-crem-green text-white flex items-center justify-center shrink-0 mt-0.5">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{config.locationName}</p>
                <p className="text-slate-500 text-xs">{config.locationAddress}</p>
              </div>
            </div>

            {config.dressCode && (
              <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
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
          <div className="relative my-6 -mx-7 flex items-center">
            <div className="w-4 h-7 rounded-r-full bg-crem-green-mid border-r border-y border-crem-green-dark" />
            <div className="flex-1 border-t-2 border-dashed border-slate-300 mx-2" />
            <div className="w-4 h-7 rounded-l-full bg-crem-green-mid border-l border-y border-crem-green-dark" />
          </div>

          {/* Código QR */}
          <div className="flex flex-col items-center justify-center text-center">
            <span className="font-display uppercase text-xs tracking-wider text-crem-green mb-2.5 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faShieldAlt} className="text-crem-red" />
              <span>Código QR de Acceso Oficial</span>
            </span>

            <div className="p-3.5 bg-white rounded-2xl shadow-xl border-4 border-crem-green">
              <QRCodeSVG
                value={qrUrl}
                size={170}
                level="M"
                includeMargin={false}
              />
            </div>

            <p className="font-display text-slate-900 text-base mt-3">
              Presenta este código en la entrada
            </p>
            <p className="text-xs text-slate-500 max-w-xs mt-0.5">
              Escanea con la cámara del celular para registro inmediato
            </p>

            <div className="flex items-center gap-2 mt-4 w-full justify-center">
              <a
                href={qrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-crem-green text-white text-xs font-bold hover:bg-crem-green-dark transition-colors shadow-sm"
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[10px]" />
                <span>Abrir en Celular</span>
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors border border-slate-300 cursor-pointer"
              >
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} className={copied ? 'text-crem-green' : ''} />
                <span>{copied ? '¡Copiado!' : 'Copiar Enlace'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Acciones del pase */}
        <div className="bg-[#FAF6EE] p-4 border-t-2 border-slate-100 flex flex-col sm:flex-row gap-2.5">
          <a
            href={getCalendarLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-crem-red text-white font-display text-base tracking-wide shadow-[0_4px_0_#8E0A12] hover:translate-y-0.5 active:translate-y-1 transition-all"
          >
            <FontAwesomeIcon icon={faCalendarPlus} />
            <span>Añadir a Calendario</span>
          </a>

          {config.mapsUrl && (
            <a
              href={config.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-crem-green-dark font-display text-base tracking-wide border-2 border-crem-green hover:bg-crem-green/10 transition-colors"
            >
              <FontAwesomeIcon icon={faMapMarkedAlt} className="text-crem-green" />
              <span>Ver en Maps</span>
            </a>
          )}
        </div>
      </StitchedCard>

      <div className="text-center mt-3 text-xs text-white/90 font-medium">
        💡 <strong className="text-white">Tip:</strong> Toma una captura de pantalla a este pase para tenerlo listo en la entrada.
      </div>
    </div>
  );
};
