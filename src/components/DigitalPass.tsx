'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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
  faIceCream,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';
import { EventConfig, Guest } from '@/types';

interface DigitalPassProps {
  guest: Guest;
  config: EventConfig;
}

export const DigitalPass: React.FC<DigitalPassProps> = ({ guest, config }) => {
  // Inicializamos por defecto con el dominio oficial de producción
  const [qrUrl, setQrUrl] = useState(`https://meals.peluxar.com/pase/${guest.id}`);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      // Si estamos en localhost, mantenemos el dominio público de producción
      // para que al escanear con la cámara del celular siempre abra el pase real
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
    const startTime = config.eventTime.replace(':', '') + '00';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateFormatted}T${startTime}/${dateFormatted}T235900&details=${details}&location=${location}`;
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
      {/* Tarjeta del Pase VIP - Estilo Oficial Corporativo Crem Helado */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-[#ebd9c8] shadow-2xl">
        {/* Adorno superior festivo: Franja roja Crem Helado y oro festivo */}
        <div className="h-3.5 bg-gradient-to-r from-[#E30613] via-[#D4AF37] to-[#005CA9]" />

        <div className="p-6 sm:p-8">
          {/* Encabezado con Logo Oficial de Recursos */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div className="relative w-36 h-12">
              <Image
                src="/logo-cremhelado.png"
                alt="Crem Helado"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600" />
              <span>Confirmado</span>
            </div>
          </div>

          <div className="text-center mb-4">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#E30613] block">
              Pase Digital VIP Oficial
            </span>
            <h2 className="text-sm font-bold text-slate-800 mt-0.5">
              {config.eventName}
            </h2>
          </div>

          {/* Nombre y Cédula */}
          <div className="bg-[#faf8f5] rounded-2xl p-4 border border-[#ebd9c8] mb-5">
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

          {/* Beneficios Incluidos */}
          <div className="grid grid-cols-2 gap-2 text-xs mb-5">
            <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-100 flex items-center gap-2 text-slate-800">
              <FontAwesomeIcon icon={faUtensils} className="text-[#E30613]" />
              <span className="font-bold">Cena de Gala</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center gap-2 text-slate-800">
              <FontAwesomeIcon icon={faGift} className="text-[#B45309]" />
              <span className="font-bold">Rifas y Premios</span>
            </div>
          </div>

          {/* Detalles del Evento */}
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E30613] flex items-center justify-center shrink-0 mt-0.5">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
              </div>
              <div>
                <p className="font-bold text-slate-900 capitalize">{formatDate(config.eventDate)}</p>
                <p className="text-slate-500 text-xs">Hora de inicio: {config.eventTime} hrs (7:00 PM)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E30613] flex items-center justify-center shrink-0 mt-0.5">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{config.locationName}</p>
                <p className="text-slate-500 text-xs">{config.locationAddress}</p>
              </div>
            </div>

            {config.dressCode && (
              <div className="flex items-start gap-3 pt-1">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E30613] flex items-center justify-center shrink-0 mt-0.5">
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
            <div className="w-5 h-8 rounded-r-full bg-[#faf8f5] border-r border-y border-[#ebd9c8]" />
            <div className="flex-1 border-t-2 border-dashed border-slate-300 mx-2" />
            <div className="w-5 h-8 rounded-l-full bg-[#faf8f5] border-l border-y border-[#ebd9c8]" />
          </div>

          {/* Código QR para ingreso rápido (URL directa escaneable con cámara) */}
          <div className="flex flex-col items-center justify-center pt-1 text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#E30613] mb-2 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faShieldAlt} />
              <span>Código QR de Acceso Oficial</span>
            </span>

            <div className="p-4 bg-white rounded-2xl shadow-lg border-2 border-slate-200 hover:border-[#E30613] transition-all">
              <QRCodeSVG
                value={qrUrl}
                size={160}
                level="M"
                includeMargin={false}
              />
            </div>

            <p className="text-xs text-slate-800 font-bold mt-3">
              Escanea este código con la cámara de tu celular
            </p>
            <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
              Abre automáticamente tu verificación y registro de ingreso en la puerta
            </p>

            {/* Acciones directas sobre el enlace */}
            <div className="flex items-center gap-2 mt-3 w-full justify-center">
              <a
                href={qrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#005CA9] text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-200"
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[10px]" />
                <span>Abrir Pase en Celular</span>
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors border border-slate-300 cursor-pointer"
              >
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} className={copied ? 'text-emerald-600' : ''} />
                <span>{copied ? '¡Copiado!' : 'Copiar Enlace'}</span>
              </button>
            </div>

            <p className="font-mono text-[10px] text-slate-400 mt-2 break-all">
              {qrUrl}
            </p>
          </div>
        </div>

        {/* Acciones del pase */}
        <div className="bg-[#faf8f5] p-4 border-t border-[#ebd9c8] flex flex-col sm:flex-row gap-2.5">
          <a
            href={getCalendarLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#E30613] hover:bg-[#c40510] text-white font-bold text-xs transition-colors shadow-sm"
          >
            <FontAwesomeIcon icon={faCalendarPlus} />
            <span>Añadir a Calendario</span>
          </a>

          {config.mapsUrl && (
            <a
              href={config.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 transition-colors shadow-xs"
            >
              <FontAwesomeIcon icon={faMapMarkedAlt} className="text-[#E30613]" />
              <span>Ver en Google Maps</span>
            </a>
          )}
        </div>
      </div>

      <div className="text-center mt-3 text-xs text-slate-500">
        💡 <strong className="text-slate-700">Tip:</strong> Toma una captura de pantalla a este pase para tenerlo a mano en la entrada del evento.
      </div>
    </div>
  );
};
