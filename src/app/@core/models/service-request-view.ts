import { DayCode } from "./types";

export interface ServiceRequestView {
  id: string;
  patientInstruction: string;
  duration: string;
  days?: string;
  dayWhen: {
    day: DayCode,
    when: string[]
  } [];
}
