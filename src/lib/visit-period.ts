const VISIT_TIME_ZONE = "Africa/Johannesburg";

export function getCurrentVisitMonthKey(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    timeZone: VISIT_TIME_ZONE,
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;

  if (!year || !month) {
    throw new Error("Could not build visit month key.");
  }

  return `${year}-${month}`;
}

export function formatVisitMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-");
  const monthIndex = Number(month) - 1;
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${monthNames[monthIndex] ?? "Unknown"} ${year}`;
}
