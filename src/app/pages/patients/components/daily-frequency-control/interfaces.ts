import { DailyFrequencyFormData } from "../../medication-request-form/form-data";
import { DayCode } from "../../../../@core/models/types";

export interface DailyFrequencyControl extends Days {
  dailyFrequency: DailyFrequencyFormData
}

type Days = { [day in DayCode]: boolean }
