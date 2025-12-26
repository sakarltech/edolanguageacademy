import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: Date;
  onExpire?: () => void;
}

export function CountdownTimer({ targetDate, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  function calculateTimeLeft(): TimeLeft {
    const difference = targetDate.getTime() - new Date().getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Check if expired
      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        clearInterval(timer);
        if (onExpire) {
          onExpire();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <TimeUnit value={timeLeft.days} label="Days" />
      <span className="text-white text-lg font-bold">:</span>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <span className="text-white text-lg font-bold">:</span>
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <span className="text-white text-lg font-bold">:</span>
      <TimeUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2 min-w-[40px] sm:min-w-[60px]">
        <span className="text-white text-xl sm:text-3xl font-bold tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-white/90 text-xs sm:text-sm mt-1 font-medium">
        {label}
      </span>
    </div>
  );
}
