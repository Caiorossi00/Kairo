import { useEffect, useState } from "react";
import type { YearDay, ActivityEntry } from "../domain/year";
import { ACTIVITY_META } from "../domain/activityMeta";
import { MONTH_NAMES } from "../domain/constants";
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

  const currentDate = day?.date ?? selectedDate;

  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  useEffect(() => {
    if (!currentDate) return;

    const [, month, day] = currentDate.split("-").map(Number);
    setSelectedMonth(month);
    setSelectedDay(day);
  }, [currentDate]);

  const getDaysInMonth = (month: number) => {
    return new Date(2026, month, 0).getDate();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalType =
      activityType === "custom" ? `custom:${customType.trim()}` : activityType;

    if (!finalType || (activityType === "custom" && !customType.trim())) {
      alert("Por favor, preencha o tipo de atividade");
      return;
    }

    const dateToUse =
      currentDate ??
      `2026-${String(selectedMonth).padStart(2, "0")}-${String(
        selectedDay
      ).padStart(2, "0")}`;

    onAddEntry(dateToUse, {
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

    onClose();
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    });
  };

  const getActivityLabel = (type: string) =>
    type.startsWith("custom:")
      ? type.replace("custom:", "")
      : ACTIVITY_META[type]?.label ?? type;

  const getActivityIcon = (type: string) =>
    type.startsWith("custom:") ? "✍️" : ACTIVITY_META[type]?.icon ?? "❓";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {currentDate ? formatDate(currentDate) : "Adicionar atividade"}
          </h2>
          <button onClick={onClose} className="close-btn">
            ✕
          </button>
        </div>

        {day?.entries?.length ? (
          <div className="entries-list">
            <h3>Atividades do dia</h3>
            {day.entries.map((entry) => (
              <div key={entry.id} className="entry-card">
                {entry.images?.length && (
                  <img
                    src={entry.images[0]}
                    alt={entry.title || ""}
                    className="entry-card-image"
                  />
                )}
                <div className="entry-card-content">
                  <div className="entry-header">
                    <span>{getActivityIcon(entry.type)}</span>
                    <span>{getActivityLabel(entry.type)}</span>
                    {onDeleteEntry && (
                      <button
                        className="delete-btn"
                        onClick={() => onDeleteEntry(entry.id)}
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
        ) : null}

        <form onSubmit={handleSubmit} className="add-form">
          <h3>{day ? "Adicionar outra atividade" : "Nova atividade"}</h3>

          {!currentDate && (
            <div className="date-selectors">
              <div className="form-group">
                <label>Mês</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    const m = Number(e.target.value);
                    setSelectedMonth(m);
                    const max = getDaysInMonth(m);
                    if (selectedDay > max) setSelectedDay(max);
                  }}
                >
                  {MONTH_NAMES.map((name, idx) => (
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
                  ).map((d) => (
                    <option key={d} value={d}>
                      {d}
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
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label>Título</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="form-group">
            <label>URL da imagem</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
