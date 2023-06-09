import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup, NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from "@angular/forms";
import { DaysOfWeek, TimesOfDay } from "../../service-request-form/form-data";
import { ServiceRequest, Timing } from "fhir/r4";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-week-timing-form',
  templateUrl: './week-timing-form.component.html',
  styleUrls: ['./week-timing-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: WeekTimingFormComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: WeekTimingFormComponent
    }
  ]
})
export class WeekTimingFormComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  form: FormGroup;
  daysOfWeek = DaysOfWeek;
  timesOfDay = TimesOfDay;

  private unSubscriber: Subject<void> = new Subject<void>();

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({});
    this.configureTimingForm();
  }

  populateWeekTimingForm(serviceRequests: ServiceRequest[]): void {
    serviceRequests.forEach(request => {
      request.occurrenceTiming?.repeat?.dayOfWeek?.forEach(day => {
        const dayGroup = this.form.get(day);
        request.occurrenceTiming?.repeat?.when?.forEach(timing => {
          const timingControl = dayGroup.get(timing);
          timingControl.setValue(true);
        });
      });
    });
  }

  static getTimingsArray(baseTiming: Timing, weekTimingValue: any): Timing[] {
    const timingsArray = [];
    const daysMap: Map<string, any[]> = new Map();
    const timesMap: Map<string, any[]> = new Map();
    let daysCount = 0;
    let timesCount = 0;
    TimesOfDay.forEach(time => timesMap.set(time.value, []));
    DaysOfWeek.forEach(day => {
      const dayValues = weekTimingValue[day.value];
      const dayValuesArray = this.selectedFilter(dayValues);
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

    // Create the lowest value of requests
    if (daysCount <= timesCount) {
      daysMap.forEach((value, key) => {
        if (value.length == 0) {
          return;
        }

        const timingCopy = JSON.parse(JSON.stringify(baseTiming)) as Timing;
        timingCopy.repeat.dayOfWeek = [key as any];
        timingCopy.repeat.when = value;
        timingsArray.push(timingCopy);
      })
    } else {
      timesMap.forEach((value, key) => {
        if (value.length == 0) {
          return;
        }

        const timingCopy = JSON.parse(JSON.stringify(baseTiming)) as Timing;
        timingCopy.repeat.when = [key as any];
        timingCopy.repeat.dayOfWeek = value;
        timingsArray.push(timingCopy);
      })
    }

    return timingsArray;
  }

  onTouched = () => {
  }

  onChange = (_: any) => {
  }

  writeValue(serviceRequests: ServiceRequest[]): void {
    if (!serviceRequests) {
      return;
    }

    serviceRequests.forEach(request => {
      request.occurrenceTiming?.repeat?.dayOfWeek?.forEach(day => {
        const dayGroup = this.form.get(day);
        request.occurrenceTiming?.repeat?.when?.forEach(timing => {
          const timingControl = dayGroup.get(timing);
          timingControl.setValue(true);
        });
      });
    });
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
    this.form.valueChanges
      .pipe(takeUntil(this.unSubscriber))
      .subscribe(value => this.onChange(value));
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable({emitEvent: false});
    } else {
      this.form.enable({emitEvent: false});
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const timings = this.form.value;
    if (timings == null) {
      return {required: true};
    }

    const timingValues = DaysOfWeek.map(day => {
      const dayTimings = timings[day.value];
      return TimesOfDay.map(time => dayTimings[time.value])
        .filter(value => value);
    })
      .flat()
      .filter(value => value);

    return timingValues.length === 0 ? {required: true} : null;
  }

  ngOnDestroy(): void {
    this.unSubscriber.next();
    this.unSubscriber.complete();
  }

  private configureTimingForm = (): void =>
    this.daysOfWeek.forEach(day => {
      const dayFormGroup = this.formBuilder.group({});
      this.form.addControl(day.value, dayFormGroup);
      this.addTimesOfDayControls(dayFormGroup)
    });

  private addTimesOfDayControls = (formGroup: FormGroup): void =>
    this.timesOfDay.forEach(time => formGroup.addControl(time.value, this.formBuilder.control(time.selected)));

  private static selectedFilter = (object: any): any[] =>
    Object.entries(object).filter(([_, isSelected]) => isSelected).map(([key]) => key);
}
