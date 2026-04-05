import { formatVisitMonthLabel, getCurrentVisitMonthKey } from "@/lib/visit-period";
import { getSupabaseServerClient } from "@/lib/supabase";

type MonthlyVisitsRow = {
  month_key: string;
  count: number;
};

async function ensureMonthlyVisitsRow(monthKey: string) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("monthly_visits")
    .upsert(
      {
        month_key: monthKey,
        count: 0,
      },
      {
        onConflict: "month_key",
        ignoreDuplicates: true,
      },
    )
    .select("month_key, count")
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Unable to ensure monthly visits row: ${error.message}`);
  }

  return (data as MonthlyVisitsRow | null) ?? null;
}

export async function getMonthlyVisits() {
  const monthKey = getCurrentVisitMonthKey();
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("monthly_visits")
    .select("month_key, count")
    .eq("month_key", monthKey)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to read monthly visits from Supabase: ${error.message}`);
  }

  const row =
    (data as MonthlyVisitsRow | null) ??
    (await ensureMonthlyVisitsRow(monthKey)) ?? {
      month_key: monthKey,
      count: 0,
    };

  return {
    count: row.count,
    monthKey: row.month_key,
    monthLabel: formatVisitMonthLabel(row.month_key),
  };
}

export async function incrementMonthlyVisits() {
  const monthKey = getCurrentVisitMonthKey();
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.rpc("increment_monthly_visits", {
    target_month_key: monthKey,
  });

  if (error) {
    throw new Error(`Unable to increment monthly visits in Supabase: ${error.message}`);
  }

  const row = Array.isArray(data)
    ? (data[0] as MonthlyVisitsRow | undefined)
    : (data as MonthlyVisitsRow | null);

  if (!row) {
    throw new Error("Supabase did not return a monthly visits row.");
  }

  return {
    count: row.count,
    monthKey: row.month_key,
    monthLabel: formatVisitMonthLabel(row.month_key),
  };
}
