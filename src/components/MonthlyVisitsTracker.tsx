"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { getCurrentVisitMonthKey } from "@/lib/visit-period";

const STORAGE_KEY = "ekeon-monthly-visit-counted";

export default function MonthlyVisitsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      return;
    }

    let isActive = true;

    async function syncMonthlyVisits() {
      const monthKey = getCurrentVisitMonthKey();
      const hasCountedThisMonth =
        window.localStorage.getItem(STORAGE_KEY) === monthKey;
      const method = hasCountedThisMonth ? "GET" : "POST";

      const response = await fetch("/api/monthly-visits", {
        method,
        cache: "no-store",
      });

      if (!response.ok || !isActive) {
        return;
      }

      const data = (await response.json()) as { monthKey: string };

      if (!hasCountedThisMonth) {
        window.localStorage.setItem(STORAGE_KEY, data.monthKey);
      }
    }

    void syncMonthlyVisits();

    return () => {
      isActive = false;
    };
  }, [pathname]);

  return null;
}
