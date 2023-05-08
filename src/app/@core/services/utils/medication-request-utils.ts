import { Dosage, Medication, MedicationRequest, Quantity, TimingRepeat } from "fhir/r4";
import { Extensions, ResourceType } from "../data/constants";
import { MedicationRequestView } from "../../models/medication-request-view";
import * as utils from "./utils";
import { dailyFrequencyString, dayStringFromCode, sortDayCodes } from "./utils";

export function mapToMedicationRequestView(medicationRequest: MedicationRequest): MedicationRequestView {
  const medication = getMedicationFromRequest(medicationRequest);
  return {
    id: medicationRequest.id,
    medicationName: medication?.code.coding[0].display ?? '',
    dosage: medicationRequest.dosageInstruction.map(dosageInstruction => {
      const quantity = getDoseQuantity(dosageInstruction);
      return {
        dosage: getDosageText(quantity),
        medicationNote: getMedicationNote(medicationRequest),
        duration: utils.getTimingStringDuration(dosageInstruction.timing.repeat),
        when: getWhenToTakeText(dosageInstruction.timing.repeat),
        frequency: getFrequencyText(dosageInstruction.timing.repeat),
      }
    })
  };
}

export function getMedicationNote(medicationRequest: MedicationRequest): string {
  if (!medicationRequest.note || medicationRequest.note.length === 0) {
    return '';
  }

  return medicationRequest.note[0].text;
}

export function getMedicationFromRequest(medicationRequest: MedicationRequest): Medication {
  if (!medicationRequest.contained
    || medicationRequest.contained.length === 0
    || medicationRequest.contained[0].resourceType !== ResourceType.Medication
  ) {
    return undefined;
  }

  return medicationRequest.contained[0] as Medication;
}

function getDoseQuantity(dosage: Dosage): Quantity | undefined {
  if (!dosage.doseAndRate || dosage.doseAndRate.length === 0) {
    return undefined;
  }

  return dosage.doseAndRate[0].doseQuantity;
}

function getDosageText(dosageQuantity: Quantity | undefined): string {
  if (!dosageQuantity) {
    return '';
  }

  const unitExtension = dosageQuantity.extension.find(extension => extension.url === Extensions.QUANTITY_UNIT_NAME);
  const unitName = unitExtension ? unitExtension.valueString : '';
  return dosageQuantity.value + ' ' + unitName;
}

function getWhenToTakeText(timingRepeat: TimingRepeat): string {
  if (timingRepeat.dayOfWeek && Array.isArray(timingRepeat.dayOfWeek)) {
    return timingRepeat.dayOfWeek
      .sort(sortDayCodes)
      .map(day => dayStringFromCode(day))
      .join(', ');
  }

  return $localize`Every day`;
}

function getFrequencyText(timingRepeat: TimingRepeat): string {
  if (timingRepeat.when && Array.isArray(timingRepeat.when)) {
    return whenArrayToString(timingRepeat.when);
  }

  if (timingRepeat.timeOfDay && Array.isArray(timingRepeat.timeOfDay)) {
    return timingRepeat.timeOfDay.join(', ');
  }

  return dailyFrequencyString(timingRepeat.frequency);
}

const whenArrayToString = (when: string[]): string => when
  .map(whenCode => utils.timingToString(whenCode))
  .join(', ');
