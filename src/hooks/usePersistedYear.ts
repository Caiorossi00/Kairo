import { useState, useEffect } from "react";
import type { YearDay } from "../domain/year";

const STORAGE_KEY = "kairo-year-2026";

export function usePersistedYear(initialData: YearDay[]) {
  const [days, setDays] = useState<YearDay[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error("Erro ao carregar dados salvos:", error);
        return initialData;
      }
    }
    return initialData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
  }, [days]);

  const resetData = () => {
    setDays(initialData);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { days, setDays, resetData };
}
