import { promises as fs } from "fs";
import path from "path";

import { formatVisitMonthLabel, getCurrentVisitMonthKey } from "@/lib/visit-period";

type MonthlyVisitsData = {
  monthKey: string;
  count: number;
};

const DATA_DIR = path.join(process.cwd(), "data");
const MONTHLY_VISITS_PATH = path.join(DATA_DIR, "monthly-visits.json");

async function ensureMonthlyVisitsFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(MONTHLY_VISITS_PATH);
  } catch {
    const initialData: MonthlyVisitsData = {
      monthKey: getCurrentVisitMonthKey(),
      count: 0,
    };
    await fs.writeFile(
      MONTHLY_VISITS_PATH,
      `${JSON.stringify(initialData, null, 2)}\n`,
      "utf8",
    );
  }
}

async function readMonthlyVisitsData() {
  await ensureMonthlyVisitsFile();
  const raw = await fs.readFile(MONTHLY_VISITS_PATH, "utf8");
  const parsed = JSON.parse(raw) as Partial<MonthlyVisitsData>;
  const currentMonthKey = getCurrentVisitMonthKey();

  if (
    parsed.monthKey !== currentMonthKey ||
    typeof parsed.count !== "number" ||
    Number.isNaN(parsed.count)
  ) {
    const resetData: MonthlyVisitsData = {
      monthKey: currentMonthKey,
      count: 0,
    };
    await fs.writeFile(
      MONTHLY_VISITS_PATH,
      `${JSON.stringify(resetData, null, 2)}\n`,
      "utf8",
    );
    return resetData;
  }

  return {
    monthKey: parsed.monthKey,
    count: parsed.count,
  } as MonthlyVisitsData;
}

async function writeMonthlyVisitsData(data: MonthlyVisitsData) {
  await ensureMonthlyVisitsFile();
  await fs.writeFile(
    MONTHLY_VISITS_PATH,
    `${JSON.stringify(data, null, 2)}\n`,
    "utf8",
  );
}

export async function getMonthlyVisits() {
  const data = await readMonthlyVisitsData();

  return {
    count: data.count,
    monthKey: data.monthKey,
    monthLabel: formatVisitMonthLabel(data.monthKey),
  };
}

export async function incrementMonthlyVisits() {
  const data = await readMonthlyVisitsData();
  const nextData: MonthlyVisitsData = {
    monthKey: data.monthKey,
    count: data.count + 1,
  };

  await writeMonthlyVisitsData(nextData);

  return {
    count: nextData.count,
    monthKey: nextData.monthKey,
    monthLabel: formatVisitMonthLabel(nextData.monthKey),
  };
}
