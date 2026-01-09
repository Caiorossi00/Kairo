import type { YearDay } from "../domain/year";
import { DayCell } from "./DayCell";

interface Props {
  days: YearDay[];
  onDayClick: (day: YearDay) => void;
}

export function YearGrid({ days, onDayClick }: Props) {
  const weeks: YearDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div style={styles.grid}>
      {weeks.map((week, weekIdx) => (
        <div key={weekIdx} style={styles.week}>
          {week.map((day) => (
            <DayCell key={day.date} day={day} onClick={() => onDayClick(day)} />
          ))}
        </div>
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "flex",
    gap: 4,
  },
  week: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 4,
  },
};
