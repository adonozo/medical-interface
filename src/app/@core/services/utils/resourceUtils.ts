import {
  Bundle,
  ContactPoint,
  DomainResource, Dosage,
  Medication, MedicationRequest,
  Patient,
  Quantity,
  Reference,
  ServiceRequest, TimingRepeat
} from "fhir/r4";
import { Extensions, ResourcePath, ResourceType } from "../data/constants";
import { InternalPatient, PatientPhoneContact } from "../../models/internalPatient";
import { PaginatedResult } from "../../models/paginatedResult";
import { ServiceRequestView } from "../../models/service-request-view";
import * as utils from "./utils";
import { MedicationRequestView } from "../../models/medication-request-view";
import { dailyFrequencyString, dayStringFromCode, sortDayCodes, timingToString } from "./utils";

export class ResourceUtils {
  static getPatientReference(patientId: string): string {
    return ResourcePath.PATIENT + patientId;
  }

  static getMedicationReference(medication: Medication): string {
    return ResourcePath.MEDICATION + medication.id;
  }

  static getIdFromReference(reference: Reference): string {
    const separator = reference.reference.startsWith('#') ? '#' : '/';
    const referenceParts = reference.reference.split(separator);
    if (referenceParts.length > 1) {
      return referenceParts[1];
    }

    return '';
  }

  static getPatientName(patient: Patient): string {
    if (!patient.name[0]) {
      return "";
    }

    return patient.name[0].given?.join(' ') + ' ' + patient.name[0].family
  }

  static getStringExtension(resource: DomainResource, url: string): string {
    const extIndex = resource?.extension?.findIndex(ext => ext.url === url)
    return !isNaN(extIndex) && extIndex >= 0 ? resource.extension[extIndex].valueString : "";
  }

  static getCodeExtension(resource: DomainResource, url: string): string {
    const extIndex = resource?.extension?.findIndex(ext => ext.url === url)
    return !isNaN(extIndex) && extIndex >= 0 ? resource.extension[extIndex].valueCode : "";
  }

  static getPatientGender(patient: Patient): ('male' | 'female') {
    if (patient.gender === 'male' || patient.gender === 'female') {
      return patient.gender;
    }

    return undefined;
  }

  static getPatientContacts(patient: Patient): PatientPhoneContact[] {
    if (!patient.telecom || patient.telecom.length === 0) {
      return [];
    }

    return patient.telecom.map(contact => {
      return {
        system: contact.system,
        value: contact.value,
        use: contact.use,
        rank: contact.rank
      }
    })
  }

  static toPatient(internalPatient: InternalPatient, birthDate: string): Patient {
    const patient: Patient = {
      resourceType: 'Patient',
      id: internalPatient.id,
      gender: internalPatient.gender,
      birthDate: birthDate,
      telecom: ResourceUtils.getContactPoints(internalPatient),
      name: [{
        family: internalPatient.lastName,
        given: [internalPatient.firstName]
      }]
    };

    ResourceUtils.setStringExtension(patient, Extensions.EMAIL, internalPatient.email);
    ResourceUtils.setStringExtension(patient, Extensions.ALEXA_ID, internalPatient.alexaUserId);
    return patient
  }

  static getContactPoints(internalPatient: InternalPatient): ContactPoint[] {
    return internalPatient.phones.map((contact, index) => {
      return {
        system: contact.system,
        use: contact.use,
        value: contact.value,
        rank: index + 1
      };
    })
  }

  static getDosageText(dosageQuantity: Quantity): string {
    const unitExtension = dosageQuantity.extension.find(extension => extension.url === Extensions.QUANTITY_UNIT_NAME);
    const unitName = unitExtension ? unitExtension.valueString : '';
    return dosageQuantity.value + ' ' + unitName;
  }

  static setStringExtension(resource: DomainResource, url: string, value: string): void {
    this.setExtension(resource, url, value, 'string');
  }

  static setCodeExtension(resource: DomainResource, url: string, value: string): void {
    this.setExtension(resource, url, value, 'code');
  }

