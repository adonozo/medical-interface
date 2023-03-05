import { flatMap } from "rxjs/internal/operators";
import { PatientsService } from "../../../@core/services/patients.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Location } from "@angular/common";
import { FormStatus } from "../../../@core/services/data/form-data";
import { ServiceRequestsService } from "../../../@core/services/service-requests.service";
import { Patient, ServiceRequest, Timing } from "fhir/r4";
import { FormComponent } from "../../../@core/components/form.component";
import { ResourceUtils } from "../../../@core/services/utils/resourceUtils";
import { Observable } from "rxjs";
import { Directive, ViewChild } from "@angular/core";
import { DurationFormComponent } from "../components/duration-form/duration-form.component";
import { WeekTimingFormComponent } from "../components/week-timing-form/week-timing-form.component";

@Directive()
export abstract class ServiceRequestFormComponent extends FormComponent {
  protected carePlanId: string;
  patient: Patient;
  serviceForm: FormGroup;
  editMode: boolean = false;
  @ViewChild('durationForm') durationFormComponent: DurationFormComponent;
  @ViewChild('weekTimingForm') weekTimingFormComponent: WeekTimingFormComponent;

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

    this.configureRequestForm();
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
    baseTiming.repeat = this.durationFormComponent.setRepeatBounds(baseTiming.repeat);
    const containedRequests = this.weekTimingFormComponent.getTimingsArray(baseTiming)
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

  private configureRequestForm(): void {
    this.serviceForm = this.formBuilder.group({
      timing: this.formBuilder.group({}),
      instructions: [''],
    });
  }

  private makeBaseTiming(): Timing {
    return {
      repeat: {
        period: 1,
        periodUnit: 'd',
        frequency: 1
      }
    };
  }

  private makeServiceRequest(timing: Timing): ServiceRequest {
    const request = this.serviceRequestService.getBaseServiceRequest(this.patient);
    request.occurrenceTiming = timing;
    return request;
  }
}
