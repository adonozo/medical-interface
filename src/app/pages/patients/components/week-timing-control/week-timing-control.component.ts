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
import { ServiceRequest } from "fhir/r4";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-week-timing-control',
  templateUrl: './week-timing-control.component.html',
  styleUrls: ['./week-timing-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: WeekTimingControlComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: WeekTimingControlComponent
    }
  ]
})
export class WeekTimingControlComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {
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
}
