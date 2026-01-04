import type { YearDay } from "../domain/year";
import { DayCell } from "./DayCell";

interface Props {
  days: YearDay[];
}

export function YearGrid({ days }: Props) {
  return (
    <div style={styles.grid}>
      {days.map((day) => (
        <DayCell key={day.date} day={day} />
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(53, 16px)",
    gap: 4,
  },
};
