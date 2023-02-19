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
import { Observable } from "rxjs";

export abstract class ServiceRequestFormComponent extends FormComponent {
  protected carePlanId: string;
  patient: Patient;
  serviceForm: FormGroup;
  durationType = DurationFormData;
  durationSelected: DurationFormData;
  daysOfWeek = DaysOfWeek;
  timesOfDay = TimesOfDay;
  editMode: boolean = false;

  abstract saveMethod(request: ServiceRequest): Observable<void>;

  protected constructor(
    protected patientService: PatientsService,
    protected serviceRequestService: ServiceRequestsService,
    protected activatedRoute: ActivatedRoute,
    protected formBuilder: FormBuilder,
    protected location: Location
  ) {
    super();
    this.activatedRoute.params.pipe(
      flatMap(params => {
        this.carePlanId = params['carePlanId'];
        return patientService.getSinglePatient(params["patientId"])
      }))
      .subscribe(patient => this.patient = patient);

    this.setRequestForm();
  }

  get durationQuantityControl(): FormControl {
    return this.serviceForm.get('durationQuantity') as FormControl;
  }

  get durationUnitControl(): FormControl {
    return this.serviceForm.get('durationUnit') as FormControl;
  }

  get periodRangeControl(): FormControl {
    return this.serviceForm.get('periodRange') as FormControl;
  }

  get periodEndControl(): FormControl {
    return this.serviceForm.get('periodEnd') as FormControl;
  }

  get timingGroup(): FormGroup {
    return this.serviceForm.get('timing') as FormGroup;
  }

  get instructionsControl(): FormControl {
    return this.serviceForm.get('instructions') as FormControl;
  }

  get patientName(): string {
    return ResourceUtils.getPatientName(this.patient);
  }

  goBack(): void {
    this.location.back();
  }

  submitForm(): void {
    const baseTiming = this.makeBaseTiming();
    const containedRequests = this.getTimingsArray(baseTiming)
      .map(timing => this.makeServiceRequest(timing));
    this.formStatus = FormStatus.loading;

    const request = this.serviceRequestService.getBaseServiceRequest(this.patient);
    request.occurrenceTiming = baseTiming;
    request.patientInstruction = this.instructionsControl.value;
    request.contained = containedRequests;

    this.saveMethod(request)
      .subscribe(_ => this.formStatus = FormStatus.success,
        error => {
          console.log(error);
          this.formStatus = FormStatus.error
        });
  }

  private setRequestForm(): void {
    this.serviceForm = this.formBuilder.group({
      durationQuantity: [],
      durationUnit: ['d'],
      periodRange: [],
      periodEnd: [],
      timing: this.formBuilder.group({}),
      instructions: [''],
    });

    this.setTimingForm();
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
          start: (new Date()).toISOString(),
          end: this.periodEndControl.value.toISOString(),
        }
        break;
    }

    return timing;
  }

  private makeServiceRequest(timing: Timing): ServiceRequest {
    const request = this.serviceRequestService.getBaseServiceRequest(this.patient);
    request.occurrenceTiming = timing;
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
}
