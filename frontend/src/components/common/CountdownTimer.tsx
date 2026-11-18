import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate?: string;
  eventName?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate = '2026-11-18T09:00:00+05:30',
  eventName = 'CODESTORM 2026',
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isExpired) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#A8FF60]/12 border border-[#A8FF60]/35 text-[#A8FF60] text-xs font-semibold shadow-[0_8px_20px_-8px_rgba(168,255,96,0.3)]">
        <span className="w-2 h-2 rounded-full bg-[#A8FF60] animate-ping" />
        {eventName} Event In Progress / Concluded
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3 text-center">
      <div className="flex flex-col items-center justify-center w-14 sm:w-16 h-14 sm:h-16 rounded-xl surface-3d border border-[#4285F4]/25">
        <span className="font-extrabold text-lg sm:text-xl text-[#F5F7FF] font-mono leading-none">
          {String(timeLeft.days).padStart(2, '0')}
        </span>
        <span className="text-[10px] text-[#A6B0C3] uppercase tracking-wider font-semibold mt-1">
          Days
        </span>
      </div>

      <span className="text-[#4285F4] font-bold text-xl">:</span>

      <div className="flex flex-col items-center justify-center w-14 sm:w-16 h-14 sm:h-16 rounded-xl surface-3d border border-[#4285F4]/25">
        <span className="font-extrabold text-lg sm:text-xl text-[#4285F4] font-mono leading-none">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-[10px] text-[#A6B0C3] uppercase tracking-wider font-semibold mt-1">
          Hours
        </span>
      </div>

      <span className="text-[#00D4FF] font-bold text-xl">:</span>

      <div className="flex flex-col items-center justify-center w-14 sm:w-16 h-14 sm:h-16 rounded-xl surface-3d border border-[#00D4FF]/25">
        <span className="font-extrabold text-lg sm:text-xl text-[#00D4FF] font-mono leading-none">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-[10px] text-[#A6B0C3] uppercase tracking-wider font-semibold mt-1">
          Mins
        </span>
      </div>

      <span className="text-[#A8FF60] font-bold text-xl">:</span>

      <div className="flex flex-col items-center justify-center w-14 sm:w-16 h-14 sm:h-16 rounded-xl surface-3d border border-[#A8FF60]/25">
        <span className="font-extrabold text-lg sm:text-xl text-[#A8FF60] font-mono leading-none">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className="text-[10px] text-[#A6B0C3] uppercase tracking-wider font-semibold mt-1">
          Secs
        </span>
      </div>
    </div>
  );
};
