import { Component } from '@angular/core';
import { flatMap } from "rxjs/internal/operators";
import { PatientsService } from "../../../@core/services/patients.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Location } from "@angular/common";
import { DurationFormData, FormStatus } from "../../../@core/services/data/form-data";
import { DaysOfWeek, TimesOfDay } from "./form-data";
import { ServiceRequestsService } from "../../../@core/services/service-requests.service";
import { Patient, ServiceRequest, Timing } from "fhir/r4";
import { FormComponent } from "../../../@core/components/form.component";
import { ResourceUtils } from "../../../@core/services/utils/resourceUtils";

@Component({
  selector: 'app-service-request-form',
  templateUrl: './service-request-form.component.html',
  styleUrls: ['./service-request-form.component.scss']
})
export class ServiceRequestFormComponent extends FormComponent {

  patient: Patient;
  serviceForm: FormGroup;
  durationType = DurationFormData;
  durationSelected: DurationFormData;
  daysOfWeek = DaysOfWeek;
  timesOfDay = TimesOfDay;

  constructor(
    private patientService: PatientsService,
    private serviceRequestService: ServiceRequestsService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private location: Location
  ) {
    super();
    this.route.params.pipe(
      flatMap(params => patientService.getSinglePatient(params["patientId"]))
    ).subscribe(patient => this.patient = patient);

    this.serviceForm = formBuilder.group({
      durationQuantity: [],
      durationUnit: ['d'],
      periodRange: [],
      periodStart: [],
      timing: formBuilder.group({}),
      instructions: [''],
    });

    this.setTimingForm();
  }

  public get durationQuantityControl(): FormControl {
    return this.serviceForm.get('durationQuantity') as FormControl;
  }

  public get durationUnitControl(): FormControl {
    return this.serviceForm.get('durationUnit') as FormControl;
  }

  public get periodRangeControl(): FormControl {
    return this.serviceForm.get('periodRange') as FormControl;
  }

  public get periodStartControl(): FormControl {
    return this.serviceForm.get('periodStart') as FormControl;
  }

  public get timingGroup(): FormGroup {
    return this.serviceForm.get('timing') as FormGroup;
  }

  public get instructionsControl(): FormControl {
    return this.serviceForm.get('instructions') as FormControl;
  }

  public goBack(): void {
    this.location.back();
  }

  public submitForm(): void {
    const baseTiming = this.makeBaseTiming();
    const requests = this.getTimingsArray(baseTiming)
      .map(timing => this.makeServiceRequest(timing));
    this.formStatus = FormStatus.loading;
    this.serviceRequestService.createServiceRequests(requests)
      .subscribe(_ => this.formStatus = FormStatus.success,
        error => {
          console.log(error);
          this.formStatus = FormStatus.error
        });
  }

  private setTimingForm = (): void =>
    this.daysOfWeek.forEach(day => {
      const dayFormGroup = this.formBuilder.group({});
      this.timingGroup.addControl(day.value, dayFormGroup);
      this.addTimesOfDayControls(dayFormGroup)
    });

  private addTimesOfDayControls = (formGroup: FormGroup): void =>
    this.timesOfDay.forEach(time => formGroup.addControl(time.value, this.formBuilder.control(time.selected)));

  private makeBaseTiming(): Timing {
    const timing: Timing = {
      repeat: {
        period: 1,
        periodUnit: 'd',
        frequency: 1
      }
    };
    switch (this.durationSelected) {
      case DurationFormData.period:
        timing.repeat.boundsPeriod = {
          start: this.periodRangeControl.value.start.toISOString(),
          end: this.periodRangeControl.value.end.toISOString(),
        }
        break;
      case DurationFormData.duration:
        timing.repeat.boundsDuration = this.getBoundsDuration();
        break;
      case DurationFormData.untilNext:
        timing.repeat.boundsPeriod = {
          start: this.periodStartControl.value.toISOString(),
          end: ServiceRequestFormComponent.getSixMonthsFromDate(this.periodStartControl.value).toISOString(),
        }
        break;
    }

    return timing;
  }

  private makeServiceRequest(timing: Timing): ServiceRequest {
    const request = this.serviceRequestService.getEmptyServiceRequest();
    request.subject = {
      reference: ResourceUtils.getPatientReference(this.patient),
      display: this.patient.name[0]?.family
    }
    request.requester = {
      reference: 'Practitioner/60fb0a79c055e8c0d3f853d0',
      display: 'Dr. Steven'
    }
    request.occurrenceTiming = timing;
    request.patientInstruction = this.instructionsControl.value;
    return request;
  }

  private selectedFilter = (object: any): any[] =>
    Object.entries(object).filter(([_, isSelected]) => isSelected).map(([key]) => key);

  private getTimingsArray(baseTiming: Timing): Timing[] {
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

    const timingCopy = JSON.parse(JSON.stringify(baseTiming)) as Timing;
    // Create the lowest value of requests
    if (daysCount <= timesCount) {
      daysMap.forEach((value, key) => {
        if (value.length == 0) {
          return;
        }

        timingCopy.repeat.dayOfWeek = [key as any];
        timingCopy.repeat.when = value;
        timingsArray.push(timingCopy);
      })
    } else {
      timesMap.forEach((value, key) => {
        if (value.length == 0) {
          return;
        }

        timingCopy.repeat.when = [key as any];
        timingCopy.repeat.dayOfWeek = value;
        timingsArray.push(timingCopy);
      })
    }

    return timingsArray;
  }

  private getBoundsDuration(): { value: number, unit: string } {
    let value = this.durationQuantityControl.value;
    let unit = this.durationUnitControl.value;
    switch (unit) {
      case 'wk':
        value *= 7;
        unit = 'd';
        break;
      case 'mo':
        value *= 30;
        unit = 'd';
        break;
    }

    return {value, unit};
  }

  private static getSixMonthsFromDate(date: Date): Date {
    date.setMonth(date.getMonth() + 6)
    return date;
  }
}
