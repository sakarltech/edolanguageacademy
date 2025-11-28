import { trpc } from "@/lib/trpc";
import { X } from "lucide-react";
import { useState } from "react";

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { data: announcements } = trpc.announcement.getActive.useQuery();

  // Don't show banner if dismissed or no active announcements
  if (dismissed || !announcements || announcements.length === 0) {
    return null;
  }

  // Get the first active announcement
  const announcement = announcements[0];

  return (
    <div className="relative bg-gradient-to-r from-edo-primary to-edo-secondary text-white overflow-hidden">
      <div className="relative flex items-center justify-center py-3 px-4">
        {/* Scrolling text container */}
        <div className="flex-1 overflow-hidden">
          <div className="animate-scroll whitespace-nowrap">
            <span className="inline-block px-4">
              <strong className="font-semibold">{announcement.title}:</strong>{" "}
              {announcement.message}
            </span>
            {/* Duplicate for seamless loop */}
            <span className="inline-block px-4">
              <strong className="font-semibold">{announcement.title}:</strong>{" "}
              {announcement.message}
            </span>
            <span className="inline-block px-4">
              <strong className="font-semibold">{announcement.title}:</strong>{" "}
              {announcement.message}
            </span>
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          className="ml-4 p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* CSS for scrolling animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .animate-scroll {
          display: inline-block;
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
