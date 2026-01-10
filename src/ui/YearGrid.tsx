import type { YearDay } from "../domain/year";
import { DayCell } from "./DayCell";
import "../assets/style/YearGrid.css";

interface Props {
  days: YearDay[];
  onDayClick: (day: YearDay) => void;
}

const MONTH_NAMES = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export function YearGrid({ days, onDayClick }: Props) {
  const weeks: YearDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const monthLabels: { month: string; column: number }[] = [];
  let currentMonth = -1;

  weeks.forEach((week, weekIdx) => {
    const firstDayOfWeek = week[0];
    if (firstDayOfWeek) {
      const month = new Date(firstDayOfWeek.date + "T00:00:00").getMonth();
      if (month !== currentMonth) {
        monthLabels.push({
          month: MONTH_NAMES[month],
          column: weekIdx,
        });
        currentMonth = month;
      }
    }
  });

  return (
    <div className="year-grid-container">
      <div
        className="month-labels"
        style={{ gridTemplateColumns: `repeat(${weeks.length}, 16px)` }}
      >
        {monthLabels.map((label, idx) => (
          <div
            key={idx}
            className="month-label"
            style={{ gridColumnStart: label.column + 1 }}
          >
            {label.month}
          </div>
        ))}
      </div>

      <div className="year-grid">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="week-column">
            {week.map((day) => (
              <DayCell
                key={day.date}
                day={day}
                onClick={() => onDayClick(day)}
              />
            ))}
            {Array.from({ length: 7 - week.length }).map((_, idx) => (
              <div key={`empty-${idx}`} className="empty-cell" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
