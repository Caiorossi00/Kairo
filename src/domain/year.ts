export type Breakdown = Record<string, number>;

export interface YearDay {
  date: string; // YYYY-MM-DD
  total: number;
  breakdown: Breakdown;
}
