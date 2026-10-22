import React from 'react';
import Image from 'next/image';

/* =========================================================
   Elementos gráficos de la campaña "Sueño de Navidad"
   - Copos de nieve y destellos
   - Tarjetas cosidas tipo bastón de caramelo
   - Logo oficial con contorno blanco
   - Lockup "SUEÑO de NAVIDAD"
   - Vectores de helados icónicos Crem Helado (Chococono, Polet con mordisco, Aloha frutal, Vasito)
   - Decoraciones flotantes para el background
   ========================================================= */

interface SnowflakeProps {
  className?: string;
  arms?: 6 | 8;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

/** Copo de nieve lineal blanco con ramas en "V", como en los afiches de campaña. */
export const Snowflake: React.FC<SnowflakeProps> = ({
  className = '',
  arms = 8,
  strokeWidth = 5,
  style,
}) => {
  const step = 360 / arms;
  return (
    <svg
      viewBox="-50 -50 100 100"
      className={className}
      style={style}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {Array.from({ length: arms }).map((_, i) => (
        <g key={i} transform={`rotate(${i * step})`}>
          <line x1="0" y1="0" x2="0" y2="-45" />
          <polyline points="-11,-38 0,-27 11,-38" />
          <polyline points="-8,-22 0,-14 8,-22" />
        </g>
      ))}
    </svg>
  );
};

/** Copo de nieve cristalino con centro facetado y puntas triples decorativas. */
export const SnowflakeCrystal: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = 'w-8 h-8',
  style,
}) => (
  <svg
    viewBox="-50 -50 100 100"
    className={className}
    style={style}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <polygon points="0,-10 10,0 0,10 -10,0" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2.5" />
    {[0, 60, 120, 180, 240, 300].map((angle) => (
      <g key={angle} transform={`rotate(${angle})`}>
        <line x1="0" y1="-10" x2="0" y2="-44" strokeWidth="3.5" />
        <polyline points="-10,-35 0,-25 10,-35" strokeWidth="3" />
        <polyline points="-7,-19 0,-13 7,-19" strokeWidth="2.5" />
        <circle cx="0" cy="-44" r="2.2" fill="currentColor" stroke="none" />
      </g>
    ))}
  </svg>
);

/** Destello de 4 puntas. */
export const Sparkle: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = '',
  style,
}) => (
  <svg viewBox="-50 -50 100 100" className={className} style={style} aria-hidden="true" fill="currentColor">
    <path d="M0,-50 C5,-10 10,-5 50,0 C10,5 5,10 0,50 C-5,10 -10,5 -50,0 C-10,-5 -5,-10 0,-50Z" />
  </svg>
);

/* =========================================================
   VECTORES DE HELADOS ICÓNICOS CREM HELADO
   ========================================================= */

/** Vector del legendario Cono Chococono: waffle dorado, swirl de crema, corona de chocolate y maní */
export const ChococonoVector: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = 'w-12 h-16',
  style,
}) => (
  <svg viewBox="0 0 80 120" className={className} style={style} fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="cone-waffle" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
      <linearGradient id="cream-cone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#FEF3C7" />
      </linearGradient>
      <linearGradient id="choco-cone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3E1A0C" />
        <stop offset="100%" stopColor="#1E0C04" />
      </linearGradient>
    </defs>
    <g filter="drop-shadow(0 4px 6px rgba(0,0,0,0.35))">
      {/* Cono de galleta */}
      <path d="M18 45 L40 115 L62 45 Z" fill="url(#cone-waffle)" stroke="#78350F" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Rejilla waffle */}
      <path d="M22 55 L58 55 M26 70 L54 70 M30 85 L50 85 M34 100 L46 100" stroke="#78350F" strokeWidth="1" opacity="0.4" />
      <path d="M25 48 L46 108 M36 48 L50 95 M55 48 L34 108 M44 48 L30 95" stroke="#78350F" strokeWidth="1" opacity="0.3" />
      {/* Bola de helado crema */}
      <path d="M20 46 C16 38 22 28 32 26 C36 18 48 18 52 25 C60 27 64 36 60 46 Z" fill="url(#cream-cone)" stroke="#FDE68A" strokeWidth="1" />
      {/* Capa de chocolate con caída irregular */}
      <path d="M20 40 C20 28 28 14 40 12 C52 14 60 28 60 40 C57 44 54 41 51 45 C48 49 45 42 41 46 C37 50 33 42 29 46 C25 50 21 44 20 40 Z" fill="url(#choco-cone)" stroke="#170802" strokeWidth="1.2" />
      {/* Brillo */}
      <path d="M30 18 C35 15 45 15 49 19 C44 18 36 19 30 22 Z" fill="#FFFFFF" opacity="0.5" />
      {/* Maní dorado */}
      <circle cx="28" cy="27" r="2" fill="#FDE047" stroke="#78350F" strokeWidth="0.5" />
      <circle cx="44" cy="22" r="2.2" fill="#FDE047" stroke="#78350F" strokeWidth="0.5" />
      <circle cx="36" cy="33" r="1.8" fill="#FDE047" stroke="#78350F" strokeWidth="0.5" />
      <circle cx="50" cy="32" r="2" fill="#FDE047" stroke="#78350F" strokeWidth="0.5" />
      <circle cx="25" cy="36" r="1.5" fill="#FDE047" stroke="#78350F" strokeWidth="0.5" />
    </g>
  </svg>
);

