"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { usePathname } from "next/navigation";

type MonthlyVisitsResponse = {
  count: number;
  monthKey: string;
  monthLabel: string;
};

export default function MonthlyVisitsBadge() {
  const pathname = usePathname();
  const [visits, setVisits] = useState<MonthlyVisitsResponse | null>(null);

  useEffect(() => {
    if (!pathname.startsWith("/admin")) {
      return;
    }

    let isActive = true;

    async function loadMonthlyVisits() {
      const response = await fetch("/api/monthly-visits", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok || !isActive) {
        return;
      }

      const data = (await response.json()) as MonthlyVisitsResponse;
      setVisits(data);
    }

    void loadMonthlyVisits();

    return () => {
      isActive = false;
    };
  }, [pathname]);

  if (!pathname.startsWith("/admin") || !visits) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold">
        <Eye size={16} />
      </span>
      <div className="leading-tight">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold/80">
          Monthly Visits
        </p>
        <p className="text-sm font-medium text-white/85">
          {visits.count} in {visits.monthLabel}
        </p>
      </div>
    </div>
  );
}
