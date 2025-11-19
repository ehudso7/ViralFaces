"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function AnalyticsInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Track page views
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

      // Google Analytics (only if GA_MEASUREMENT_ID is set and valid)
      const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
      if (gaId && gaId !== "" && window.gtag) {
        try {
          window.gtag("config", gaId, {
            page_path: url,
          });
        } catch (error) {
          console.error("[Analytics] GA tracking failed:", error);
        }
      }
    }
  }, [pathname, searchParams]);

  return null;
}

export function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsInner />
    </Suspense>
  );
}

// Event tracking helper
export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  if (typeof window !== "undefined") {
    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    // Google Analytics (only if configured)
    if (gaId && gaId !== "" && window.gtag) {
      try {
        window.gtag("event", eventName, eventData);
      } catch (error) {
        console.error("[Analytics] Event tracking failed:", error);
      }
    }
  }
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
