import { Observation } from "fhir/r5";

/**
 * Gets the observation value (value + unit) as a human-friendly string
 * @param observation The observation to get the value from
 */
export function getDisplayValue(observation: Observation): string {
  return `${observation.valueQuantity?.value} ${observation.valueQuantity?.unit}`;
}
