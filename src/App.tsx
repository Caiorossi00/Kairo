import { useState } from "react";
import { DayModal } from "./ui/DayModal";
import { YearGrid } from "./ui/YearGrid";
import { AddEntryButton } from "./ui/AddEntryButton";
import { usePersistedYear } from "./hooks/usePersistedYear";
import { year2026 } from "./mocks/year";
import type { YearDay, ActivityEntry } from "./domain/year";
import "./App.css";

export default function App() {
  const { days, setDays, resetData } = usePersistedYear(year2026);
  const [selectedDay, setSelectedDay] = useState<YearDay | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddEntry = (
    dayDate: string,
    entry: Omit<ActivityEntry, "id">
  ) => {
    setDays((prevDays) =>
      prevDays.map((day) => {
        if (day.date !== dayDate) return day;

        const newEntry: ActivityEntry = {
          ...entry,
          id: crypto.randomUUID(),
        };

        const updatedEntries = [...(day.entries || []), newEntry];
        const newBreakdown = { ...day.breakdown };
        newBreakdown[entry.type] = (newBreakdown[entry.type] || 0) + 1;

        const updatedDay = {
          ...day,
          entries: updatedEntries,
          total: day.total + 1,
          breakdown: newBreakdown,
        };

        if (selectedDay?.date === dayDate) {
          setSelectedDay(updatedDay);
        }

        return updatedDay;
      })
    );
  };

  const handleDeleteEntry = (dayDate: string, entryId: string) => {
    setDays((prevDays) =>
      prevDays.map((day) => {
        if (day.date !== dayDate) return day;

        const entryToDelete = day.entries?.find((e) => e.id === entryId);
        if (!entryToDelete) return day;

        const updatedEntries =
          day.entries?.filter((e) => e.id !== entryId) || [];
        const newBreakdown = { ...day.breakdown };
        newBreakdown[entryToDelete.type] = Math.max(
          0,
          (newBreakdown[entryToDelete.type] || 0) - 1
        );
        if (newBreakdown[entryToDelete.type] === 0) {
          delete newBreakdown[entryToDelete.type];
        }

        const updatedDay = {
          ...day,
          entries: updatedEntries,
          total: Math.max(0, day.total - 1),
          breakdown: newBreakdown,
        };

        if (selectedDay?.date === dayDate) {
          setSelectedDay(updatedDay);
        }

        return updatedDay;
      })
    );
  };

  const handleDayClick = (day: YearDay) => {
    const currentDay = days.find((d) => d.date === day.date) || day;
    setSelectedDay(currentDay);
  };

  const handleCloseModal = () => {
    setSelectedDay(null);
    setShowAddModal(false);
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="app-title-section">
          <h1 className="app-title">Kairo</h1>
          <p className="app-subtitle">Lorem Ipsum</p>
        </div>
        <button onClick={resetData} className="reset-button">
          Resetar dados
        </button>
      </div>

      <YearGrid days={days} onDayClick={handleDayClick} />

      <AddEntryButton onClick={() => setShowAddModal(true)} />

      {selectedDay && (
        <DayModal
          day={selectedDay}
          onClose={handleCloseModal}
          onAddEntry={(date, entry) => handleAddEntry(date, entry)}
          onDeleteEntry={(entryId) =>
            handleDeleteEntry(selectedDay.date, entryId)
          }
        />
      )}

      {showAddModal && (
        <DayModal onClose={handleCloseModal} onAddEntry={handleAddEntry} />
      )}
    </div>
  );
}
