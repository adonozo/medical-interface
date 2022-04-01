export interface InternalPatient {
  id: string;
  alexaUserId: string,
  email: string;
  firstName: string,
  lastName: string,
  gender: ('male'|'female'),
  birthDate: Date,
  phones: PatientPhoneContact[]
}

export interface PatientPhoneContact {
  system: ('phone'|'fax'|'email'|'pager'|'url'|'sms'|'other') | undefined,
  value: string,
  use: ('home'|'work'|'temp'|'old'|'mobile'),
  rank: number
}
