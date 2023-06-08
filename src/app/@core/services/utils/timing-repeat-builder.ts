import { Timing } from "fhir/r4";
import { DurationFormData } from "../data/form-data";
import { DailyFrequencyFormData, FrequencyFormData } from "../../../pages/patients/medication-request-form/form-data";
import { daySelectedFilter } from "./utils";
import { Moment } from "moment";

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
