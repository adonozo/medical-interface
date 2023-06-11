import { MedicationRequestFormLocale } from "./medication-request-form.locale";
import { NamedKeyBoolean } from "../../../@core/models/types";

export const namedBooleanDays: NamedKeyBoolean[] = [
  {
    name: MedicationRequestFormLocale.monday,
    key: 'mon',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.tuesday,
    key: 'tue',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.wednesday,
    key: 'wed',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.thursday,
    key: 'thu',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.friday,
    key: 'fri',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.saturday,
    key: 'sat',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.sunday,
    key: 'sun',
    selected: false
  },
]

export const TimeOfDay: NamedKeyBoolean[] = [
  {
    name: MedicationRequestFormLocale.beforeBreakfast,
    key: 'ACM',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.atBreakfast,
    key: 'CM',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.afterBreakfast,
    key: 'PCM',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.beforeLunch,
    key: 'ACD',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.atLunch,
    key: 'CD',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.afterLunch,
    key: 'PCD',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.beforeDinner,
    key: 'ACV',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.atDinner,
    key: 'CV',
    selected: false
  },
  {
    name: MedicationRequestFormLocale.afterDinner,
    key: 'PCV',
    selected: false
  },
]
