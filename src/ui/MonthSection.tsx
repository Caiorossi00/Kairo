import type { YearDay } from "../domain/year";
import { DayCell } from "./DayCell";

interface Props {
  monthName: string;
  days: YearDay[];
  onDayClick: (day: YearDay) => void;
}

export function MonthSection({ monthName, days, onDayClick }: Props) {
  const weeks: (YearDay | null)[][] = [];

  const firstDay = new Date(days[0].date + "T00:00:00");
  const firstDayOfWeek = firstDay.getDay();

  const allDays: (YearDay | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...days,
  ];

  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  return (
    <div className="month-section">
      <h3 className="month-title">{monthName}</h3>

      <div className="weekday-labels">
        <span>Dom</span>
        <span>Seg</span>
        <span>Ter</span>
        <span>Qua</span>
        <span>Qui</span>
        <span>Sex</span>
        <span>Sáb</span>
      </div>

      <div className="month-grid">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="week-row">
            {week.map((day, dayIdx) => (
              <div key={dayIdx} className="day-wrapper">
                {day ? (
                  <DayCell day={day} onClick={() => onDayClick(day)} />
                ) : (
                  <div className="empty-day" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
