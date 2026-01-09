import { useState } from "react";
import type { YearDay, ActivityEntry } from "../domain/year";
import { ACTIVITY_META } from "../domain/activityMeta";

interface Props {
  day: YearDay;
  onClose: () => void;
  onAddEntry: (entry: Omit<ActivityEntry, "id">) => void;
  onDeleteEntry: (entryId: string) => void;
}

export function DayModal({ day, onClose, onAddEntry, onDeleteEntry }: Props) {
  const [activityType, setActivityType] = useState("movie");
  const [customType, setCustomType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalType =
      activityType === "custom" ? `custom:${customType.trim()}` : activityType;

    if (!finalType || (activityType === "custom" && !customType.trim())) {
      alert("Por favor, preencha o tipo de atividade");
      return;
    }

    onAddEntry({
      type: finalType,
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      timestamp: new Date().toISOString(),
    });

    setTitle("");
    setDescription("");
    setCustomType("");
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{day.date}</h2>
          <button onClick={onClose} className="close-btn">
            ✕
          </button>
        </div>

        {day.entries && day.entries.length > 0 && (
          <div className="entries-list">
            <h3>Atividades do dia</h3>
            {day.entries.map((entry) => (
              <div key={entry.id} className="entry-card">
                <div className="entry-header">
                  <span className="entry-icon">
                    {getActivityIcon(entry.type)}
                  </span>
                  <span className="entry-type">
                    {getActivityLabel(entry.type)}
                  </span>
                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="delete-btn"
                  >
                    🗑️
                  </button>
                </div>
                {entry.title && <h4>{entry.title}</h4>}
                {entry.description && <p>{entry.description}</p>}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-form">
          <h3>Adicionar atividade</h3>

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
