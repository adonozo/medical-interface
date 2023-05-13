import { Component, Input, OnInit } from '@angular/core';
import { FrequencyFormData, TimeOfDay } from "../../medication-request-form/form-data";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Moment } from "moment/moment";
import { getDefaultDateFrom, daySelectedFilter } from "../../../../@core/services/utils/utils";
import * as moment from "moment/moment";
import { TimingRepeat } from "fhir/r4";
import { DayCode } from "../../../../@core/models/types";

@Component({
  selector: 'app-frequency-form',
  templateUrl: './frequency-form.component.html',
  styleUrls: ['./frequency-form.component.scss']
})
export class FrequencyFormComponent implements OnInit {
  @Input() form: FormGroup;
  frequencyType = FrequencyFormData;
  frequencySelected: FrequencyFormData;
  timesOfDayArray = TimeOfDay;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.form.addControl('when', this.formBuilder.group({}));
    this.form.addControl('timeOfDay', this.formBuilder.array([this.formBuilder.control('')]));
    this.form.addControl('frequency', this.formBuilder.control(1));

    this.timesOfDayArray.forEach(time => this.whenGroup
      .addControl(time.value, this.formBuilder.control(time.selected)))
  }

  get whenGroup(): FormGroup {
    return this.form.get('when') as FormGroup;
  }

  get timeOfDayFormArray(): FormArray {
    return this.form.get('timeOfDay') as FormArray;
  }

  get frequencyControl(): FormControl {
    return this.form.get('frequency') as FormControl;
  }

  getTimingWhen = (): DayCode[] =>
    this.frequencySelected === FrequencyFormData.mealTime ? daySelectedFilter(this.whenGroup.value) : [];

  getTimingFrequency = (): number =>
    this.frequencySelected === FrequencyFormData.timesPerDay ? this.frequencyControl.value : 1;

  getTimeOfDayFrequency = (): string[] => this.frequencySelected === FrequencyFormData.specificTimes ?
    this.timeOfDayFormArray.value.map((date: Moment) => date.format('HH:mm')) : [];

  populateFrequencyForm(repeat: TimingRepeat): void {
    if (repeat.when?.length > 0) {
      this.frequencySelected = FrequencyFormData.mealTime;
      repeat.when.forEach(time => this.whenGroup.get(time).setValue(true));
    } else if (repeat.timeOfDay?.length > 0) {
      this.frequencySelected = FrequencyFormData.specificTimes;
      this.form.setControl('timeOfDay', this.formBuilder.array([]));
      repeat.timeOfDay.forEach(time => {
        const date = getDefaultDateFrom(time);
        this.addTimeForm(moment(date));
      });
    } else {
      this.frequencySelected = FrequencyFormData.timesPerDay;
      this.frequencyControl.setValue(repeat.frequency);
    }
  }

  addTimeForm = (date?: Moment): void =>
    this.timeOfDayFormArray.push(this.formBuilder.control(date ?? ''));

  removeTimeForm = (index: number): void =>
    this.timeOfDayFormArray.removeAt(index)
}
