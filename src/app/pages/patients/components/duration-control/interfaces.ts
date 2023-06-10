import { DurationFormData } from "../../../../@core/models/enums";

export interface DurationControl {
  durationSelected: DurationFormData,
  periodRange: {
    start: Date,
    end: Date
  },
  durationQuantity: number,
  durationUnit: string,
  periodEnd: Date
}