/** Vector de Paleta Polet: cubierta de chocolate intenso con mordisco en la esquina */
export const PoletVector: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = 'w-10 h-16',
  style,
}) => (
  <svg viewBox="0 0 70 120" className={className} style={style} fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="polet-wood" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#E2B784" />
        <stop offset="50%" stopColor="#F5D0A9" />
        <stop offset="100%" stopColor="#C99863" />
      </linearGradient>
      <linearGradient id="polet-dark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4A1E0E" />
        <stop offset="50%" stopColor="#351408" />
        <stop offset="100%" stopColor="#1E0A04" />
      </linearGradient>
    </defs>
    {/* Palito */}
    <rect x="30" y="72" width="10" height="42" rx="5" fill="url(#polet-wood)" stroke="#9A6B38" strokeWidth="1" />
    <line x1="35" y1="78" x2="35" y2="108" stroke="#C99863" strokeWidth="1" strokeDasharray="4 3" />
    <g filter="drop-shadow(0 4px 6px rgba(0,0,0,0.35))">
      {/* Vainilla visible en el mordisco */}
      <path
        d="M15 32 C15 18 24 10 38 10 C46 10 52 14 55 19 C52 23 54 27 50 31 C46 34 49 39 45 42 C42 45 44 50 40 52 L55 52 L55 64 C55 72 48 76 40 76 L30 76 C22 76 15 72 15 64 Z"
        fill="#FEF3C7"
      />
      {/* Capa de chocolate con festoneado de mordisco */}
      <path
        d="M15 32 C15 18 24 10 38 10 C43 10 47 12 50 15 C47 19 50 23 46 27 C42 30 45 35 41 38 C38 41 40 46 37 49 L55 49 L55 64 C55 72 48 76 40 76 L30 76 C22 76 15 72 15 64 Z"
        fill="url(#polet-dark)"
        stroke="#1E0A04"
        strokeWidth="1.2"
      />
      {/* Brillo lateral */}
      <path d="M20 22 C20 18 24 15 28 14 C22 17 21 28 21 48 L21 60 C21 61 20 60 20 58 Z" fill="#FFFFFF" opacity="0.4" />
      {/* Gotitas de chocolate */}
      <circle cx="53" cy="35" r="1.5" fill="#351408" />
      <circle cx="47" cy="47" r="1.2" fill="#351408" />
    </g>
  </svg>
);

/** Vector de Paleta Frutal Aloha: franjas rojo fresa, amarillo y verde refrescante */
export const AlohaVector: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = 'w-10 h-16',
  style,
}) => (
  <svg viewBox="0 0 70 120" className={className} style={style} fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="aloha-red" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="40%" stopColor="#E30613" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
      <linearGradient id="aloha-yellow" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>
      <linearGradient id="aloha-green" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="50%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    {/* Palito */}
    <rect x="30" y="75" width="10" height="38" rx="5" fill="#E2B784" stroke="#9A6B38" strokeWidth="1" />
    <g filter="drop-shadow(0 4px 6px rgba(0,0,0,0.35))">
      {/* Sección roja */}
      <path d="M18 48 L18 30 C18 16 26 10 35 10 C44 10 52 16 52 30 L52 48 Z" fill="url(#aloha-red)" stroke="#7F1D1D" strokeWidth="1" />
      {/* Sección amarilla */}
      <rect x="18" y="48" width="34" height="15" fill="url(#aloha-yellow)" stroke="#A16207" strokeWidth="0.8" />
      {/* Sección verde */}
      <path d="M18 63 L18 72 C18 76 22 78 27 78 L43 78 C48 78 52 76 52 72 L52 63 Z" fill="url(#aloha-green)" stroke="#065F46" strokeWidth="1" />
      {/* Ranuras de hielo */}
      <line x1="28" y1="18" x2="28" y2="72" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <line x1="42" y1="18" x2="42" y2="72" stroke="#000000" strokeWidth="1.5" opacity="0.15" strokeLinecap="round" />
      <circle cx="24" cy="26" r="1.3" fill="#FFFFFF" opacity="0.8" />
    </g>
  </svg>
);

