'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSnowflake } from '@fortawesome/free-solid-svg-icons';

interface SnowParticle {
  x: number;
  y: number;
  radius: number;
  density: number;
  opacity: number;
  swingSpeed: number;
  swingRange: number;
  swingStep: number;
}

interface Sparkle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  fadeDirection: number;
  rotation: number;
}

export const SnowEffect: React.FC<{ showToggle?: boolean }> = ({ showToggle = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const animFrameId = useRef<number | null>(null);

  // Cargar preferencia guardada
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cremhelado_snow_enabled');
      if (saved !== null) {
        setIsEnabled(saved === 'true');
      }
    } catch {
      // Ignorar si no hay acceso a localStorage
    }
  }, []);

  const toggleSnow = () => {
    setIsEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('cremhelado_snow_enabled', String(next));
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    if (!isEnabled) {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Cantidad equilibrada de copos para rendimiento impecable (60fps)
    const particleCount = Math.min(Math.floor(width / 24), 50);
    const particles: SnowParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.8 + 1.2,
        density: Math.random() * 0.8 + 0.4,
        opacity: Math.random() * 0.65 + 0.35,
        swingSpeed: Math.random() * 0.02 + 0.01,
        swingRange: Math.random() * 1.5 + 0.5,
        swingStep: Math.random() * Math.PI * 2,
      });
    }

    // Destellos / estrellas de 4 puntas de referencia
    const sparkles: Sparkle[] = [];
    const sparkleCount = Math.min(Math.floor(width / 140), 10);
    for (let i = 0; i < sparkleCount; i++) {
      sparkles.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.7,
        size: Math.random() * 6 + 4,
        opacity: Math.random() * 0.7 + 0.2,
        fadeDirection: Math.random() > 0.5 ? 0.01 : -0.01,
        rotation: Math.random() * Math.PI,
      });
    }

    // Dibujar estrella de 4 puntas (similar a la gráfica de Crem Helado)
    const drawSparkle = (cx: number, cy: number, size: number, opacity: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      // Forma de estrella de 4 puntas
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(0, 0, size, 0);
      ctx.quadraticCurveTo(0, 0, 0, size);
      ctx.quadraticCurveTo(0, 0, -size, 0);
      ctx.quadraticCurveTo(0, 0, 0, -size);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    let isDocumentVisible = true;
    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (!isDocumentVisible) {
        animFrameId.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Dibujar estrellas centelleantes
      for (const sp of sparkles) {
        sp.opacity += sp.fadeDirection;
        if (sp.opacity > 0.9) sp.fadeDirection = -0.012;
        if (sp.opacity < 0.1) {
          sp.fadeDirection = 0.012;
          sp.x = Math.random() * width;
          sp.y = Math.random() * height * 0.75;
        }
        drawSparkle(sp.x, sp.y, sp.size, sp.opacity);
      }

      // Dibujar y mover copos de nieve
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.swingStep += p.swingSpeed;
        p.y += p.density * 0.9;
        p.x += Math.sin(p.swingStep) * p.swingRange;

        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x > width + 10) p.x = -10;
        else if (p.x < -10) p.x = width + 10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.shadowBlur = 4;
        ctx.fill();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isEnabled]);

  return (
    <>
      {/* Canvas no interactivo de fondo */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[5] transition-opacity duration-500"
        style={{ opacity: isEnabled ? 1 : 0 }}
      />

      {/* Botón flotante discreto para pausar o activar la nieve */}
      {showToggle && (
        <button
          onClick={toggleSnow}
          title={isEnabled ? 'Pausar nieve festiva' : 'Activar nieve festiva'}
          aria-label={isEnabled ? 'Pausar efecto de nieve' : 'Activar efecto de nieve'}
          className="fixed bottom-3 right-3 z-40 inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-crem-green-deep/90 hover:bg-crem-green-deep text-white text-[11px] font-bold border-2 border-white/80 shadow-lg backdrop-blur-sm transition-all hover:scale-105 cursor-pointer select-none"
        >
          <FontAwesomeIcon
            icon={faSnowflake}
            className={`text-xs transition-transform ${isEnabled ? 'text-white animate-spin' : 'text-white/50'}`}
            style={{ animationDuration: '10s' }}
          />
          <span className="hidden sm:inline">
            {isEnabled ? 'Nieve activa' : 'Nieve pausada'}
          </span>
        </button>
      )}
    </>
  );
};
