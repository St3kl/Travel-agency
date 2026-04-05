import { NextResponse } from "next/server";

import {
  getMonthlyVisits,
  incrementMonthlyVisits,
} from "@/lib/monthly-visits";
import { isSupabaseConfigured } from "@/lib/supabase";
import { formatVisitMonthLabel, getCurrentVisitMonthKey } from "@/lib/visit-period";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSupabaseConfigured()) {
    const monthKey = getCurrentVisitMonthKey();

    return NextResponse.json({
      count: 0,
      monthKey,
      monthLabel: formatVisitMonthLabel(monthKey),
    });
  }

  const visits = await getMonthlyVisits();
  return NextResponse.json(visits);
}

export async function POST() {
  if (!isSupabaseConfigured()) {
    const monthKey = getCurrentVisitMonthKey();

    return NextResponse.json({
      count: 0,
      monthKey,
      monthLabel: formatVisitMonthLabel(monthKey),
    });
  }

  const visits = await incrementMonthlyVisits();
  return NextResponse.json(visits);
}
