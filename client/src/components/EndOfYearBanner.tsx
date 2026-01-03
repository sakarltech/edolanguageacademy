import { useState, useEffect } from "react";
import { X, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "./CountdownTimer";

/**
 * End of Year Sales Banner Component
 * 
 * Displays a dismissible announcement banner promoting the End of Year 40% discount.
 * Automatically shows from December 26th to December 31st, 2025.
 * 
 * Features:
 * - Dismissible with localStorage persistence
 * - Date-based activation (Dec 26 - Dec 31, 2025)
 * - Live countdown timer to expiration
 * - Festive styling with gradient background
 * - Automatic 40% discount messaging
 * - Call-to-action button
 */

export default function EndOfYearBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // End of Year sale expires December 31, 2025 at 23:59:59 GMT
  const expirationDate = new Date("2025-12-31T23:59:59Z");

  useEffect(() => {
    // Check if we're in the promotion period (Dec 26 - Dec 31, 2025)
    const checkPromoPeriod = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth(); // 0-11
      const day = now.getDate();

      // Active from December 26th to December 31st, 2025
      const isInPromoPeriod =
        year === 2025 && month === 11 && day >= 26 && day <= 31;

      setIsActive(isInPromoPeriod);

      // Auto-hide if expired
      if (now >= expirationDate) {
        setIsActive(false);
      }
    };

    checkPromoPeriod();

    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem("end-of-year-banner-dismissed-2025");
    if (!dismissed) {
      setIsVisible(true);
    }

    // Check again every minute in case the date changes
    const interval = setInterval(checkPromoPeriod, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("end-of-year-banner-dismissed-2025", "true");
  };

  const handleEnrollNow = () => {
    window.location.href = "/register";
  };

  const handleExpire = () => {
    setIsActive(false);
    setIsVisible(false);
  };

  if (!isActive || !isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-green-700 via-red-700 to-green-700 text-white shadow-lg z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Left side: Message and codes */}
          <div className="flex items-start lg:items-center gap-3 flex-1">
            <Sparkles className="h-7 w-7 text-yellow-300 flex-shrink-0 animate-pulse mt-1 lg:mt-0" />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Gift className="h-5 w-5 text-yellow-300 animate-pulse" />
                <p className="font-bold text-base sm:text-lg">
                  🎊 End of Year Special: Massive Savings!
                </p>
              </div>
              <p className="text-sm sm:text-base opacity-95">
                <span className="text-yellow-300 font-bold text-xl">✅ 40% OFF Automatically Applied!</span>
              </p>
              <p className="text-xs sm:text-sm opacity-90">
                No code needed - your End of Year discount is already active at checkout!
              </p>
            </div>
          </div>

          {/* Center: Countdown Timer (Desktop) */}
          <div className="hidden lg:flex flex-col items-center gap-1">
            <span className="text-xs opacity-90 font-medium">Offer Ends In:</span>
            <CountdownTimer targetDate={expirationDate} onExpire={handleExpire} />
          </div>

          {/* Right side: CTA and Dismiss */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <Button
              onClick={handleEnrollNow}
              size="lg"
              className="bg-yellow-400 hover:bg-yellow-500 text-green-900 font-bold flex-1 lg:flex-initial shadow-lg"
            >
              Get 40% OFF Now
            </Button>
            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white transition-colors p-2 flex-shrink-0"
              aria-label="Dismiss banner"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Countdown Timer */}
        <div className="lg:hidden mt-3 pt-3 border-t border-white/20 flex flex-col items-center gap-2">
          <span className="text-xs opacity-90 font-medium">Offer Ends In:</span>
          <CountdownTimer targetDate={expirationDate} onExpire={handleExpire} />
        </div>
      </div>
    </div>
  );
}
