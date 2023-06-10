import { FrequencyFormData } from "../../medication-request-form/form-data";
import { TimeCode } from "../../../../@core/models/types";
import { Moment } from "moment";

export interface FrequencyControl {
  frequencySelected: FrequencyFormData,
  when: { [key in TimeCode]: boolean },
  timeOfDay: Moment[],
  frequency: number
}
