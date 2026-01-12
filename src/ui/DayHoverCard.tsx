import type { YearDay } from "../domain/year";
import { ACTIVITY_META } from "../domain/activityMeta";
import "../assets/style/DayHoverCard.css";

interface Props {
  day: YearDay;
}

export function DayHoverCard({ day }: Props) {
  const getActivityLabel = (type: string) => {
    if (type.startsWith("custom:")) {
      return type.replace("custom:", "");
    }
    return ACTIVITY_META[type]?.label || type;
  };

  const getActivityIcon = (type: string) => {
    if (type.startsWith("custom:")) {
      return "✍️";
    }
    return ACTIVITY_META[type]?.icon || "❓";
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      weekday: "short",
    });
  };

  return (
    <div className="day-hover-card">
      <div className="card-header">
        <div className="card-date">{formatDate(day.date)}</div>
        <div className="card-total">
          {day.total} {day.total === 1 ? "atividade" : "atividades"}
        </div>
      </div>

      {day.entries && day.entries.length > 0 ? (
        <div className="card-entries">
          {day.entries.map((entry) => (
            <div key={entry.id} className="entry-item">
              {entry.images && entry.images.length > 0 ? (
                <div className="entry-with-image">
                  <img
                    src={entry.images[0]}
                    alt={entry.title || getActivityLabel(entry.type)}
                    className="entry-image"
                  />
                  <div className="entry-info">
                    <div className="entry-type-badge">
                      <span>{getActivityIcon(entry.type)}</span>
                      <span>{getActivityLabel(entry.type)}</span>
                    </div>
                    {entry.title && (
                      <div className="entry-title">{entry.title}</div>
                    )}
                    {entry.description && (
                      <div className="entry-description">
                        {entry.description}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="entry-simple">
                  <div className="entry-type-badge">
                    <span>{getActivityIcon(entry.type)}</span>
                    <span>{getActivityLabel(entry.type)}</span>
                  </div>
                  {entry.title && (
                    <div className="entry-title">{entry.title}</div>
                  )}
                  {entry.description && (
                    <div className="entry-description">{entry.description}</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card-empty">Sem atividades registradas</div>
      )}
    </div>
  );
}
