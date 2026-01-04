import { useState } from "react";
import type { YearDay } from "../domain/year";
import { DayTooltip } from "./DayTooltip";

interface Props {
  day: YearDay;
}

export function DayCell({ day }: Props) {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        ...styles.cell,
        background: getColor(day.total),
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && day.total > 0 && (
        <div style={styles.tooltipWrapper}>
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
  tooltipWrapper: {
    position: "absolute" as const,
    top: -8,
    left: 18,
    zIndex: 10,
  },
};
