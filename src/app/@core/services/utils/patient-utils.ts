import { ContactPoint, Patient } from "fhir/r4";
import { InternalPatient, PatientPhoneContact } from "../../models/internalPatient";
import { Extensions, ResourcePath } from "../data/constants";
import * as resourceUtils from "./resource-utils";

export const getPatientReference = (patientId: string): string  => ResourcePath.PATIENT + patientId;

export function getPatientName(patient: Patient): string {
  if (!patient.name[0]) {
    return "";
  }

  return patient.name[0].given?.join(' ') + ' ' + patient.name[0].family
}

export function toPatient(internalPatient: InternalPatient, birthDate: string): Patient {
  const patient: Patient = {
    resourceType: 'Patient',
    id: internalPatient.id,
    gender: internalPatient.gender,
    birthDate: birthDate,
    telecom: getContactPoints(internalPatient),
    name: [{
      family: internalPatient.lastName,
      given: [internalPatient.firstName]
    }]
  };

  resourceUtils.setStringExtension(patient, Extensions.EMAIL, internalPatient.email);
  resourceUtils.setStringExtension(patient, Extensions.ALEXA_ID, internalPatient.alexaUserId);
  return patient
}

export function toInternalPatient(patient: Patient): InternalPatient {
  return {
    id: patient.id,
    email: resourceUtils.getStringExtension(patient, Extensions.EMAIL),
    birthDate: new Date(patient.birthDate),
    gender: getPatientGender(patient),
    lastName: patient.name[0]?.family,
    firstName: patient.name[0]?.given?.join(' '),
    alexaUserId: resourceUtils.getStringExtension(patient, Extensions.ALEXA_ID),
    phones: getPatientContacts(patient)
  };
}

function getContactPoints(internalPatient: InternalPatient): ContactPoint[] {
  return internalPatient.phones.map((contact, index) => {
    return {
      system: contact.system,
      use: contact.use,
      value: contact.value,
      rank: index + 1
    };
  })
}

function getPatientGender(patient: Patient): ('male' | 'female') {
  if (patient.gender === 'male' || patient.gender === 'female') {
    return patient.gender;
  }

  return undefined;
}

function getPatientContacts(patient: Patient): PatientPhoneContact[] {
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
