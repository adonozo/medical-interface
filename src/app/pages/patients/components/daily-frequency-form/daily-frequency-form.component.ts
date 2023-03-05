import { Component, Input, OnInit } from '@angular/core';
import { DailyFrequencyFormData, DayOfWeek } from "../../medication-request-form/form-data";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TimingRepeat } from "fhir/r4";
import { selectedFilter } from "../../../../@core/services/utils/utils";

@Component({
  selector: 'app-daily-frequency-form',
  templateUrl: './daily-frequency-form.component.html',
  styleUrls: ['./daily-frequency-form.component.scss']
})
export class DailyFrequencyFormComponent implements OnInit {
  @Input() form: FormGroup;
  dailyFrequencyType = DailyFrequencyFormData;
  dailyFrequencySelected: DailyFrequencyFormData = DailyFrequencyFormData.everyday;
  dayOfWeekArray = DayOfWeek;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.form.addControl('dayOfWeek', this.formBuilder.group({}));
    this.dayOfWeekArray.forEach(day => this.dayOfWeekGroup
      .addControl(day.value, this.formBuilder.control(day.selected))
    );
  }

  get dayOfWeekGroup(): FormGroup {
    return this.form.get('dayOfWeek') as FormGroup;
  }

  getDayOfWeekFrequency(): any[] {
    return this.dailyFrequencySelected === DailyFrequencyFormData.specificDays ? selectedFilter(this.dayOfWeekGroup.value) : []
  }

  populateDailyFrequency(repeat: TimingRepeat): void {
    if (repeat.dayOfWeek && repeat.dayOfWeek.length > 0) {
      this.dailyFrequencySelected = DailyFrequencyFormData.specificDays;
      repeat.dayOfWeek.forEach(day => this.dayOfWeekGroup.get(day).setValue(true));
    } else {
      this.dailyFrequencySelected = DailyFrequencyFormData.everyday;
    }
  }
}
