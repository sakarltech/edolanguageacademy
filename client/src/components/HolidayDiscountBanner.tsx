import { useState, useEffect } from "react";
import { X, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Holiday Discount Banner Component
 * 
 * Displays a dismissible announcement banner promoting the New Year 20% discount.
 * Automatically shows from December 20th to January 31st.
 * 
 * Features:
 * - Dismissible with localStorage persistence
 * - Date-based activation (Dec 20 - Jan 31)
 * - Festive red and gold styling
 * - Prominent discount code display
 * - Call-to-action button
 */

export default function HolidayDiscountBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Check if we're in the promotion period (Dec 20 - Jan 31, excluding Boxing Day period)
    const checkPromoPeriod = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth(); // 0-11
      const day = now.getDate();

      // Hide during Boxing Day period (Dec 26-31) when Boxing Day banner is active
      const isBoxingDayPeriod = month === 11 && day >= 26 && day <= 31;

      // Active from December 20th to January 31st, but NOT during Boxing Day period
      const isInPromoPeriod =
        ((month === 11 && day >= 20 && day < 26) || // December 20-25
        (month === 0 && day <= 31)) && // January 1-31
        !isBoxingDayPeriod;

      setIsActive(isInPromoPeriod);
    };

    checkPromoPeriod();

    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem("holiday-banner-dismissed-2024");
    if (!dismissed) {
      setIsVisible(true);
    }

    // Check again every hour in case the date changes
    const interval = setInterval(checkPromoPeriod, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("holiday-banner-dismissed-2024", "true");
  };

  const handleEnrollNow = () => {
    window.location.href = "/register";
  };

  if (!isActive || !isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white shadow-lg z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Gift className="h-6 w-6 text-yellow-300 flex-shrink-0 animate-pulse" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <p className="font-semibold text-sm sm:text-base">
                🎉 New Year Special: Get 20% OFF All Courses!
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm opacity-90">Use code:</span>
                <code className="bg-yellow-400 text-red-900 px-3 py-1 rounded font-bold text-sm sm:text-base tracking-wider">
                  OLWIQASA
                </code>
                <span className="text-xs opacity-75">• Valid until Jan 31st</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleEnrollNow}
              size="sm"
              className="bg-yellow-400 hover:bg-yellow-500 text-red-900 font-semibold hidden sm:inline-flex"
            >
              Enroll Now
            </Button>
            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white transition-colors p-1 flex-shrink-0"
              aria-label="Dismiss banner"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="sm:hidden mt-2">
          <Button
            onClick={handleEnrollNow}
            size="sm"
            className="bg-yellow-400 hover:bg-yellow-500 text-red-900 font-semibold w-full"
          >
            Enroll Now & Save 20%
          </Button>
        </div>
      </div>
    </div>
  );
}
