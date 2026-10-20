'use client';

import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: string; // YYYY-MM-DD
  targetTime?: string; // HH:mm
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  targetTime = '19:00',
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const calculateTime = () => {
      const target = new Date(`${targetDate}T${targetTime}:00`);
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  if (!mounted) {
    return (
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md mx-auto py-2 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-slate-100 rounded-2xl border border-slate-200" />
        ))}
      </div>
    );
  }

  if (timeLeft.isPast) {
    return (
      <div className="text-center py-4 px-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-base max-w-md mx-auto shadow-sm">
        🎉 ¡El evento ya ha comenzado! ¡A disfrutar la gran fiesta!
      </div>
    );
  }

  const units = [
    { label: 'DÍAS', value: timeLeft.days },
    { label: 'HORAS', value: timeLeft.hours },
    { label: 'MINUTOS', value: timeLeft.minutes },
    { label: 'SEGUNDOS', value: timeLeft.seconds },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 text-center">
        {units.map((unit, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white border border-[#ebd9c8] shadow-sm hover:border-[#E30613]/50 transition-all duration-300"
          >
            <span className="text-2xl sm:text-4xl font-extrabold text-[#E30613] font-mono tracking-tight">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs tracking-wider font-bold text-slate-500 mt-1 uppercase">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
