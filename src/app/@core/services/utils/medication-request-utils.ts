import { Dosage, Medication, MedicationRequest, Quantity, TimingRepeat } from "fhir/r5";
import { Extensions, ResourcePath, ResourceType } from "../data/constants";
import { MedicationRequestView } from "../../models/medication-request-view";
import * as utils from "./utils";
import { dailyFrequencyString, dayStringFromCode, sortDayCodes } from "./utils";

export const getMedicationReference = (medication: Medication): string => ResourcePath.MEDICATION + medication.id;

/**
 * Maps a `MedicationRequest` into a `MedicationRequestView`, useful for displaying information.
 * @param medicationRequest
 */
export function mapToMedicationRequestView(medicationRequest: MedicationRequest): MedicationRequestView {
  const medication = getMedicationFromRequest(medicationRequest);
  return {
    id: medicationRequest.id ?? '',
    medicationName: getMedicationName(medication),
    dosage: medicationRequest.dosageInstruction?.map(dosageInstruction => {
      const quantity = getDoseQuantity(dosageInstruction);
      return {
        dosage: getDosageText(quantity),
        medicationNote: getMedicationNote(medicationRequest),
        duration: utils.getStringDuration(dosageInstruction.timing?.repeat),
        when: getWhenToTakeText(dosageInstruction.timing?.repeat),
        frequency: getFrequencyText(dosageInstruction.timing?.repeat),
      }
    }) ?? []
  };
}

/**
 * Gets the patient note from a `MedicationRequest`, which is stored in the `note[0]` property by convention. Returns an
 * empty string if the property doesn't exist.
 * @param medicationRequest
 */
export function getMedicationNote(medicationRequest: MedicationRequest | undefined): string {
  if (!medicationRequest?.note || !medicationRequest.note[0]) {
    return '';
  }

  return medicationRequest.note[0].text;
}

/**
 * Gets the contained `Medication` from a `MedicationRequest`. There is a single `Medication` per request by convention.
 * Returns `undefined` if the contained `Medication` is not found.
 * @param medicationRequest
 */
export function getMedicationFromRequest(medicationRequest: MedicationRequest): Medication | undefined {
  if (!medicationRequest.contained?.[0]
    || medicationRequest.contained[0].resourceType !== ResourceType.Medication
  ) {
    return undefined;
  }

  return medicationRequest.contained[0] as Medication;
}

function getDoseQuantity(dosage: Dosage): Quantity | undefined {
  if (!dosage.doseAndRate?.[0]) {
    return undefined;
  }

  return dosage.doseAndRate[0].doseQuantity;
}

function getDosageText(dosageQuantity: Quantity | undefined): string {
  if (!dosageQuantity || !dosageQuantity.extension) {
    return '';
  }

  const unitExtension = dosageQuantity.extension.find(extension => extension.url === Extensions.QUANTITY_UNIT_NAME);
  const unitName = unitExtension ? unitExtension.valueString : '';
  return dosageQuantity.value + ' ' + unitName;
}

function getWhenToTakeText(timingRepeat: TimingRepeat | undefined): string {
  if (!timingRepeat) {
    return '';
  }

  if (timingRepeat.dayOfWeek && Array.isArray(timingRepeat.dayOfWeek)) {
    return timingRepeat.dayOfWeek
      .sort(sortDayCodes)
      .map(day => dayStringFromCode(day))
      .join(', ');
  }

  return $localize`Every day`;
}

function getFrequencyText(timingRepeat: TimingRepeat | undefined): string {
  if (!timingRepeat) {
    return '';
  }

  if (timingRepeat.when && Array.isArray(timingRepeat.when)) {
    return whenArrayToString(timingRepeat.when);
  }

  if (timingRepeat.timeOfDay && Array.isArray(timingRepeat.timeOfDay)) {
    return timingRepeat.timeOfDay.join(', ');
  }

  return timingRepeat.frequency ? dailyFrequencyString(timingRepeat.frequency) : '';
}

function getMedicationName(medication: Medication | undefined) : string {
  if (!medication?.code?.coding?.[0]) {
    return '';
  }

  return medication.code.coding[0].display ?? '';
}

const whenArrayToString = (when: string[]): string => when
  .map(whenCode => utils.timingToString(whenCode))
  .join(', ');
