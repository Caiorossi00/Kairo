import type { Breakdown } from "./breakdown";

export interface ActivityEntry {
  id: string;
  type: string;
  title?: string;
  description?: string;
  images?: string[];
  timestamp?: string;
}

export interface YearDay {
  date: string;
  total: number;
  breakdown: Breakdown;
  entries?: ActivityEntry[];
}
