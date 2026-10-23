'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faClock,
  faMapMarkerAlt,
  faSave,
  faCheckCircle,
  faPalette,
  faBuilding,
  faImage,
  faShirt,
  faMusic,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { EventConfig } from '@/types';

interface AdminEventConfigProps {
  initialConfig: EventConfig;
  onSaveConfig: (config: EventConfig) => Promise<void>;
}

export const AdminEventConfig: React.FC<AdminEventConfigProps> = ({
  initialConfig,
  onSaveConfig,
}) => {
  const [config, setConfig] = useState<EventConfig>(initialConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof EventConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setSavedSuccess(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('logoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await onSaveConfig(config);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch {
      alert('Error guardando la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  const colorPresets = [
    { label: 'Crem Helado Oficial (Rojo & Azul)', primary: '#E30613', secondary: '#005CA9' },
    { label: 'Crem Helado & Amarillo', primary: '#E30613', secondary: '#FFB800' },
    { label: 'Gala Navideña & Oro', primary: '#d97706', secondary: '#fbbf24' },
    { label: 'Esmeralda & Dorado', primary: '#059669', secondary: '#eab308' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600" />
          <span>¡Configuración del evento y marca guardada exitosamente!</span>
        </div>
      )}

      {/* 1. Información General del Evento */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <FontAwesomeIcon icon={faBuilding} className="text-[#E30613]" />
          <span>Información de la Celebración y Empresa</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nombre de la Empresa *
            </label>
            <input
              type="text"
              required
              value={config.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#E30613] focus:bg-white"
              placeholder="Ej: Crem Helado"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Título del Evento / Fiesta *
            </label>
            <input
              type="text"
              required
              value={config.eventName}
              onChange={(e) => handleChange('eventName', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#E30613] focus:bg-white"
              placeholder="Ej: Gran Fiesta de Fin de Año & Despedida"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-[#E30613]" />
              <span>Fecha del Evento *</span>
            </label>
            <input
              type="date"
              required
              value={config.eventDate}
              onChange={(e) => handleChange('eventDate', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#E30613] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faClock} className="text-[#E30613]" />
              <span>Hora de Inicio *</span>
            </label>
            <input
              type="time"
              required
              value={config.eventTime}
              onChange={(e) => handleChange('eventTime', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#E30613] focus:bg-white"
            />
          </div>
        </div>

        {/* Mensaje Motivador */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Mensaje Motivador de la Invitación *
          </label>
          <textarea
            rows={3}
            required
            value={config.motivationalMessage}
            onChange={(e) => handleChange('motivationalMessage', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#E30613] focus:bg-white leading-relaxed"
            placeholder="Mensaje inspirador para el colaborador..."
          />
        </div>
      </div>

      {/* 2. Ubicación y Código de Vestimenta */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#E30613]" />
          <span>Lugar, Acceso y Código de Vestimenta</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nombre del Lugar / Salón *
            </label>
            <input
              type="text"
              required
              value={config.locationName}
              onChange={(e) => handleChange('locationName', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#E30613] focus:bg-white"
              placeholder="Ej: Gran Salón El Poblado"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Dirección Física *
            </label>
            <input
              type="text"
              required
              value={config.locationAddress}
              onChange={(e) => handleChange('locationAddress', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#E30613] focus:bg-white"
              placeholder="Ej: Carrera 43A # 1Sur-188, Medellín"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Enlace de Google Maps / Waze *
            </label>
            <input
              type="url"
              required
              value={config.mapsUrl}
              onChange={(e) => handleChange('mapsUrl', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#E30613] focus:bg-white font-mono"
              placeholder="https://maps.google.com/..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faShirt} className="text-[#E30613]" />
              <span>Código de Vestimenta (Dress Code)</span>
            </label>
            <input
              type="text"
              value={config.dressCode}
              onChange={(e) => handleChange('dressCode', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#E30613] focus:bg-white"
              placeholder="Ej: Como mejor te sientas"
            />
          </div>
        </div>
      </div>

      {/* 3. Personalización de Marca y Colores */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <FontAwesomeIcon icon={faPalette} className="text-[#E30613]" />
          <span>Identidad de Marca y Logo</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faImage} className="text-[#E30613]" />
              <span>Logo de la Empresa (URL o Subir archivo)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={config.logoUrl}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#E30613] focus:bg-white"
                placeholder="https://ejemplo.com/logo.png"
              />
              <label className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer transition-colors shrink-0">
                <span>Subir</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>
            {config.logoUrl && (
              <div className="mt-2.5 p-2 bg-slate-50 rounded-xl inline-block border border-slate-200">
                <img
                  src={config.logoUrl}
                  alt="Vista previa logo"
                  className="h-10 max-w-[150px] object-contain"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Colores Corporativos
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <span className="text-[10px] text-slate-500 font-bold block mb-1">Color Primario</span>
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-300">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={config.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="w-20 font-mono text-xs bg-transparent text-slate-800 font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex-1">
                <span className="text-[10px] text-slate-500 font-bold block mb-1">Color Secundario</span>
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-300">
                  <input
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={config.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    className="w-20 font-mono text-xs bg-transparent text-slate-800 font-bold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Presets rápidos */}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {colorPresets.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    handleChange('primaryColor', p.primary);
                    handleChange('secondaryColor', p.secondary);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-700 font-bold border border-slate-200 cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Plantilla de Mensaje WhatsApp */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <FontAwesomeIcon icon={faWhatsapp} className="text-emerald-600" />
          <span>Plantilla de Mensaje para WhatsApp</span>
        </h3>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700">
              Texto del Mensaje que se enviará con 1 Clic
            </label>
            <div className="flex gap-1 text-[10px]">
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                {'{nombre}'}
              </span>
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                {'{empresa}'}
              </span>
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                {'{link}'}
              </span>
            </div>
          </div>
          <textarea
            rows={3}
            required
            value={config.whatsappTemplate}
            onChange={(e) => handleChange('whatsappTemplate', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#E30613] focus:bg-white leading-relaxed"
          />
        </div>
      </div>

      {/* 5. Música Navideña de Fondo para Invitaciones */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faMusic} className="text-[#E30613]" />
            <span>Música Navideña de Fondo (Invitaciones)</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Libre de derechos de autor (CC-BY)
          </span>
        </h3>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              Activar música ambiental suave en la página de invitación
            </p>
            <p className="text-xs text-slate-500 mt-0.5 max-w-lg leading-relaxed">
              Reproduce una cálida melodía de Navidad instrumental (Jingle Bells Calm en celesta y violín) a volumen suave, con botón flotante para que el invitado pueda pausarla o silenciarla en cualquier momento.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
            <input
              type="checkbox"
              checked={config.musicEnabled ?? true}
              onChange={(e) => setConfig((prev) => ({ ...prev, musicEnabled: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-crem-green"></div>
            <span className="ml-3 text-xs font-bold text-slate-700 min-w-16">
              {config.musicEnabled ?? true ? 'Activada 🎵' : 'Silenciada 🔇'}
            </span>
          </label>
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#E30613] hover:bg-[#c40510] text-white font-black text-sm shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faSave} />
          <span>{isSaving ? 'Guardando Cambios...' : 'Guardar Toda la Configuración'}</span>
        </button>
      </div>
    </form>
  );
};
