import type { YearDay } from "../domain/year";
import { DayHoverCard } from "./DayHoverCard";
import "../assets/style/DayCell.css";

interface Props {
  day: YearDay;
  onClick: () => void;
}

export function DayCell({ day, onClick }: Props) {
  return (
    <div
      className="day-cell"
      data-total={day.total}
      aria-label={`${day.date}: ${day.total} atividades`}
      onClick={onClick}
    >
      <div className="hover-card-wrapper">
        <DayHoverCard day={day} />
      </div>
    </div>
  );
}
