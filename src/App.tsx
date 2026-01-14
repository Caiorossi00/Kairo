import { useState } from "react";
import { DayModal } from "./ui/DayModal";
import { YearGrid } from "./ui/YearGrid";
import { AddEntryButton } from "./ui/AddEntryButton";
import { useDaysFromSupabase } from "./hooks/useDaysFromSupabase";
import type { YearDay } from "./domain/year";
import "./App.css";

export default function App() {
  const { days, loading, error, addEntry, deleteEntry } = useDaysFromSupabase();

  const [selectedDay, setSelectedDay] = useState<YearDay | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined
  );

  const handleDayClick = (day: YearDay) => {
    const currentDay = days.find((d) => d.date === day.date) || day;
    setSelectedDay(currentDay);
  };

  const handleCloseModal = () => {
    setSelectedDay(null);
    setShowAddModal(false);
    setSelectedDate(undefined);
  };

  if (loading) return <div className="app-container">Carregando...</div>;
  if (error)
    return <div className="app-container">Erro ao carregar dados: {error}</div>;

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="app-title-section">
          <h1 className="app-title">Kairo</h1>
          <p className="app-subtitle">Se você faz, o Kairo acompanha.</p>
        </div>
      </div>

      <YearGrid days={days} onDayClick={handleDayClick} />

      <AddEntryButton onClick={() => setShowAddModal(true)} />

      {selectedDay && (
        <DayModal
          day={selectedDay}
          selectedDate={selectedDate}
          onClose={handleCloseModal}
          onAddEntry={addEntry}
          onDeleteEntry={deleteEntry}
        />
      )}

      {showAddModal && (
        <DayModal
          onClose={handleCloseModal}
          onAddEntry={addEntry}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}
