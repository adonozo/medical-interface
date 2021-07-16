import {Dosage, Medication} from "fhir/r4";

export interface Treatment {
  id: string,
  medication: Medication,
  dosage: Dosage,
  date: Date
}
