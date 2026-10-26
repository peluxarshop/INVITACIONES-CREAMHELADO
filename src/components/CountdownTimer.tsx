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
  targetTime = '14:00',
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
      const cleanTime = targetTime.includes(':')
        ? (targetTime.length === 5 ? `${targetTime}:00` : targetTime)
        : `${targetTime}:00`;
      const target = new Date(`${targetDate}T${cleanTime}`);
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
      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto py-2 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 sm:h-28 bg-white/30 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (timeLeft.isPast) {
    return (
      <div className="stitched max-w-md mx-auto">
        <div className="stitched-ring">
          <div className="stitched-body py-4 px-6 text-center font-display text-crem-red text-xl sm:text-2xl">
            ¡El evento ya comenzó! ¡A disfrutar la gran fiesta!
          </div>
        </div>
      </div>
    );
  }

  const units = [
    { label: 'Días', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Seg', value: timeLeft.seconds },
  ];

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
        {units.map((unit, index) => (
          <div key={index} className="stitched stitched-sm group">
            <div className="stitched-ring">
              <div className="stitched-body flex flex-col items-center justify-center py-3 sm:py-4">
                <span className="font-display text-[clamp(2rem,8vw,3.5rem)] leading-none text-crem-red tabular-nums group-hover:scale-110 transition-transform">
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="font-display text-[11px] sm:text-sm uppercase tracking-wider text-crem-green mt-1">
                  {unit.label}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