/** Vector de Copa / Vasito Crem Helado con espiral de crema suave y cereza */
export const CopaHeladoVector: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = 'w-12 h-14',
  style,
}) => (
  <svg viewBox="0 0 80 100" className={className} style={style} fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="cup-red" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="50%" stopColor="#E30613" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
    </defs>
    <g filter="drop-shadow(0 4px 6px rgba(0,0,0,0.35))">
      {/* Crema suave */}
      <path d="M22 52 C20 42 26 34 34 32 C36 24 45 22 50 28 C58 30 60 40 58 52 Z" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1" />
      <path d="M28 42 C32 38 48 38 52 42" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
      {/* Cereza */}
      <path d="M38 22 C37 18 41 14 45 15 C49 16 50 20 47 24 C44 26 39 25 38 22 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
      <circle cx="43" cy="18" r="1" fill="#FFFFFF" opacity="0.7" />
      <path d="M46 15 Q52 10 54 6" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" />
      {/* Vaso rojo */}
      <path d="M16 50 L23 88 C24 92 27 94 31 94 L49 94 C53 94 56 92 57 88 L64 50 Z" fill="url(#cup-red)" stroke="#7F1D1D" strokeWidth="1.2" />
      {/* Onda blanca Crem Helado */}
      <path d="M18 64 Q40 72 62 64 L60 72 Q40 80 20 72 Z" fill="#FFFFFF" opacity="0.9" />
      <ellipse cx="40" cy="50" rx="24" ry="4" fill="#FEF2F2" stroke="#E30613" strokeWidth="1" />
    </g>
  </svg>
);

/* =========================================================
   DECORACIÓN FLOTANTE DISPERSA PARA EL BACKGROUND
   ========================================================= */

/**
 * Elementos decorativos dispersos en el fondo:
 * Heladitos icónicos (Chococonos, Polet con mordisco, Aloha, Copas)
 * y copos de nieve de varios tamaños, sutiles y desordenados para ambientar el fondo.
 */
