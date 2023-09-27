import { Observation } from "fhir/r4";

export function getDisplayValue(observation: Observation): string {
  return `${observation.valueQuantity.value} ${observation.valueQuantity.unit}`;
}
