import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`w-full relative z-10 bg-crem-green-deep text-white/85 ${className}`}>
      <div className="h-2.5 w-full candy-stripe" aria-hidden="true" />
      <div className="max-w-5xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-center sm:text-left">
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <span className="font-display text-base text-white tracking-wide">Sueño de Navidad</span>
          <span className="text-white/40">&bull;</span>
          <span>Desarrollado con</span>
          <FontAwesomeIcon icon={faHeart} className="text-[#ff4d57] animate-pulse" />
          <span>en Medellín .Co por</span>
          <span className="font-black text-white tracking-wide">Lenipseart Developer</span>
        </div>

        <a
          href="https://wa.me/573208048128?text=Hola%20Lenipseart%20Developer%2C%20vi%20tu%20sistema%20de%20invitaciones%20y%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-crem-green-dark font-bold text-xs transition-all hover:scale-105 shadow-md"
        >
          <FontAwesomeIcon icon={faWhatsapp} className="text-[#25D366] text-sm" />
          <span>Contacto: 320 804 8128</span>
        </a>
      </div>
    </footer>
  );
};