export const FestiveScatteredDecor: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`} aria-hidden="true">
    {/* --- Lateral Izquierdo Superior --- */}
    <div className="absolute top-[6%] left-[2%] sm:left-[4%] opacity-85 hover:opacity-100 transition-opacity animate-float-slow -rotate-12">
      <ChococonoVector className="w-12 h-16 sm:w-16 sm:h-24 drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]" />
    </div>
    <div className="absolute top-[16%] left-[3%] sm:left-[7%] text-white/80 animate-twinkle">
      <Snowflake arms={6} className="w-10 h-10 sm:w-14 sm:h-14 drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]" />
    </div>
    <div className="absolute top-[26%] left-[2%] sm:left-[3%] opacity-85 animate-float-slow rotate-45" style={{ animationDelay: '1.2s' }}>
      <AlohaVector className="w-10 h-16 sm:w-13 sm:h-22 drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]" />
    </div>
    <div className="absolute top-[36%] left-[3%] sm:left-[6%] text-white/75 animate-twinkle" style={{ animationDelay: '2.5s' }}>
      <SnowflakeCrystal className="w-9 h-9 sm:w-12 sm:h-12 drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]" />
    </div>

    {/* --- Lateral Izquierdo Inferior --- */}
    <div className="absolute top-[50%] left-[2%] sm:left-[4%] opacity-90 animate-float-slow -rotate-6" style={{ animationDelay: '3.1s' }}>
      <PoletVector className="w-11 h-16 sm:w-14 sm:h-22 drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]" />
    </div>
    <div className="absolute top-[62%] left-[2%] sm:left-[6%] text-white/80 animate-twinkle" style={{ animationDelay: '1.8s' }}>
      <Snowflake arms={8} className="w-10 h-10 sm:w-14 sm:h-14 drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]" />
    </div>
    <div className="absolute top-[74%] left-[3%] sm:left-[3%] opacity-85 animate-float-slow rotate-12" style={{ animationDelay: '4.5s' }}>
      <CopaHeladoVector className="w-12 h-14 sm:w-16 sm:h-18 drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]" />
    </div>
    <div className="absolute top-[86%] left-[2%] sm:left-[5%] text-white/80 animate-twinkle" style={{ animationDelay: '0.7s' }}>
      <Snowflake arms={6} className="w-11 h-11 sm:w-14 sm:h-14 drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]" />
    </div>

    {/* --- Lateral Derecho Superior --- */}
    <div className="absolute top-[5%] right-[2%] sm:right-[5%] opacity-90 animate-float-slow rotate-12" style={{ animationDelay: '2s' }}>
      <PoletVector className="w-11 h-16 sm:w-15 sm:h-22 drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]" />
    </div>
    <div className="absolute top-[15%] right-[3%] sm:right-[7%] text-white/80 animate-twinkle" style={{ animationDelay: '3.2s' }}>
      <SnowflakeCrystal className="w-10 h-10 sm:w-14 sm:h-14 drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]" />
    </div>
    <div className="absolute top-[25%] right-[2%] sm:right-[3%] opacity-85 animate-float-slow -rotate-45" style={{ animationDelay: '0.9s' }}>
      <CopaHeladoVector className="w-12 h-14 sm:w-16 sm:h-18 drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]" />
    </div>
    <div className="absolute top-[35%] right-[3%] sm:right-[6%] text-white/75 animate-twinkle" style={{ animationDelay: '2.1s' }}>
      <Snowflake arms={8} className="w-10 h-10 sm:w-13 sm:h-13 drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]" />
    </div>

    {/* --- Lateral Derecho Inferior --- */}
    <div className="absolute top-[48%] right-[2%] sm:right-[4%] opacity-90 animate-float-slow rotate-25" style={{ animationDelay: '1.7s' }}>
      <ChococonoVector className="w-12 h-16 sm:w-16 sm:h-24 drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]" />
    </div>
    <div className="absolute top-[58%] right-[3%] sm:right-[7%] text-white/80 animate-twinkle" style={{ animationDelay: '4s' }}>
      <Snowflake arms={6} className="w-11 h-11 sm:w-15 sm:h-15 drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]" />
    </div>
    <div className="absolute top-[70%] right-[2%] sm:right-[3%] opacity-85 animate-float-slow -rotate-12" style={{ animationDelay: '2.8s' }}>
      <AlohaVector className="w-10 h-16 sm:w-13 sm:h-22 drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]" />
    </div>
    <div className="absolute top-[82%] right-[3%] sm:right-[5%] text-white/75 animate-twinkle" style={{ animationDelay: '1.4s' }}>
      <SnowflakeCrystal className="w-10 h-10 sm:w-13 sm:h-13 drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]" />
    </div>

    {/* Destellos dorados y blancos adicionales repartidos */}
    <Sparkle className="absolute text-yellow-200/80 w-6 h-6 top-[11%] left-[10%] animate-twinkle" />
    <Sparkle className="absolute text-white/90 w-7 h-7 top-[21%] right-[12%] animate-twinkle" style={{ animationDelay: '1.5s' }} />
    <Sparkle className="absolute text-yellow-200/80 w-7 h-7 top-[43%] left-[11%] animate-twinkle" style={{ animationDelay: '2.8s' }} />
    <Sparkle className="absolute text-white/90 w-6 h-6 top-[55%] right-[11%] animate-twinkle" style={{ animationDelay: '0.4s' }} />
    <Sparkle className="absolute text-yellow-200/80 w-7 h-7 top-[77%] left-[9%] animate-twinkle" style={{ animationDelay: '3.6s' }} />
    <Sparkle className="absolute text-white/80 w-6 h-6 top-[91%] right-[10%] animate-twinkle" style={{ animationDelay: '2.2s' }} />
  </div>
);

/* =========================================================
   COMPONENTES ESTRUCTURALES Y TIPOGRÁFICOS
   ========================================================= */

interface StitchedCardProps {
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  size?: 'md' | 'sm';
  rivets?: boolean;
  greenRivets?: boolean;
  style?: React.CSSProperties;
}

/** Tarjeta blanca con costura navideña interior y remaches en las esquinas. */
export const StitchedCard: React.FC<StitchedCardProps> = ({
  children,
  className = '',
  bodyClassName = '',
  size = 'md',
  rivets = true,
  greenRivets = false,
  style,
}) => {
  const rivetClass = `rivet ${greenRivets ? 'rivet-green' : ''}`;
  const inset = size === 'sm' ? '6px' : '12px';
  return (
    <div className={`stitched ${size === 'sm' ? 'stitched-sm' : ''} ${className}`} style={style}>
      <div className="stitched-ring">
        <div className={`stitched-body ${bodyClassName}`}>
          {rivets && (
            <>
              <span className={rivetClass} style={{ top: inset, left: inset }} />
              <span className={rivetClass} style={{ top: inset, right: inset }} />
            </>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

/** Logo oficial con contorno blanco (tratamiento de las piezas de campaña). */
export const LogoOutlined: React.FC<{ className?: string; priority?: boolean }> = ({
  className = 'w-32 h-20',
  priority = true,
}) => (
  <div className={`relative ${className}`}>
    <Image
      src="/logo-cremhelado.png"
      alt="Crem Helado"
      fill
      sizes="(max-width: 640px) 140px, 200px"
      className="object-contain logo-outline"
      priority={priority}
    />
  </div>
);

/** Lockup tipográfico "SUEÑO de NAVIDAD". */
export const SuenoLockup: React.FC<{ size?: 'lg' | 'md' | 'sm'; className?: string }> = ({
  size = 'lg',
  className = '',
}) => {
  const sizes = {
    lg: {
      top: 'text-[clamp(2.6rem,10vw,5.5rem)]',
      bottom: 'text-[clamp(3.6rem,15vw,8.5rem)]',
      de: 'w-[clamp(2.2rem,7vw,3.6rem)] h-[clamp(2.2rem,7vw,3.6rem)] text-[clamp(1rem,3.2vw,1.7rem)]',
    },
    md: {
      top: 'text-[clamp(2.2rem,8vw,4rem)]',
      bottom: 'text-[clamp(3rem,12vw,6rem)]',
      de: 'w-[clamp(1.9rem,6vw,2.8rem)] h-[clamp(1.9rem,6vw,2.8rem)] text-[clamp(0.9rem,2.6vw,1.3rem)]',
    },
    sm: {
      top: 'text-2xl',
      bottom: 'text-4xl',
      de: 'w-7 h-7 text-xs',
    },
  }[size];

  return (
    <div className={`font-display text-pop uppercase leading-[0.82] text-center select-none ${className}`}>
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <span className={sizes.top}>Sueño</span>
        <span className={`de-badge normal-case ${sizes.de}`}>de</span>
      </div>
      <div className={`${sizes.bottom} -mt-1`}>Navidad</div>
    </div>
  );
};

/** Etiqueta inclinada tipo "NUEVO" con costura. Siempre en z-30 para nunca quedar tapada. */
export const FestiveTag: React.FC<{
  children: React.ReactNode;
  className?: string;
  tone?: 'green' | 'red' | 'brown';
}> = ({ children, className = '', tone = 'green' }) => {
  const color = { green: 'text-crem-green', red: 'text-crem-red', brown: 'text-[#5a2a12]' }[tone];
  return (
    <div className={`relative z-30 inline-block animate-swing-tag drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)] ${className}`}>
      <StitchedCard size="sm" rivets greenRivets={false}>
        <div className={`font-display uppercase px-4 pt-3 pb-1.5 sm:px-5 sm:pt-3.5 sm:pb-2 leading-none ${color}`}>
          {children}
        </div>
      </StitchedCard>
    </div>
  );
};

/**
 * Fondo de cabecera: rombos verdes + remolinos sutiles.
 */
export const FestiveHeroBackdrop: React.FC<{ band?: boolean; bandTop?: string; bandHeight?: string }> = ({
  band = false,
  bandTop = '30%',
  bandHeight = '46%',
}) => (
  <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
    <div className="absolute inset-0 bg-harlequin" />
    <div className="absolute inset-0 swirl-arcs" />

    {/* Franja roja diagonal opcional */}
    {band && (
      <div
        className="absolute -left-[15%] -right-[15%] bg-red-dots -skew-y-6 shadow-[0_18px_40px_-10px_rgba(0,0,0,0.45),0_-18px_40px_-10px_rgba(0,0,0,0.35)]"
        style={{ top: bandTop, height: bandHeight }}
      >
        <div className="absolute inset-0 swirl-arcs opacity-80" />
      </div>
    )}
  </div>
);

/**
 * Franja roja diagonal con lunares anclada al contenido que la envuelve.
 * Usar dentro de un contenedor `relative`; ajustar alto con clases top/bottom.
 */
export const RedBand: React.FC<{ className?: string; skew?: 'left' | 'right' }> = ({
  className = '-top-8 -bottom-8',
  skew = 'left',
}) => (
  <div
    aria-hidden="true"
    className={`absolute left-1/2 -translate-x-1/2 w-[170vw] bg-red-dots pointer-events-none z-0 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5),0_-20px_40px_-12px_rgba(0,0,0,0.4)] ${
      skew === 'left' ? '-skew-y-6' : 'skew-y-6'
    } ${className}`}
  >
    <div className="absolute inset-0 swirl-arcs opacity-80" />
  </div>
);

/** Separador decorativo de cinta de caramelo. */
export const CandyDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`h-2.5 w-full candy-stripe ${className}`} aria-hidden="true" />
);
