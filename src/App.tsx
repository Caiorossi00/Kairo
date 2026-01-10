import { DayModal } from "./ui/DayModal";
import { YearGrid } from "./ui/YearGrid";
import { usePersistedYear } from "./hooks/usePersistedYear";
import { year2026 } from "./mocks/year";
import type { YearDay, ActivityEntry } from "./domain/year";
import { useState } from "react";

export default function App() {
  const { days, setDays, resetData } = usePersistedYear(year2026);
  const [selectedDay, setSelectedDay] = useState<YearDay | null>(null);

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

  return (
    <div style={{ padding: 24, background: "#0f0f0f", minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 style={{ color: "#fff", margin: 0 }}>Kairo</h2>
        <button
          onClick={resetData}
          style={{
            padding: "8px 16px",
            background: "#333",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Resetar dados
        </button>
      </div>

      <YearGrid days={days} onDayClick={handleDayClick} />

      {selectedDay && (
        <DayModal
          day={selectedDay}
          onClose={() => setSelectedDay(null)}
          onAddEntry={(entry) => handleAddEntry(selectedDay.date, entry)}
          onDeleteEntry={(entryId) =>
            handleDeleteEntry(selectedDay.date, entryId)
          }
        />
      )}
    </div>
  );
}
