import type { YearDay } from "../domain/year";

// Função para gerar todos os dias de 2026
function generateYear2026(): YearDay[] {
  const days: YearDay[] = [];
  const year = 2026;

  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD

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
