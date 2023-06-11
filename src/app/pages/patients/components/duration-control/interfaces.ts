export interface DurationControl {
  durationSelected: SelectedDuration,
  periodRange: {
    start: Date,
    end: Date
  },
  durationQuantity: number,
  durationUnit: string,
  periodEnd: Date
}

export enum SelectedDuration {
  duration = 0,
  period = 1,
  untilNext = 2
}
