import { useEffect, useState } from "react";

/**
 * Christmas Snowfall Component
 * 
 * Displays gentle falling snowflakes during the Christmas season (Dec 1 - Jan 1).
 * Automatically activates and deactivates based on the current date.
 * 
 * Features:
 * - 50 snowflakes with varying sizes and fall speeds
 * - Subtle animation that doesn't distract from content
 * - Complements the warm gold theme with white/gold snowflakes
 * - Automatically removes itself after the holiday period
 */

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  size: number;
  delay: number;
  opacity: number;
}

export default function ChristmasSnowfall() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Check if we're in the Christmas season (Dec 1 - Jan 1)
    const checkSeason = () => {
      const now = new Date();
      const month = now.getMonth(); // 0-11 (0 = January, 11 = December)
      const day = now.getDate();

      // Active from December 1st to January 1st
      const isChristmasSeason = month === 11 || (month === 0 && day === 1);
      setIsActive(isChristmasSeason);
    };

    checkSeason();

    // Check again every hour in case the date changes
    const interval = setInterval(checkSeason, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    // Generate 50 snowflakes with random properties
    const flakes: Snowflake[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // Random horizontal position (0-100%)
      animationDuration: 10 + Math.random() * 20, // Fall duration 10-30s
      size: 3 + Math.random() * 7, // Size 3-10px
      delay: Math.random() * 10, // Stagger start times 0-10s
      opacity: 0.3 + Math.random() * 0.5, // Opacity 0.3-0.8
    }));

    setSnowflakes(flakes);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      aria-hidden="true"
    >
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute top-0 animate-snowfall"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${flake.delay}s`,
            opacity: flake.opacity,
          }}
        >
          <div
            className="w-full h-full rounded-full bg-gradient-to-br from-white to-[#D4AF37]"
            style={{
              boxShadow: "0 0 3px rgba(255, 255, 255, 0.8)",
            }}
          />
        </div>
      ))}

      <style>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10px) translateX(0) rotate(0deg);
          }
          25% {
            transform: translateY(25vh) translateX(10px) rotate(90deg);
          }
          50% {
            transform: translateY(50vh) translateX(-10px) rotate(180deg);
          }
          75% {
            transform: translateY(75vh) translateX(10px) rotate(270deg);
          }
          100% {
            transform: translateY(100vh) translateX(0) rotate(360deg);
          }
        }

        .animate-snowfall {
          animation: snowfall linear infinite;
        }
      `}</style>
    </div>
  );
}
