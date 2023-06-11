import { ServiceRequestFormLocale } from "./service-request-form.locale";
import { NamedKeyBoolean, NamedKeyValues } from "../../../@core/models/types";

export const TimesOfDay: NamedKeyBoolean[] = [
  {
    name: ServiceRequestFormLocale.beforeBreakfast,
    key: 'ACM',
    selected: false
  },
  {
    name: ServiceRequestFormLocale.afterBreakfast,
    key: 'PCM',
    selected: false
  },
  {
    name: ServiceRequestFormLocale.beforeLunch,
    key: 'ACD',
    selected: false
  },
  {
    name: ServiceRequestFormLocale.afterLunch,
    key: 'PCD',
    selected: false
  },
  {
    name: ServiceRequestFormLocale.beforeDinner,
    key: 'ACV',
    selected: false
  },
  {
    name: ServiceRequestFormLocale.afterDinner,
    key: 'PCV',
    selected: false
  },
]

export const DaysOfWeek: NamedKeyValues[] = [
  {
    name: ServiceRequestFormLocale.monday,
    key: 'mon',
    values: TimesOfDay
  },
  {
    name: ServiceRequestFormLocale.tuesday,
    key: 'tue',
    values: TimesOfDay
  },
  {
    name: ServiceRequestFormLocale.wednesday,
    key: 'wed',
    values: TimesOfDay
  },
  {
    name: ServiceRequestFormLocale.thursday,
    key: 'thu',
    values: TimesOfDay
  },
  {
    name: ServiceRequestFormLocale.friday,
    key: 'fri',
    values: TimesOfDay
  },
  {
    name: ServiceRequestFormLocale.saturday,
    key: 'sat',
    values: TimesOfDay
  },
  {
    name: ServiceRequestFormLocale.sunday,
    key: 'sun',
    values: TimesOfDay
  }
]
