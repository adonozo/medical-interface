import { MedicationRequestFormLocale } from "./medication-request-form.locale";

export enum FrequencyFormData {
  timesPerDay = 0,
  mealTime = 1,
  specificTimes = 2
}

export enum DailyFrequencyFormData {
  everyday = 0,
  specificDays = 1,
}

export const DayOfWeek: FormSelect[] = [
  {
    name: MedicationRequestFormLocale.monday,
    value: 'mon',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.tuesday,
    value: 'tue',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.wednesday,
    value: 'wed',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.thursday,
    value: 'thu',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.friday,
    value: 'fri',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.saturday,
    value: 'sat',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.sunday,
    value: 'sun',
    selected: false
  },
]

export const TimeOfDay: FormSelect[] = [
  {
    name: MedicationRequestFormLocale.beforeBreakfast,
    value: 'ACM',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.atBreakfast,
    value: 'CM',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.afterBreakfast,
    value: 'PCM',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.beforeLunch,
    value: 'ACD',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.atLunch,
    value: 'CD',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.afterLunch,
    value: 'PCD',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.beforeDinner,
    value: 'ACV',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.atDinner,
    value: 'CV',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.afterDinner,
    value: 'PCV',
    selected: false
  },
]

export interface FormSelect {
  name: string,
  value: string,
  selected: boolean
}

