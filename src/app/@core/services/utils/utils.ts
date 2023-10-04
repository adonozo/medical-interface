import { TimingRepeat } from "fhir/r5";
import { AppLocale } from "../data/locale";
import { DayCode, TimeCode, TimeCodeExtended } from "../../models/types";
import { parseISO } from "date-fns"

/**
 * Parses a string into a Date object. Returns the current date if the string is not a valid date
 * @param stringDate in ISO format
 */
export function getDateOrDefault(stringDate: string | undefined): Date {
  if (!stringDate)
  {
    return new Date();
  }

  try {
    return parseISO(stringDate)
  } catch (exception) {
    return new Date();
  }
}

/**
 * Parses a string into a Date object. Returns `undefined` if the string is not a valid date
 * @param stringDate in ISO format
 */
export function getDateFromString(stringDate: string | undefined): Date | undefined {
  try {
    return stringDate ? parseISO(stringDate) : undefined;
  } catch (exception) {
    return undefined;
  }
}

/**
 * Parses a string time into a Date object with the current date.
 * @param time Must be in format HH:mm, e.g., '20:15'
 */
export function getDefaultDateFrom(time: string): Date {
  const [hour, minutes] = time.split(':');
  const currentDate = new Date();
  currentDate.setHours(+hour, +minutes);
  return currentDate;
}

/**
 * Converts a Date into a string using the default locale time. The string will contain the date in medium format, and
 * the time, e.g., 1 Jan, 2023 12:20. Returns an empty string if the date is `undefined`
 * @param date
 */
export const dateToString = (date: Date | undefined): string =>
  date == undefined ? '' : date.toLocaleString(AppLocale.localeTime, {
    dateStyle: "medium",
    timeStyle: "short"
  });

/**
 * Takes an object of the form `key`: boolean and returns an array with the keys that have a `true` value. E.g.,
 * `{ 'mon': false, 'tue': true }` => `['tue']`
 * @param daySelected an object with keys as `DayCode` or `TimeCode`
 */
export const daySelectedFilter = (daySelected: { [key in DayCode]: boolean } | { [key in TimeCode]: boolean }): string[] =>
  Object.entries(daySelected)
    .filter(([_, isSelected]) => isSelected)
    .map(([day, _]) => day);

/**
 * Gets the duration from a `TimingRepeat` object, which is present in `ServiceRequest` and `MedicationRequest`. The
 * string will have format of value/unit (e.g., 2 days) or localized date period (e.g., 20/01/2023 - 15/02/2023)
 * @param repeat must have a `boundsDuration` or `boundsPeriod`
 */
export function getStringDuration(repeat: TimingRepeat | undefined): string {
  if (repeat?.boundsDuration) {
    return `${repeat.boundsDuration.value} ${durationStringFromCode(repeat.boundsDuration.unit)}`;
  } else if (repeat?.boundsPeriod) {
    const start = getDateOrDefault(repeat.boundsPeriod.start).toLocaleDateString(AppLocale.localeTime);
    const end = getDateOrDefault(repeat.boundsPeriod.end).toLocaleDateString(AppLocale.localeTime);
    return `${start} - ${end}`
  }

  return '';
}

/**
 * Gets the localized literal of a timing code, in lowercase. E.g., 'CD' -> 'at lunch'
 * @param timing a timing code, e.g., 'ACM'
 */
export const timingToString = (timing: TimeCodeExtended | undefined): string => {
  switch (timing) {
    case 'ACM':
      return $localize`before breakfast`;
    case 'CM':
      return $localize`at breakfast`;
    case 'PCM':
      return $localize`after breakfast`;
    case 'ACD':
      return $localize`before lunch`;
    case 'CD':
      return $localize`at lunch`;
    case 'PCD':
      return $localize`after lunch`;
    case 'ACV':
      return $localize`before dinner`;
    case 'CV':
      return $localize`at dinner`;
    case 'PCV':
      return $localize`after dinner`;
    case 'AC':
      return $localize`before meal`;
    case 'C':
      return $localize`with meal`;
    case 'PC':
      return $localize`after meal`;
    default:
      return timing ?? '';
  }
}

/**
 * Gets the localized literal of a time unit code, useful to concatenate. E,g, 'd' -> 'day(s)'
 * @param unit a time unit code: 'd', 'wk', or 'mo'
 */
export const durationStringFromCode = (unit: string | undefined): string => {
  switch (unit) {
    case 'd':
      return $localize`day(s)`;
    case 'wk':
      return $localize`week(s)`;
    case 'mo':
      return $localize`month(s)`;
    default:
      return unit ?? '';
  }
}

/**
 * Gets the localized literal of a `DayCode`. E.g., 'mon' -> 'Monday'. Returns an empty string by default.
 * @param dayCode
 */
export const dayStringFromCode = (dayCode: DayCode): string => {
  switch (dayCode) {
    case "mon":
      return $localize`Monday`;
    case "tue":
      return $localize`Tuesday`;
    case "wed":
      return $localize`Wednesday`;
    case "thu":
      return $localize`Thursday`;
    case "fri":
      return $localize`Friday`;
    case "sat":
      return $localize`Saturday`;
    case "sun":
      return $localize`Sunday`;
    default:
      return '';
  }
}

/**
 * A day comparator, to sort `DayCodes` from Monday to Sunday
 * @param a
 * @param b
 */
export const sortDayCodes = (a: DayCode, b: DayCode): number =>
  dayValue(a) < dayValue(b) ? -1 : 1

/**
 * Gets a frequency string from a number. E.g., 1 -> 'Once'
 * @param frequency
 */
export const dailyFrequencyString = (frequency: number): string => {
  let frequencyText;
  switch (frequency) {
    case 1:
      frequencyText = $localize`Once`
      break;
    case 2:
      frequencyText = $localize`Twice`
      break;
    case 3:
      frequencyText = $localize`Three times`
      break;
    case 4:
      frequencyText = $localize`Four times`
      break;
    default:
      frequencyText = frequency.toString() + ' times';
  }

  return frequencyText + ' a day';
}

const dayValue = (code: DayCode): number => {
  switch (code) {
    case "mon":
      return 1;
    case "tue":
      return 2;
    case "wed":
      return 3;
    case "thu":
      return 4;
    case "fri":
      return 5;
    case "sat":
      return 6;
    case "sun":
      return 7;
  }
}
