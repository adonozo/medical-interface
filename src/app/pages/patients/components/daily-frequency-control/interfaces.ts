import { DayCode } from "../../../../@core/models/types";

export interface DailyFrequencyControl extends Days {
  dailyFrequency: SelectedDailyFrequency
}

type Days = { [day in DayCode]: boolean }

export enum SelectedDailyFrequency {
  everyday = 0,
  specificDays = 1,
}
