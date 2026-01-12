import type { YearDay } from "../domain/year";

function generateYear2026(): YearDay[] {
  const days: YearDay[] = [];
  const year = 2026;

  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = month.toString().padStart(2, "0");
      const dayStr = day.toString().padStart(2, "0");
      const dateStr = `${year}-${monthStr}-${dayStr}`;

      days.push({
        date: dateStr,
        total: 0,
        breakdown: {},
      });
    }
  }

  return days;
}

export const year2026: YearDay[] = generateYear2026();
