import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faIceCream,
  faUsers,
  faArrowRight,
  faShieldAlt,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fbfbfc] text-slate-800 flex flex-col justify-between relative overflow-hidden selection:bg-[#E30613] selection:text-white">
      {/* Fondo festivo suave tema claro */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-red-100/60 via-amber-50/40 to-transparent blur-3xl pointer-events-none" />

      {/* Barra superior */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-50 text-[#E30613] flex items-center justify-center font-bold text-base shadow-xs">
            <FontAwesomeIcon icon={faIceCream} />
          </div>
          <span className="font-black text-base tracking-tight text-slate-900">
            Crem Helado &bull; Celebración
          </span>
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-bold border border-slate-300 transition-colors shadow-xs"
        >
          <FontAwesomeIcon icon={faShieldAlt} className="text-[#E30613]" />
          <span>Acceso Administración</span>
        </Link>
      </header>

      {/* Hero central */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 py-12 text-center my-auto">
        <div className="text-xs font-black uppercase tracking-wider text-[#E30613] mb-3">
          Sistema de Invitaciones & Confirmación de Asistencia
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 mb-5 leading-tight">
          Gran Fiesta de Fin de Año & Celebración
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed mb-10">
          Bienvenido al portal oficial de confirmación de Crem Helado. Diseñado para gestionar y
          confirmar la asistencia de todo el equipo por WhatsApp y correo electrónico con pase digital QR.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            href="/invitacion"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-[#E30613] hover:bg-[#c40510] text-white font-black text-sm tracking-wide shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <FontAwesomeIcon icon={faCalendarAlt} />
            <span>Ver Invitación</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </Link>

          <Link
            href="/admin"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 transition-all hover:scale-105 shadow-xs"
          >
            <FontAwesomeIcon icon={faUsers} className="text-[#005CA9]" />
            <span>Panel de Control</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
