import { Component, OnDestroy, OnInit } from '@angular/core';
import { TimeOfDay } from "../../medication-request-form/form-data";
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup, NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator, Validators
} from "@angular/forms";
import { Moment } from "moment/moment";
import { getDefaultDateFrom, daySelectedFilter } from "../../../../@core/services/utils/utils";
import * as moment from "moment/moment";
import { TimingRepeat } from "fhir/r4";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SelectedFrequency } from "./interfaces";

@Component({
  selector: 'app-frequency-control',
  templateUrl: './frequency-form-control.component.html',
  styleUrls: ['./frequency-form-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FrequencyFormControl,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: FrequencyFormControl,
      multi: true
    }
  ]
})
export class FrequencyFormControl implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  form: FormGroup;
  frequencyType = SelectedFrequency;
  frequencySelected: SelectedFrequency;
  timesOfDayArray = TimeOfDay;

  private unSubscriber = new Subject<void>();

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      when: this.formBuilder.group({}),
      timeOfDay: this.formBuilder.array([
        this.defaultTimeOfDayControl()
      ], [Validators.required, Validators.min(1)]),
      frequency: [1, Validators.required],
      frequencySelected: [undefined, Validators.required]
    });

    this.timesOfDayArray.forEach(time => this.whenGroup
      .addControl(time.key, this.formBuilder.control(time.selected)))
  }

  get whenGroup(): FormGroup {
    return this.form.get('when') as FormGroup;
  }

  get timeOfDayArrayForm(): FormArray {
    return this.form.get('timeOfDay') as FormArray;
  }

  get frequencyControl(): FormControl {
    return this.form.get('frequency') as FormControl;
  }

  get frequencySelectedControl(): FormControl {
    return this.form.get('frequencySelected') as FormControl;
  }

  updateSelection(frequency: SelectedFrequency): void {
    this.frequencySelected = frequency;
    this.frequencySelectedControl.setValue(frequency, {emitEvent: false});
    this.onTouched();
    this.onChange(this.form.value);
  }

  onTouched = () => {
  }

  onChange = (_: any) => {
  }

  addTimeForm = (date?: Moment): void =>
    this.timeOfDayArrayForm.push(this.defaultTimeOfDayControl(date));

  removeTimeForm = (index: number): void =>
    this.timeOfDayArrayForm.removeAt(index)

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
      return
    }

    this.setValues(repeat);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.frequencySelectedControl.invalid) {
      return {required: true}
    }

    switch (this.frequencySelected) {
      case SelectedFrequency.timesPerDay:
        return this.frequencyControl.invalid ? {required: true} : null;
      case SelectedFrequency.mealTime:
        return daySelectedFilter(this.whenGroup.value)?.length === 0 ? {required: true} : null;
      case SelectedFrequency.specificTimes:
        const timesOfDay = this.timeOfDayArrayForm.value;
        if (!Array.isArray(timesOfDay) || timesOfDay.length === 0) {
          return {required: true};
        }

        return this.timeOfDayArrayForm.invalid ? {required: true} : null;
      default:
        return null;
    }
  }

  ngOnDestroy(): void {
    this.unSubscriber.next();
    this.unSubscriber.complete();
  }

  private setValues(repeat: TimingRepeat): void {
    if (repeat.when?.length > 0) {
      this.frequencySelected = SelectedFrequency.mealTime;
      repeat.when.forEach(time => this.whenGroup.get(time).setValue(true));
    } else if (repeat.timeOfDay?.length > 0) {
      this.frequencySelected = SelectedFrequency.specificTimes;
      this.form.setControl('timeOfDay', this.formBuilder.array([]));
      repeat.timeOfDay.forEach(time => {
        const date = getDefaultDateFrom(time);
        this.addTimeForm(moment(date));
      });
    } else {
      this.frequencySelected = SelectedFrequency.timesPerDay;
      this.frequencyControl.setValue(repeat.frequency);
    }
  }

  private defaultTimeOfDayControl = (time?: Moment): FormControl =>
    this.formBuilder.control(time ?? '', [Validators.required]);

}
