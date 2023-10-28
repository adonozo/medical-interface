import { Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator, Validators
} from "@angular/forms";
import { TimingRepeat } from "fhir/r5";
import { getDateOrDefault } from "../../../../@core/services/utils/utils";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SelectedDuration } from "./interfaces";

@Component({
  selector: 'app-duration-control',
  templateUrl: './duration-control.component.html',
  styleUrls: ['./duration-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DurationControlComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: DurationControlComponent,
      multi: true,
    }
  ]
})
export class DurationControlComponent implements OnDestroy, ControlValueAccessor, Validator {
  form: FormGroup;
  durationType = SelectedDuration;
  durationSelected: SelectedDuration | undefined;

  private unSubscriber: Subject<void> = new Subject<void>();

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      durationQuantity: [''],
      durationUnit: ['d'],
      periodRange: [''],
      periodEnd: [''],
      durationSelected: [undefined, Validators.required]
    });
  }

  get durationQuantityControl(): FormControl {
    return this.form.get('durationQuantity') as FormControl;
  }

  get durationUnitControl(): FormControl {
    return this.form.get('durationUnit') as FormControl;
  }

  get periodRangeControl(): FormControl {
    return this.form.get('periodRange') as FormControl;
  }

  get periodEndControl(): FormControl {
    return this.form.get('periodEnd') as FormControl;
  }

  get durationSelectedControl(): FormControl {
    return this.form.get('durationSelected') as FormControl;
  }

  onTouched = () => {
  };

  onChange = (_: any) => {
  }

  updateSelection(duration: SelectedDuration): void {
    this.durationSelected = duration;
    this.durationSelectedControl.setValue(duration, {emitEvent: true});
    this.onTouched();
    this.onChange(this.form.value);
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

  writeValue(repeat: TimingRepeat): void {
    if (!repeat) {
      return;
    }

    this.setFormValues(repeat);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.durationSelectedControl.value == undefined) {
      return {required: true}
    }

    switch (this.durationSelected) {
      case SelectedDuration.duration:
        return this.durationQuantityControl.value > 0 && this.durationUnitControl.value ? null : {required: true};
      case SelectedDuration.period:
        return this.periodRangeControl.value?.start && this.periodRangeControl.value?.end ? null : {required: true};
      case SelectedDuration.untilNext:
        return this.periodEndControl.value ? null : {required: true};
      default:
        return null;
    }
  }

  ngOnDestroy(): void {
    this.unSubscriber.next();
    this.unSubscriber.complete();
  }

  private setFormValues(repeat: TimingRepeat): void {
    if (repeat.boundsDuration) {
      this.durationSelected = SelectedDuration.duration;
      this.durationQuantityControl.setValue(repeat.boundsDuration.value);
      this.durationUnitControl.setValue(repeat.boundsDuration.unit);
    } else if (repeat.boundsPeriod) {
      this.durationSelected = SelectedDuration.period;
      const period = {
        start: getDateOrDefault(repeat.boundsPeriod.start),
        end: getDateOrDefault(repeat.boundsPeriod.end)
      };
      this.periodRangeControl.setValue(period);
    }

    this.durationSelectedControl.setValue(this.durationSelected);
  }
}
