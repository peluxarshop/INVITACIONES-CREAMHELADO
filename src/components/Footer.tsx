import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer
      className={`w-full py-6 px-4 text-center border-t border-slate-200 bg-white/95 text-slate-600 backdrop-blur-md ${className}`}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5 flex-wrap justify-center text-slate-700">
          <span>Desarrollado con</span>
          <FontAwesomeIcon icon={faHeart} className="text-[#E30613] animate-pulse" />
          <span>en Medellín .Co por</span>
          <span className="font-bold text-slate-900 tracking-wide">
            Lenipseart Developer
          </span>
        </div>

        <a
          href="https://wa.me/573208048128?text=Hola%20Lenipseart%20Developer%2C%20vi%20tu%20sistema%20de%20invitaciones%20y%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 font-semibold text-xs transition-all hover:scale-105 shadow-xs"
        >
          <FontAwesomeIcon icon={faWhatsapp} className="text-emerald-600 text-sm" />
          <span>Contacto: 320 804 8128 (WhatsApp)</span>
        </a>
      </div>
    </footer>
  );
};
