import { useState } from "react";
import { YearGrid } from "./ui/YearGrid";
import { DayModal } from "./ui/DayModal";
import { year2026 } from "./mocks/year";
import type { YearDay, ActivityEntry } from "./domain/year";

export default function App() {
  const [days, setDays] = useState<YearDay[]>(year2026);
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

        return {
          ...day,
          entries: updatedEntries,
          total: day.total + 1,
          breakdown: newBreakdown,
        };
      })
    );

    setSelectedDay((prev) => {
      if (!prev || prev.date !== dayDate) return prev;
      const updated = days.find((d) => d.date === dayDate);
      return updated || prev;
    });
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

        return {
          ...day,
          entries: updatedEntries,
          total: Math.max(0, day.total - 1),
          breakdown: newBreakdown,
        };
      })
    );
  };

  return (
    <div style={{ padding: 24, background: "#0f0f0f", minHeight: "100vh" }}>
      <h2 style={{ color: "#fff" }}>Kairo</h2>
      <YearGrid days={days} onDayClick={setSelectedDay} />

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
