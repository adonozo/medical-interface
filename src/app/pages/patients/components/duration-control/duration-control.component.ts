import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { DurationFormData } from "../../../../@core/models/enums";
import { TimingRepeat } from "fhir/r4";
import { getDateOrDefault } from "../../../../@core/services/utils/utils";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

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
export class DurationControlComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  form: FormGroup;
  durationType = DurationFormData;
  durationSelected: DurationFormData;

  private unSubscriber: Subject<void> = new Subject<void>();

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
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

  updateSelection(duration: DurationFormData): void {
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
      case DurationFormData.duration:
        return this.durationQuantityControl.value > 0 && this.durationUnitControl.value ? null : {required: true};
      case DurationFormData.period:
        return this.periodRangeControl.value?.start && this.periodRangeControl.value?.end ? null : {required: true};
      case DurationFormData.untilNext:
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
      this.durationSelected = DurationFormData.duration;
      this.durationQuantityControl.setValue(repeat.boundsDuration.value);
      this.durationUnitControl.setValue(repeat.boundsDuration.unit);
    } else if (repeat.boundsPeriod) {
      this.durationSelected = DurationFormData.period;
      const period = {
        start: getDateOrDefault(repeat.boundsPeriod.start),
        end: getDateOrDefault(repeat.boundsPeriod.end)
      };
      this.periodRangeControl.setValue(period);
    }

    this.durationSelectedControl.setValue(this.durationSelected);
  }
}
