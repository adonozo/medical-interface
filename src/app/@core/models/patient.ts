export interface Patient {
  id: string;
  alexaUserId: string,
  email: string;
  firstName: string,
  lastName: string,
  gender: ('male'|'female'),
  birthDate: Date,
  phoneContacts: PatientPhoneContact[]
}

export interface PatientPhoneContact {
  number: string,
  use: ('home'|'work'|'temp'|'old'|'mobile')
}
