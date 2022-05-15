import { Bundle, ContactPoint, DomainResource, Medication, Patient } from "fhir/r4";
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

  private static setExtension(resource: DomainResource, url: string, value: string,
                              type: ('string' | 'code')) {
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
