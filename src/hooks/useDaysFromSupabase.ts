import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { YearDay, ActivityEntry } from "../domain/year";

const YEAR = 2026;

function generateYearDays(year: number): YearDay[] {
  const days: YearDay[] = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const date = d.toISOString().split("T")[0];
    days.push({ date, entries: [], total: 0, breakdown: {} });
  }

  return days;
}

export function useDaysFromSupabase() {
  const [days, setDays] = useState<YearDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const baseDays = generateYearDays(YEAR);

      const { data, error } = await supabase.from("activities").select("*");

      if (error) {
        setError(error.message);
        setDays(baseDays);
        setLoading(false);
        return;
      }

      const dayMap = new Map<string, YearDay>();
      baseDays.forEach((day) => dayMap.set(day.date, day));

      data?.forEach((row) => {
        const day = dayMap.get(row.date);
        if (!day) return;

        const entry: ActivityEntry = {
          id: row.id,
          type: row.type,
          title: row.title ?? undefined,
          description: row.description ?? undefined,
          images: row.image_url ? [row.image_url] : undefined,
          timestamp: row.created_at,
        };

        day.entries.push(entry);
        day.total = day.entries.length;
      });

      setDays(baseDays);
      setLoading(false);
    }

    load();
  }, []);

  async function addEntry(date: string, entry: Omit<ActivityEntry, "id">) {
    const { data, error } = await supabase
      .from("activities")
      .insert([
        {
          date,
          type: entry.type,
          title: entry.title,
          description: entry.description,
          image_url: entry.images?.[0] ?? null,
          user_id: null,
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("Erro ao adicionar:", error);
      return;
    }

    setDays((prev) =>
      prev.map((day) => {
        if (day.date !== date) return day;
        return {
          ...day,
          entries: [
            ...day.entries,
            {
              id: data.id,
              type: data.type,
              title: data.title ?? undefined,
              description: data.description ?? undefined,
              images: data.image_url ? [data.image_url] : undefined,
              timestamp: data.created_at,
            },
          ],
          total: day.entries.length + 1,
        };
      })
    );
  }

  async function deleteEntry(entryId: string) {
    const { error } = await supabase
      .from("activities")
      .delete()
      .eq("id", entryId);

    if (error) {
      console.error("Erro ao deletar:", error);
      return;
    }

    setDays((prev) =>
      prev.map((day) => ({
        ...day,
        entries: day.entries.filter((e) => e.id !== entryId),
        total: day.entries.filter((e) => e.id !== entryId).length,
      }))
    );
  }

  return { days, loading, error, addEntry, deleteEntry };
}
