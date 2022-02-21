export interface Patient {
  id: string;
  alexaUserId: string,
  email: string;
  firstName: string,
  lastName: string,
  gender: string,
  birthDate: Date,
  phoneContacts: PatientPhoneContact[]
}

interface PatientPhoneContact {
  number: string,
  use: string
}
