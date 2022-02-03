import { ServiceRequestFormLocale } from "./service-request-form.locale";

export const TimesOfDay = [
  {
    name: ServiceRequestFormLocale.beforeBreakfast,
    value: 'ACM',
    selected: false
  },
  {
    name: ServiceRequestFormLocale.afterBreakfast,
    value: 'PCM',
    selected: false
  },
  {
    name: ServiceRequestFormLocale.beforeLunch,
    value: 'ACD',
    selected: false
  },
  {
    name: ServiceRequestFormLocale.afterLunch,
    value: 'PCD',
    selected: false
  },
  {
    name: ServiceRequestFormLocale.beforeDinner,
    value: 'ACV',
    selected: false
  },
  {
    name: ServiceRequestFormLocale.afterDinner,
    value: 'PCV',
    selected: false
  },
]

export const DaysOfWeek = [
  {
    name: ServiceRequestFormLocale.monday,
    value: 'mon',
    values: TimesOfDay
  },
  {
    name: ServiceRequestFormLocale.tuesday,
    value: 'tue',
    values: TimesOfDay
  },
  {
    name: ServiceRequestFormLocale.wednesday,
    value: 'wed',
    values: TimesOfDay
  },
  {
    name: ServiceRequestFormLocale.thursday,
    value: 'thu',
    values: TimesOfDay
  },
  {
    name: ServiceRequestFormLocale.friday,
    value: 'fri',
    values: TimesOfDay
  },
  {
    name: ServiceRequestFormLocale.saturday,
    value: 'sat',
    values: TimesOfDay
  },
  {
    name: ServiceRequestFormLocale.sunday,
    value: 'sun',
    values: TimesOfDay
  }
]
