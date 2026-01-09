import type { YearDay } from "../domain/year";
import { DayTooltip } from "./DayTooltip";

interface Props {
  day: YearDay;
  onClick: () => void;
}

export function DayCell({ day, onClick }: Props) {
  return (
    <div
      className="day-cell"
      style={{
        ...styles.cell,
        background: getColor(day.total),
      }}
      aria-label={`${day.date}: ${day.total} atividades`}
      onClick={onClick}
    >
      {day.total > 0 && (
        <div className="tooltip-wrapper">
          <DayTooltip date={day.date} breakdown={day.breakdown} />
        </div>
      )}
    </div>
  );
}

function getColor(total: number) {
  if (total === 0) return "#1f1f1f";
  if (total <= 2) return "#355f3b";
  if (total <= 4) return "#4caf50";
  return "#81c784";
}

const styles = {
  cell: {
    width: 14,
    height: 14,
    borderRadius: 3,
    position: "relative" as const,
    cursor: "pointer",
  },
};
