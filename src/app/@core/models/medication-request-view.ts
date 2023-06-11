export interface MedicationRequestView {
  id: string;
  medicationName: string;
  dosage: {
    dosage: string;
    medicationNote: string;
    duration: string;
    when: string;
    frequency: string;
  }[]
}
