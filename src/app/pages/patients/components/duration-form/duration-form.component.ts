import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { DurationFormData } from "../../../../@core/services/data/form-data";
import { TimingRepeat } from "fhir/r4";
import { getDateOrDefault } from "../../../../@core/services/utils/utils";

@Component({
  selector: 'app-duration-form',
  templateUrl: './duration-form.component.html',
  styleUrls: ['./duration-form.component.scss']
})
export class DurationFormComponent implements OnInit {
  @Input() form: FormGroup;
  durationType = DurationFormData;
  durationSelected: DurationFormData;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.form.addControl('durationQuantity', this.formBuilder.control(''));
    this.form.addControl('durationUnit', this.formBuilder.control('d'));
    this.form.addControl('periodRange', this.formBuilder.control(''));
    this.form.addControl('periodEnd', this.formBuilder.control(''));
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

  populateFormDuration(repeat: TimingRepeat): void {
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
      this.changeDetector.detectChanges();
    }
  }

  setRepeatBounds(repeat: TimingRepeat): TimingRepeat {
    switch (this.durationSelected) {
      case DurationFormData.period:
        repeat.boundsPeriod = {
          start: this.periodRangeControl.value.start.toISOString(),
          end: this.periodRangeControl.value.end.toISOString(),
        }
        break;
      case DurationFormData.duration:
        repeat.boundsDuration = this.getBoundsDuration();
        break;
      case DurationFormData.untilNext:
        repeat.boundsPeriod = {
          start: (new Date()).toISOString(),
          end: this.periodEndControl.value.toISOString(),
        }
        break;
    }

    return repeat;
  }

  private getBoundsDuration(): { value: number, unit: string } {
    const value = this.durationQuantityControl.value;
    const unit = this.durationUnitControl.value;
    return {value, unit};
  }
}
