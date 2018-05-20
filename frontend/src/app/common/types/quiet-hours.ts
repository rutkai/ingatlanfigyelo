export interface QuietHours {
  start: QuietHourTime;
  end: QuietHourTime;
}

export interface QuietHourTime {
  hours: number;
  minutes: number;
  timezone: string;
}
