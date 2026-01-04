import type { Breakdown } from "../domain/breakdown";
import { ACTIVITY_META } from "../domain/activityMeta";

interface Props {
  date: string;
  breakdown: Breakdown;
}

export function DayTooltip({ date, breakdown }: Props) {
  return (
    <div style={styles.tooltip}>
      <strong>{date}</strong>

      <ul style={styles.list}>
        {Object.entries(breakdown).map(([key, value]) => {
          const isCustom = key.startsWith("custom:");
          const label = isCustom
            ? key.replace("custom:", "")
            : ACTIVITY_META[key]?.label ?? key;

          const icon = isCustom ? "✍️" : ACTIVITY_META[key]?.icon ?? "❓";

          return (
            <li key={key} style={styles.item}>
              <span>{icon}</span>
              <span>{label}</span>
              <span>{value}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const styles = {
  tooltip: {
    background: "#111",
    color: "#fff",
    padding: "8px 10px",
    borderRadius: 8,
    fontSize: 12,
    minWidth: 160,
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: "6px 0 0 0",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    gap: 6,
  },
};
