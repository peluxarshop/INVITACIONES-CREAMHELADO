import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faArrowRight,
  faShieldAlt,
  faCalendarAlt,
  faUtensils,
  faGift,
  faQrcode,
  faCheckCircle,
  faHeart,
  faChampagneGlasses,
  faIceCream,
} from '@fortawesome/free-solid-svg-icons';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 flex flex-col justify-between relative overflow-hidden selection:bg-[#E30613] selection:text-white">
      {/* Fondo sutil festivo: Calidez crema y sutil resplandor carmesí y dorado */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-red-100/40 via-amber-100/30 to-transparent blur-3xl pointer-events-none" />

      {/* Franja superior festiva oro y rojo corporativo */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#E30613] via-[#D4AF37] to-[#005CA9]" />

      {/* Header Corporativo con Logo Oficial de Crem Helado */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative w-36 sm:w-44 h-12 sm:h-14">
            <Image
              src="/logo-cremhelado.png"
              alt="Crem Helado"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
          <div className="hidden sm:block border-l border-slate-300 pl-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Meals de Colombia
            </span>
            <span className="text-xs font-semibold text-slate-700">
              Celebración Fin de Año 2026
            </span>
          </div>
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-bold border border-[#ebd9c8] transition-all shadow-xs hover:border-[#E30613]"
        >
          <FontAwesomeIcon icon={faShieldAlt} className="text-[#E30613]" />
          <span>Acceso Administración</span>
        </Link>
      </header>

      {/* Hero Central Elegante y Profesional */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-14 text-center my-auto">
        <div className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-[#E30613] mb-4 bg-red-50 px-4 py-1.5 rounded-full border border-red-200">
          <span>Gala de Fin de Año &bull; Gran Familia Crem Helado</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-[1.15]">
          Celebrando los momentos más dulces que construimos juntos
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
          Un año extraordinario donde tu pasión, dedicación y entrega llenaron de alegría y sonrisas a millones de hogares en toda Colombia. Te damos la bienvenida al portal oficial para confirmar tu asistencia y recibir tu <strong>Pase VIP Digital</strong>.
        </p>

        {/* Botones Principales de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-14">
          <Link
            href="/invitacion/inv-juan-perez-101"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-[#E30613] hover:bg-[#c40510] text-white font-black text-sm tracking-wide shadow-lg shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <FontAwesomeIcon icon={faCalendarAlt} />
            <span>Ver Invitación & Confirmar</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </Link>

          <Link
            href="/admin"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-[#ebd9c8] transition-all hover:scale-[1.02] shadow-sm hover:border-[#E30613]"
          >
            <FontAwesomeIcon icon={faUsers} className="text-[#005CA9]" />
            <span>Panel de Gestión</span>
          </Link>
        </div>

        {/* 3 Tarjetas de Beneficios / Experiencia del Evento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left max-w-4xl mx-auto">
          {/* Tarjeta 1: Pase QR */}
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#ebd9c8] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E30613] flex items-center justify-center mb-4 text-xl">
              <FontAwesomeIcon icon={faQrcode} />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1.5">
              Pase Digital VIP con QR
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Confirmación inmediata con código QR escaneable desde tu celular para un ingreso rápido y seguro a la gala.
            </p>
          </div>

          {/* Tarjeta 2: Gastronomía & Helados */}
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#ebd9c8] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#B45309] flex items-center justify-center mb-4 text-xl">
              <FontAwesomeIcon icon={faUtensils} />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1.5">
              Cena de Gala & Brindis
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Gastronomía de alta cocina, brindis conmemorativo y una estación ilimitada de postres y helados Crem Helado.
            </p>
          </div>

          {/* Tarjeta 3: Rifas & Premios */}
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#ebd9c8] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#005CA9] flex items-center justify-center mb-4 text-xl">
              <FontAwesomeIcon icon={faGift} />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1.5">
              Grandes Rifas de Fin de Año
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Sorteos especiales, bonos y premios de reconocimiento para todos los colaboradores confirmados en el sistema.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
