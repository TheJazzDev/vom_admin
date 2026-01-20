"use client";

import { IconCloudOff, IconWifi } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Offline indicator for admin panel
 * Shows banner when connection is lost
 */
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if we're in browser
    if (typeof window === "undefined") return;

    // Set initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Show "Back online" message briefly
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Don't show anything if online (unless briefly showing "back online")
  if (isOnline && !showBanner) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-transform duration-300",
        !showBanner && "translate-y-[-100%]",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white",
          isOnline ? "bg-green-600" : "bg-red-600",
        )}
      >
        {isOnline ? (
          <>
            <IconWifi className="h-4 w-4" />
            <span>Back online</span>
          </>
        ) : (
          <>
            <IconCloudOff className="h-4 w-4" />
            <span>
              No internet connection - Some features may be unavailable
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default OfflineIndicator;
