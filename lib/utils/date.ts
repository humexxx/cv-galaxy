// Postgres `date` columns arrive as "YYYY-MM-DD" and become UTC-midnight Dates.
// Formatting those in local time shifts them a day back west of Greenwich, so
// the site (UTC-6) and the PDF (rendered on Vercel, UTC) disagreed on the month.
// Everything here is pinned to UTC so both agree.
const MONTH_YEAR = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function toDateOnlyString(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatMonthYear(value: Date | string | "Present"): string {
  if (value === "Present") return "Present";

  const date =
    typeof value === "string"
      ? new Date(`${value.slice(0, 10)}T00:00:00Z`)
      : value;

  if (Number.isNaN(date.getTime())) return "";

  return MONTH_YEAR.format(date);
}
