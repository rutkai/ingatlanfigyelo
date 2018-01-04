export interface ParserStats {
  name: string;
  refresh: string;
}

export interface DbStats {
  lastHour: number;
  lastDay: number;
  lastWeek: number;
}

export interface Stats {
  parserStats: ParserStats[];
  db: DbStats;
}
