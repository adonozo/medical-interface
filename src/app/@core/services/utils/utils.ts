import { ServiceRequest, TimingRepeat } from "fhir/r4";
import { AppLocale } from "../data/locale";
import { isArray } from "rxjs/internal-compatibility";
import { DayCode } from "../../models/types";

export function getDateOrDefault(stringDate: string): Date {
  try {
    return new Date(stringDate);
  } catch (exception) {
    return new Date();
  }
}

export function getDefaultDateFrom(time: string): Date {
  const [hour, minutes] = time.split(':');
  const currentDate = new Date();
  currentDate.setHours(+hour, +minutes);
  return currentDate;
}

export function getDateFromString(stringDate: string): Date | undefined {
  try {
    return new Date(stringDate);
  } catch (exception) {
    return undefined;
  }
}

export const dateToString = (date: Date | undefined): string =>
  date == undefined ? '' : date.toLocaleString(AppLocale.localeTime, {
    dateStyle: "medium",
    timeStyle: "short"
  });

export const selectedFilter = (daySelected: { day: boolean }): any[] =>
  Object.entries(daySelected)
    .filter(([, isSelected]) => isSelected)
    .map(([day]) => day);

export function getTimingStringDuration(repeat: TimingRepeat): string {
  if (repeat.boundsDuration) {
    return `${repeat.boundsDuration.value} ${this.durationStringFromCode(repeat.boundsDuration.unit)}`;
  } else if (repeat.boundsPeriod) {
    const start = this.getDateOrDefault(repeat.boundsPeriod.start).toLocaleDateString(AppLocale.localeTime);
    const end = this.getDateOrDefault(repeat.boundsPeriod.end).toLocaleDateString(AppLocale.localeTime);
    return `${start} - ${end}`
  }

  return '';
}

export function getServiceRequestDays(serviceRequest: ServiceRequest): string {
  if (!serviceRequest.contained || !isArray(serviceRequest.contained))
  {
    return '';
  }

  return serviceRequest.contained
    .map((request: ServiceRequest) => request.occurrenceTiming.repeat.dayOfWeek)
    .flat()
    .sort(sortDayCodes)
    .map(dayStringFromCode)
    .join(', ');
}

export function getServiceRequestTimings(serviceRequest: ServiceRequest): { day: DayCode, when: string[] }[] {
  if (!serviceRequest.contained || !isArray(serviceRequest.contained)) {
    return [];
  }

  return serviceRequest.contained
    .map((request: ServiceRequest) => {
      const repeat = request.occurrenceTiming.repeat;
      const dayMap = (day: DayCode) => {
        return {day, when: repeat.when}
      };

      return repeat.dayOfWeek.map(dayMap)
    })
    .flat()
    .sort((a, b) => sortDayCodes(a.day, b.day));
}

export const timingToString = (timing: string): string => {
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
      return timing;
  }
}

export const durationStringFromCode = (unit: string): string => {
  switch (unit) {
    case 'd':
      return $localize`day(s)`;
    case 'wk':
      return $localize`week(s)`;
    case 'mo':
      return $localize`month(s)`;
    default:
      return unit;
  }
}

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
  }
}

export const sortDayCodes = (a: DayCode, b: DayCode): number =>
  dayValue(a) < dayValue(b) ? -1 : 1

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
