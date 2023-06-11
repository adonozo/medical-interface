import { TimeCode } from "../../../../@core/models/types";
import { Moment } from "moment";

export interface FrequencyControl {
  frequencySelected: SelectedFrequency,
  when: { [key in TimeCode]: boolean },
  timeOfDay: Moment[],
  frequency: number
}

export enum SelectedFrequency {
  timesPerDay = 0,
  mealTime = 1,
  specificTimes = 2
}
