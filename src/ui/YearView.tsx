import type { YearDay } from "../domain/year";
import { MonthSection } from "./MonthSection";
import "../assets/style/YearView.css";

interface Props {
  days: YearDay[];
  onDayClick: (day: YearDay) => void;
}

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function YearView({ days, onDayClick }: Props) {
  const daysByMonth: YearDay[][] = Array.from({ length: 12 }, () => []);

  days.forEach((day) => {
    const month = new Date(day.date + "T00:00:00").getMonth();
    daysByMonth[month].push(day);
  });

  return (
    <div className="year-view">
      {daysByMonth.map((monthDays, index) => {
        if (monthDays.length === 0) return null;

        return (
          <MonthSection
            key={index}
            monthName={MONTH_NAMES[index]}
            days={monthDays}
            onDayClick={onDayClick}
          />
        );
      })}
    </div>
  );
}
