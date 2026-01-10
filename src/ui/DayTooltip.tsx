import type { Breakdown } from "../domain/breakdown";
import { ACTIVITY_META } from "../domain/activityMeta";
import "../assets/style/DayTooltip.css";

interface Props {
  date: string;
  breakdown: Breakdown;
}

export function DayTooltip({ date, breakdown }: Props) {
  return (
    <div className="tooltip">
      <strong>{date}</strong>
      <ul className="tooltip-list">
        {Object.entries(breakdown).map(([key, value]) => {
          const isCustom = key.startsWith("custom:");
          const label = isCustom
            ? key.replace("custom:", "")
            : ACTIVITY_META[key]?.label ?? key;
          const icon = isCustom ? "✍️" : ACTIVITY_META[key]?.icon ?? "❓";
          return (
            <li key={key} className="tooltip-item">
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