  static getPaginatedResult(bundle: Bundle, remaining: number, lastCursor: string): PaginatedResult<any> {
    if (!bundle.entry) {
      return this.getEmptyPaginatedResult();
    }

    return {
      totalResults: bundle.total,
      lastDataCursor: lastCursor,
      remainingCount: remaining,
      results: bundle.entry.map(entry => entry.resource)
    };
  }

  static getEmptyPaginatedResult(): PaginatedResult<[]> {
    return {
      totalResults: 0,
      remainingCount: 0,
      lastDataCursor: null,
      results: []
    }
  }

  static mapToServiceRequestView(serviceRequest: ServiceRequest): ServiceRequestView {
    return {
      id: serviceRequest.id,
      patientInstruction: serviceRequest.patientInstruction ?? '',
      duration: utils.getTimingStringDuration(serviceRequest.occurrenceTiming.repeat),
      days: utils.getServiceRequestDays(serviceRequest),
      dayWhen: utils.getServiceRequestTimings(serviceRequest)
    };
  }

  static mapToMedicationRequestView(medicationRequest: MedicationRequest): MedicationRequestView {
    const medication = ResourceUtils.getMedicationFromRequest(medicationRequest);
    return {
      id: medicationRequest.id,
      medicationName: medication?.code.coding[0].display ?? '',
      dosage: medicationRequest.dosageInstruction.map(dosageInstruction => {
        return {
          dosage: ResourceUtils.getDoseText(dosageInstruction),
          medicationNote: ResourceUtils.getMedicationNote(medicationRequest),
          duration: utils.getTimingStringDuration(dosageInstruction.timing.repeat),
          when: ResourceUtils.getWhenToTakeText(dosageInstruction.timing.repeat),
          frequency: ResourceUtils.getFrequencyText(dosageInstruction.timing.repeat),
        }
      })
    };
  }

  private static getMedicationFromRequest(medicationRequest: MedicationRequest): Medication {
    if (!medicationRequest.contained
      || medicationRequest.contained.length === 0
      || medicationRequest.contained[0].resourceType !== ResourceType.Medication
    ) {
      return undefined;
    }

    return medicationRequest.contained[0] as Medication;
  }

  private static getDoseText(dosage: Dosage): string {
    if (!dosage.doseAndRate || dosage.doseAndRate.length === 0) {
      return '';
    }

    const dosageQuantity = dosage.doseAndRate[0].doseQuantity;
    return ResourceUtils.getDosageText(dosageQuantity);
  }

  private static getWhenToTakeText(timingRepeat: TimingRepeat): string {
    if (timingRepeat.dayOfWeek && Array.isArray(timingRepeat.dayOfWeek)) {
      return timingRepeat.dayOfWeek
        .sort(sortDayCodes)
        .map(day => dayStringFromCode(day))
        .join(', ');
    }

    return $localize`Every day`;
  }

  private static getFrequencyText(timingRepeat: TimingRepeat): string {
    if (timingRepeat.when && Array.isArray(timingRepeat.when)) {
      return this.whenArrayToString(timingRepeat.when);
    }

    if (timingRepeat.timeOfDay && Array.isArray(timingRepeat.timeOfDay)) {
      return timingRepeat.timeOfDay.join(', ');
    }

    return dailyFrequencyString(timingRepeat.frequency);
  }

  private static whenArrayToString = (when: string[]): string => when
    .map(whenCode => timingToString(whenCode))
    .join(', ');

  private static getMedicationNote(medicationRequest: MedicationRequest): string {
    if (!medicationRequest.note || medicationRequest.note.length === 0) {
      return '';
    }

    return medicationRequest.note[0].text;
  }

  private static setExtension(
    resource: DomainResource,
    url: string,
    value: string,
    type: ('string' | 'code')
  ) {
    if (!resource || !url || url.length === 0 || !value || value.length === 0) {
      return;
    }

    let extValue;
    switch (type) {
      case "string":
        extValue = {valueString: value}
        break;
      case "code":
        extValue = {valueCode: value}
        break;
    }

    resource.extension ??= [];
    const extensionEntry = {
      url: url,
      ...extValue
    }
    const extIndex = resource.extension.findIndex(ext => ext.url === url)

    if (!isNaN(extIndex) && extIndex >= 0) {
      resource.extension[extIndex] = extensionEntry;
      return;
    }

    resource.extension.push(extensionEntry);
  }
}
