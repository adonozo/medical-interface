import { Bundle, ContactPoint, Medication, Patient } from "fhir/r4";
import { Extensions, Resource } from "../data/constants";
import { InternalPatient, PatientPhoneContact } from "../../models/internalPatient";
import { PaginatedResult } from "../../models/paginatedResult";

export class ResourceUtils {
  static getPatientReference(patient: Patient): string {
    return Resource.PATIENT + patient.id;
  }

  static getMedicationReference(medication: Medication): string {
    return Resource.MEDICATION + medication.id;
  }

  static getPatientName(patient: Patient): string {
    if (!patient.name[0]) {
      return "";
    }

    return patient.name[0].given?.join(' ') + ' ' + patient.name[0].family
  }

  static getStringExtension(patient: Patient, url: string): string {
    const emailIndex = patient.extension?.findIndex(ext => ext.url === url)
    return !isNaN(emailIndex) && emailIndex >= 0 ? patient.extension[emailIndex].valueString : "";
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

  static setStringExtension(patient: Patient, url: string, value: string): void {
    if (!url || url.length === 0 || !value || value.length === 0) {
      return;
    }

    patient.extension ??= [];
    patient.extension.push({
      url: url,
      valueString: value
    });
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
}
