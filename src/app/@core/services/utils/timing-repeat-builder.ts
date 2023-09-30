import { Timing, TimingRepeat } from "fhir/r4";
import { daySelectedFilter } from "./utils";
import { Moment } from "moment";
import { DaysOfWeek } from "../../../pages/patients/service-request-form/form-data";
import { DayCode, TimeCodeExtended } from "../../models/types";
import { TimesControl, WeeklyTimingsControl } from "../../../pages/patients/components/week-timing-control/types";
import { DurationControl, SelectedDuration } from "../../../pages/patients/components/duration-control/interfaces";
import {
  DailyFrequencyControl,
  SelectedDailyFrequency
} from "../../../pages/patients/components/daily-frequency-control/interfaces";
import { FrequencyControl, SelectedFrequency } from "../../../pages/patients/components/frequency-control/interfaces";

export class TimingRepeatBuilder {
  private readonly repeat : TimingRepeat;

  constructor() {
    this.repeat = emptyRepeat();
  }

  /**
   * Sets the timing duration based on a `SelectedDuration` value: `boundsPeriod` or `boundDuration`
   * @param durationValue The raw value from the Duration Control
   */
  addRepeatBounds(durationValue: DurationControl): TimingRepeatBuilder {
    const {
      durationSelected,
      periodRange,
      durationQuantity,
      durationUnit,
      periodEnd
    } = durationValue;
    switch (durationSelected) {
      case SelectedDuration.period:
        this.repeat.boundsPeriod = {
          start: periodRange.start.toISOString(),
          end:periodRange.end.toISOString(),
        }
        break;
      case SelectedDuration.duration:
        this.repeat.boundsDuration = {
          value: durationQuantity,
          unit: durationUnit
        };
        break;
      case SelectedDuration.untilNext:
        this.repeat.boundsPeriod = {
          start: (new Date()).toISOString(),
          end: periodEnd.toISOString(),
        }
        break;
    }

    return this;
  }

  /**
   * Sets the `dayOfWeek` value from the selected days in the Daily Frequency control
   * @param dailyFrequencyValue The raw value of the Daily Frequency control
   */
  addDayOfWeeks(dailyFrequencyValue: DailyFrequencyControl): TimingRepeatBuilder {
    const {dailyFrequency, ...days} = dailyFrequencyValue;
    this.repeat.dayOfWeek = dailyFrequency === SelectedDailyFrequency.specificDays ?
      daySelectedFilter(days) as DayCode[] : [];

    return this;
  }

  /**
   * Sets the repeat frequency based on the `SelectedFrequency`. These frequencies include: `repeat.frequency`,
   * `repeat.when`, or `repeat.timeOfDay`
   * @param frequencyValue the raw value of the Frequency Control
   */
  addRepeatFrequency(frequencyValue: FrequencyControl): TimingRepeatBuilder {
    const {
      frequencySelected,
      when,
      timeOfDay,
      frequency
    } = frequencyValue;

    switch (frequencySelected) {
      case SelectedFrequency.timesPerDay:
        this.repeat.frequency = frequency;
        break;
      case SelectedFrequency.mealTime:
        this.repeat.when = daySelectedFilter(when);
        break;
      case SelectedFrequency.specificTimes:
        this.repeat.timeOfDay = timeOfDay.map((date: Moment) => date.format('HH:mm'));
        break;
    }

    return this;
  }

  /**
   * Builds a `Timing` object
   */
  build = (): Timing => {
    return {repeat: this.repeat}
  };

  /**
   * Creates a new instance of the builder with an empty `Timing`
   */
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

function emptyRepeat(): TimingRepeat {
  return {
    when: [],
    period: 1,
    periodUnit: 'd',
    frequency: 1,
    timeOfDay: []
  };
}

/**
 * Processes the values of a `WeekTimingsControl`. Since the model is similar to a matrix: days('mon', 'tue', ...)
 * x times('ACM', 'ACD', ...), the result can be interpreted as a `Map`, using columns (day) or rows (time) as keys.
 * Both alternatives are returned so that the calling method can decide on how to use it.
 * @param weekTimingValue Values collected from the custom control
 */
function getTimingMaps(weekTimingValue: WeeklyTimingsControl): {
  daysMap: Map<DayCode, TimeCodeExtended[]>,
  timesMap: Map<TimeCodeExtended, DayCode[]>
} {
  const daysMap: Map<DayCode, TimeCodeExtended[]> = new Map();
  const timesMap: Map<TimeCodeExtended, DayCode[]> = new Map();

  DaysOfWeek.forEach(day => {
    const timesInDay: TimesControl = weekTimingValue[day.key as DayCode];
    const selectedTimesInDay: TimeCodeExtended[] = daySelectedFilter(timesInDay);
    if (selectedTimesInDay.length > 0) {
      daysMap.set(day.key as DayCode, selectedTimesInDay);
      selectedTimesInDay.forEach(time => pushValueToMap(time, day.key, timesMap));
    }
  });

  return {daysMap, timesMap};
}

function createTimingsFromMap(map: Map<string, string[]>, baseTiming: Timing, mapHasDayAsKey: boolean): Timing[] {
  const timingsArray: Timing[] = [];
  map.forEach((value, key) => {
    if (value.length == 0) {
      return;
    }

    const repeatCopy = JSON.parse(JSON.stringify(baseTiming.repeat)) as TimingRepeat;
    repeatCopy.dayOfWeek = mapHasDayAsKey ? [key as DayCode] : value as DayCode[];
    repeatCopy.when = mapHasDayAsKey ? value as TimeCodeExtended[] : [key as TimeCodeExtended];
    timingsArray.push({repeat: repeatCopy});
  });

  return timingsArray;
}

function pushValueToMap(key: string, arrayItem: string, map: Map<string, string[]>): void {
  if (!map.has(key)) {
    map.set(key, []);
  }

  map.get(key)!.push(arrayItem);
}
