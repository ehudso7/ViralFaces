"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Track page views
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

      // Google Analytics (if GA_MEASUREMENT_ID is set)
      if (window.gtag) {
        window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "", {
          page_path: url,
        });
      }

      // Custom analytics event
      console.log("[Analytics] Page view:", url);
    }
  }, [pathname, searchParams]);

  return null;
}

// Event tracking helper
export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  if (typeof window !== "undefined") {
    // Google Analytics
    if (window.gtag) {
      window.gtag("event", eventName, eventData);
    }

    // Console log for development
    console.log("[Analytics] Event:", eventName, eventData);

    // You can add other analytics providers here (Mixpanel, Amplitude, etc.)
  }
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
