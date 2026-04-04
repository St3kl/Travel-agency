import { NextResponse } from "next/server";

import {
  getMonthlyVisits,
  incrementMonthlyVisits,
} from "@/lib/monthly-visits";

export const dynamic = "force-dynamic";

export async function GET() {
  const visits = await getMonthlyVisits();
  return NextResponse.json(visits);
}

export async function POST() {
  const visits = await incrementMonthlyVisits();
  return NextResponse.json(visits);
}
