export interface ServiceRequestView {
  id: string;
  patientInstruction: string;
  duration: string;
  days?: string;
  dayWhen: {
    day: string,
    when: string
  } [];
}
