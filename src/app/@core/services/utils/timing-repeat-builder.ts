import { Timing } from "fhir/r4";
import { DurationFormData } from "../data/form-data";
import { DailyFrequencyFormData, FrequencyFormData } from "../../../pages/patients/medication-request-form/form-data";
import { daySelectedFilter } from "./utils";
import { Moment } from "moment";
import {
  DaysOfWeek,
  TimesControl,
  WeeklyTimingsControl
} from "../../../pages/patients/service-request-form/form-data";
import { DayCode, TimeCode } from "../../models/types";

export class TimingRepeatBuilder {
  private timingRepeat: Timing = emptyTimingRepeat();

  addRepeatBounds(durationValue: any): TimingRepeatBuilder {
    const formValues = durationValue;
    const repeat = this.timingRepeat.repeat;
    switch (formValues.durationSelected) {
      case DurationFormData.period:
        repeat.boundsPeriod = {
          start: formValues.periodRange.start.toISOString(),
          end: formValues.periodRange.end.toISOString(),
        }
        break;
      case DurationFormData.duration:
        repeat.boundsDuration = {
          value: formValues.durationQuantity,
          unit: formValues.durationUnit
        };
        break;
      case DurationFormData.untilNext:
        repeat.boundsPeriod = {
          start: (new Date()).toISOString(),
          end: formValues.periodEnd.toISOString(),
        }
        break;
    }

    return this;
  }

  addDayOfWeeks(dailyFrequencyValue: any): TimingRepeatBuilder {
    const {dailyFrequency, ...days} = dailyFrequencyValue;
    this.timingRepeat.repeat.dayOfWeek = dailyFrequency === DailyFrequencyFormData.specificDays ?
      daySelectedFilter(days) as DayCode[] : [];

    return this;
  }

  addRepeatFrequency(frequencyValue: any): TimingRepeatBuilder {
    const {
      frequencySelected,
      when,
      timeOfDay,
      frequency
    } = frequencyValue;

    switch (frequencySelected) {
      case FrequencyFormData.timesPerDay:
        this.timingRepeat.repeat.frequency = frequency;
        break;
      case FrequencyFormData.mealTime:
        this.timingRepeat.repeat.when = daySelectedFilter(when);
        break;
      case FrequencyFormData.specificTimes:
        this.timingRepeat.repeat.timeOfDay = timeOfDay.map((date: Moment) => date.format('HH:mm'));
        break;
    }

    return this;
  }

  build = (): Timing => this.timingRepeat;

  static create = (): TimingRepeatBuilder => new TimingRepeatBuilder();
}

export function getTimingsArray(baseTiming: Timing, weekTimingValue: WeeklyTimingsControl): Timing[] {
  const {daysMap, timesMap} = getTimingMaps(weekTimingValue);

  // Return the lowest value of requests
  const {map, mapHasDayAsKey} = daysMap.size < timesMap.size ?
    {map: daysMap, mapHasDayAsKey: true}
    : {map: timesMap, mapHasDayAsKey: false};

  return createTimingsFromMap(map, baseTiming, mapHasDayAsKey);
}

function emptyTimingRepeat(): Timing {
  return {
    repeat: {
      when: [],
      period: 1,
      periodUnit: 'd',
      frequency: 1,
      timeOfDay: []
    }
  };
}

/**
 * Processes the values of a `WeekTimingsControl`. Since the model is similar to a matrix: days('mon', 'tue', ...)
 * x times('ACM', 'ACD', ...), the result can be interpreted as a `Map`, using columns (day) or rows (time) as keys.
 * Both alternatives are returned so that the calling method can decide on how to use it.
 * @param weekTimingValue Values collected from the custom control
 */
function getTimingMaps(weekTimingValue: WeeklyTimingsControl): {
  daysMap: Map<DayCode, TimeCode[]>,
  timesMap: Map<TimeCode, DayCode[]>
} {
  const daysMap: Map<DayCode, TimeCode[]> = new Map();
  const timesMap: Map<TimeCode, DayCode[]> = new Map();

  DaysOfWeek.forEach(day => {
    const timesInDay: TimesControl = weekTimingValue[day.key];
    const selectedTimesInDay: TimeCode[] = daySelectedFilter(timesInDay);
    if (selectedTimesInDay.length > 0) {
      daysMap.set(day.key as DayCode, selectedTimesInDay);
      selectedTimesInDay.forEach(time => pushValueToMap(time, day.key, timesMap));
    }
  });

  return {daysMap, timesMap};
}

function createTimingsFromMap(map: Map<string, string[]>, baseTiming: Timing, mapHasDayAsKey: boolean): Timing[] {
  const timingsArray = [];
  map.forEach((value, key) => {
    if (value.length == 0) {
      return;
    }

    const timingCopy = JSON.parse(JSON.stringify(baseTiming)) as Timing;
    timingCopy.repeat.dayOfWeek = mapHasDayAsKey ? [key as DayCode] : value as DayCode[];
    timingCopy.repeat.when = mapHasDayAsKey ? value as TimeCode[] : [key as TimeCode];
    timingsArray.push(timingCopy);
  });

  return timingsArray;
}

function pushValueToMap(key: string, arrayItem: string, map: Map<string, string[]>): void {
  if (!map.has(key)) {
    map.set(key, []);
  }

  map.get(key).push(arrayItem);
}
