import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { DaysOfWeek, TimesOfDay } from "../../service-request-form/form-data";
import { ServiceRequest, Timing } from "fhir/r4";

@Component({
  selector: 'app-week-timing-form',
  templateUrl: './week-timing-form.component.html',
  styleUrls: ['./week-timing-form.component.scss']
})
export class WeekTimingFormComponent implements OnInit {
  @Input() form: FormGroup;
  daysOfWeek = DaysOfWeek;
  timesOfDay = TimesOfDay;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.form.addControl('timing', this.formBuilder.group({}));
    this.configureTimingForm();
  }

  get timingGroup(): FormGroup {
    return this.form.get('timing') as FormGroup;
  }

  populateWeekTimingForm(serviceRequests: ServiceRequest[]): void {
    serviceRequests.forEach(request => {
      request.occurrenceTiming?.repeat?.dayOfWeek?.forEach(day => {
        const dayGroup = this.timingGroup.get(day);
        request.occurrenceTiming?.repeat?.when?.forEach(timing => {
          const timingControl = dayGroup.get(timing);
          timingControl.setValue(true);
        });
      });
    });
  }

  getTimingsArray(baseTiming: Timing): Timing[] {
    const timingsArray = [];
    const daysMap: Map<string, any[]> = new Map();
    const timesMap: Map<string, any[]> = new Map();
    let daysCount = 0;
    let timesCount = 0;
    this.timesOfDay.forEach(time => timesMap.set(time.value, []));
    const timingFormValues = this.timingGroup.value;
    this.daysOfWeek.forEach(day => {
      const dayValues = timingFormValues[day.value];
      const dayValuesArray = this.selectedFilter(dayValues);
      daysCount += dayValuesArray.length > 0 ? 1 : 0;
      daysMap.set(day.value, dayValuesArray)
      this.timesOfDay.forEach(time => {
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

  private configureTimingForm = (): void =>
    this.daysOfWeek.forEach(day => {
      const dayFormGroup = this.formBuilder.group({});
      this.timingGroup.addControl(day.value, dayFormGroup);
      this.addTimesOfDayControls(dayFormGroup)
    });

  private addTimesOfDayControls = (formGroup: FormGroup): void =>
    this.timesOfDay.forEach(time => formGroup.addControl(time.value, this.formBuilder.control(time.selected)));

  private selectedFilter = (object: any): any[] =>
    Object.entries(object).filter(([_, isSelected]) => isSelected).map(([key]) => key);
}
