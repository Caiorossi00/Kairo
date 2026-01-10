import { useState } from "react";
import type { YearDay, ActivityEntry } from "../domain/year";
import { ACTIVITY_META } from "../domain/activityMeta";
import "../assets/style/DayModal.css";

interface Props {
  day?: YearDay;
  selectedDate?: string;
  onClose: () => void;
  onAddEntry: (date: string, entry: Omit<ActivityEntry, "id">) => void;
  onDeleteEntry?: (entryId: string) => void;
}

export function DayModal({
  day,
  selectedDate,
  onClose,
  onAddEntry,
  onDeleteEntry,
}: Props) {
  const [activityType, setActivityType] = useState("movie");
  const [customType, setCustomType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    selectedDate ? new Date(selectedDate + "T00:00:00").getMonth() + 1 : 1
  );
  const [selectedDay, setSelectedDay] = useState(
    selectedDate ? new Date(selectedDate + "T00:00:00").getDate() : 1
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const month = selectedMonth.toString().padStart(2, "0");
    const dayNum = selectedDay.toString().padStart(2, "0");
    const chosenDate = `2026-${month}-${dayNum}`;

    const finalType =
      activityType === "custom" ? `custom:${customType.trim()}` : activityType;

    if (!finalType || (activityType === "custom" && !customType.trim())) {
      alert("Por favor, preencha o tipo de atividade");
      return;
    }

    onAddEntry(chosenDate, {
      type: finalType,
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      images: imageUrl.trim() ? [imageUrl.trim()] : undefined,
      timestamp: new Date().toISOString(),
    });

    setTitle("");
    setDescription("");
    setCustomType("");
    setImageUrl("");

    if (!day) {
      onClose();
    }
  };

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
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    });
  };

  const getDaysInMonth = (month: number) => {
    return new Date(2026, month, 0).getDate();
  };

  const monthNames = [
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{day ? formatDate(day.date) : "Adicionar Atividade"}</h2>
          <button onClick={onClose} className="close-btn">
            ✕
          </button>
        </div>

        {day && day.entries && day.entries.length > 0 && (
          <div className="entries-list">
            <h3>Atividades do dia</h3>
            {day.entries.map((entry) => (
              <div key={entry.id} className="entry-card">
                {entry.images && entry.images.length > 0 && (
                  <img
                    src={entry.images[0]}
                    alt={entry.title || ""}
                    className="entry-card-image"
                  />
                )}
                <div className="entry-card-content">
                  <div className="entry-header">
                    <span className="entry-icon">
                      {getActivityIcon(entry.type)}
                    </span>
                    <span className="entry-type">
                      {getActivityLabel(entry.type)}
                    </span>
                    {onDeleteEntry && (
                      <button
                        onClick={() => onDeleteEntry(entry.id)}
                        className="delete-btn"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  {entry.title && <h4>{entry.title}</h4>}
                  {entry.description && <p>{entry.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-form">
          <h3>{day ? "Adicionar outra atividade" : "Nova atividade"}</h3>

          {!day && (
            <div className="date-selectors">
              <div className="form-group">
                <label>Mês</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(Number(e.target.value));
                    const maxDays = getDaysInMonth(Number(e.target.value));
                    if (selectedDay > maxDays) {
                      setSelectedDay(maxDays);
                    }
                  }}
                >
                  {monthNames.map((name, idx) => (
                    <option key={idx} value={idx + 1}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Dia</label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(Number(e.target.value))}
                >
                  {Array.from(
                    { length: getDaysInMonth(selectedMonth) },
                    (_, i) => i + 1
                  ).map((dayNum) => (
                    <option key={dayNum} value={dayNum}>
                      {dayNum}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Tipo</label>
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
            >
              {Object.entries(ACTIVITY_META).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.icon} {meta.label}
                </option>
              ))}
              <option value="custom">✍️ Personalizado</option>
            </select>
          </div>

          {activityType === "custom" && (
            <div className="form-group">
              <label>Nome da atividade</label>
              <input
                type="text"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder="ex: freelance, estudo, leitura"
              />
            </div>
          )}

          <div className="form-group">
            <label>Título (opcional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                activityType === "movie"
                  ? "ex: Oppenheimer"
                  : "ex: Treino de peito"
              }
            />
          </div>

          <div className="form-group">
            <label>URL da imagem (opcional)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/poster.jpg"
            />
            {imageUrl && (
              <div className="image-preview">
                <img src={imageUrl} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Descrição (opcional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione detalhes..."
              rows={3}
            />
          </div>

          <button type="submit" className="submit-btn">
            Adicionar
          </button>
        </form>
      </div>
    </div>
  );
}
