'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMusic,
  faVolumeHigh,
  faVolumeXmark,
  faPlay,
  faPause,
} from '@fortawesome/free-solid-svg-icons';

interface FestiveMusicPlayerProps {
  enabled?: boolean;
  src?: string;
}

/**
 * Reproductor de música navideña suave de fondo:
 * - Canción instrumental libre de derechos (Jingle Bells Calm en celesta y violín)
 * - Respeta la configuración del administrador (enabled: true/false)
 * - Botón flotante estilizado para pausar/reanudar o silenciar
 * - Control de volumen suave por defecto (25%) para no ser invasivo
 * - Inicia suavemente tras la primera interacción del usuario si el navegador bloquea autoplay
 */
export const FestiveMusicPlayer: React.FC<FestiveMusicPlayerProps> = ({
  enabled = true,
  src = '/audio/navidad-suave.mp3',
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (!enabled) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.25; // Volumen suave y sutil
    audio.loop = true;

    // Intentar reproducir automáticamente
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // El navegador requiere interacción previa del usuario
          setIsPlaying(false);
        });
    }

    // Al primer clic o toque en cualquier parte de la pantalla, arrancar si no estaba sonando
    const handleFirstGesture = () => {
      if (!hasInteracted && audio && audio.paused && enabled) {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setHasInteracted(true);
          })
          .catch(() => {});
      }
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, [enabled, hasInteracted]);

  if (!enabled) return null;

  const togglePlayback = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn('No se pudo reproducir audio:', err));
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} preload="auto" />

      {/* Botón flotante inferior izquierdo */}
      <div className="fixed bottom-3.5 left-3.5 z-40 select-none">
        <button
          onClick={togglePlayback}
          type="button"
          aria-label={isPlaying ? 'Silenciar música navideña' : 'Reproducir música navideña'}
          title={isPlaying ? 'Pausar música navideña' : 'Reproducir música navideña'}
          className={`group flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2 rounded-full backdrop-blur-md shadow-[0_6px_18px_rgba(0,0,0,0.35)] border border-white/30 text-white text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
            isPlaying
              ? 'bg-crem-green-deep/90 ring-2 ring-emerald-300/40'
              : 'bg-crem-red/90 ring-2 ring-red-300/40 opacity-90'
          }`}
        >
          {/* Icono de música o notas con animación de ecualizador */}
          <div className="relative flex items-center justify-center w-5 h-5">
            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-3.5" aria-hidden="true">
                <span className="w-0.5 bg-white rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-3"></span>
                <span className="w-0.5 bg-yellow-200 rounded-full animate-[pulse_1.1s_ease-in-out_infinite_0.2s] h-2"></span>
                <span className="w-0.5 bg-white rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.4s] h-3.5"></span>
                <span className="w-0.5 bg-yellow-200 rounded-full animate-[pulse_1.2s_ease-in-out_infinite_0.1s] h-1.5"></span>
              </div>
            ) : (
              <FontAwesomeIcon icon={faPlay} className="text-[11px] text-white" />
            )}
          </div>

          <span className="hidden xs:inline sm:inline tracking-wide font-display text-[13px] text-pop-sm">
            {isPlaying ? 'Música Navideña' : 'Tocar Música'}
          </span>

          {/* Icono de volumen / silenciar */}
          <FontAwesomeIcon
            icon={isPlaying ? faVolumeHigh : faVolumeXmark}
            className={`text-xs transition-opacity ${isPlaying ? 'text-yellow-200' : 'text-white/80'}`}
          />
        </button>
      </div>
    </>
  );
};
