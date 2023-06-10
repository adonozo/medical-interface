import { Timing } from "fhir/r4";
import { DurationFormData } from "../data/form-data";
import { DailyFrequencyFormData, FrequencyFormData } from "../../../pages/patients/medication-request-form/form-data";
import { daySelectedFilter } from "./utils";
import { Moment } from "moment";
import { DaysOfWeek, TimesOfDay } from "../../../pages/patients/service-request-form/form-data";

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
      daySelectedFilter(days) : [];

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

export function getTimingsArray(baseTiming: Timing, weekTimingValue: any): Timing[] {
  const {daysMap, daysCount, timesMap, timesCount} = getTimingMaps(weekTimingValue);

  // Return the lowest value of requests
  const {map, useValueOnWhen} = daysCount <= timesCount ?
    {map: daysMap, useValueOnWhen: true}
    : {map: timesMap, useValueOnWhen: false};

  return createTimingsFromMap(map, baseTiming, useValueOnWhen);
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

function getTimingMaps(weekTimingValue: any): {
  daysMap: Map<string, any[]>,
    daysCount: number,
    timesMap: Map<string, any[]>,
    timesCount: number
} {
  const daysMap: Map<string, any[]> = new Map();
  const timesMap: Map<string, any[]> = new Map();
  let daysCount = 0;
  let timesCount = 0;

  TimesOfDay.forEach(time => timesMap.set(time.value, []));
  DaysOfWeek.forEach(day => {
    const dayValues = weekTimingValue[day.value];
    const dayValuesArray = daySelectedFilter(dayValues);
    daysCount += dayValuesArray.length > 0 ? 1 : 0;
    daysMap.set(day.value, dayValuesArray)
    TimesOfDay.forEach(time => {
      if (dayValues[time.value]) {
        timesMap.get(time.value).push(day.value);
      }
    });
  });

  timesMap.forEach(value => {
    if (value.length > 0) {
      timesCount++;
    }
  })

  return {daysMap, daysCount, timesMap, timesCount};
}

function createTimingsFromMap(map: Map<string, any[]>, baseTiming: Timing, useValueOnWhen: boolean): Timing[] {
  const timingsArray = [];
  map.forEach((value, key) => {
    if (value.length == 0) {
      return;
    }

    const timingCopy = JSON.parse(JSON.stringify(baseTiming)) as Timing;
    timingCopy.repeat.dayOfWeek = useValueOnWhen ? [key as any] : value;
    timingCopy.repeat.when = useValueOnWhen ? value : [key as any];
    timingsArray.push(timingCopy);
  });

  return timingsArray;
}
