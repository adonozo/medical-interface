import { Component, OnDestroy, OnInit } from '@angular/core';
import { DailyFrequencyFormData, namedBooleanDays } from "../../medication-request-form/form-data";
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from "@angular/forms";
import { TimingRepeat } from "fhir/r4";
import { daySelectedFilter } from "../../../../@core/services/utils/utils";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-daily-frequency-control',
  templateUrl: './daily-frequency-control.component.html',
  styleUrls: ['./daily-frequency-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: DailyFrequencyControlComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: DailyFrequencyControlComponent
    }
  ]
})
export class DailyFrequencyControlComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  form: FormGroup;
  dailyFrequencyType = DailyFrequencyFormData;
  daysInWeek = namedBooleanDays;

  private unSubscriber: Subject<void> = new Subject<void>();

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      dailyFrequency: [null, Validators.required]
    });

    this.daysInWeek.forEach(day => this.form
      .addControl(
        day.value,
        this.formBuilder.control(day.selected))
    );
  }

  get dailyFrequencyControl(): AbstractControl {
    return this.form.get('dailyFrequency');
  }

  onChange = (_: any) => {
  }

  onTouched = () => {
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
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  writeValue(repeat: TimingRepeat): void {
    if (!repeat) {
      return;
    }

    if (repeat.dayOfWeek && repeat.dayOfWeek.length > 0) {
      this.dailyFrequencyControl.setValue(DailyFrequencyFormData.specificDays, {emitEvent: false});
      repeat.dayOfWeek.forEach(day => this.form.get(day).setValue(true));
    } else {
      this.dailyFrequencyControl.setValue(DailyFrequencyFormData.everyday, {emitEvent: false});
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.dailyFrequencyControl.value === DailyFrequencyFormData.everyday) {
      return null
    }

    const {dailyFrequency: _, ...days} = this.form.value;
    const daysSelected = daySelectedFilter(days);
    return daysSelected.length === 0 ? {required: true} : null;
  }

  ngOnDestroy(): void {
    this.unSubscriber.next();
    this.unSubscriber.complete();
  }
}
