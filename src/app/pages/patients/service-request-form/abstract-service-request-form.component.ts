import { flatMap } from "rxjs/internal/operators";
import { PatientsService } from "../../../@core/services/patients.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Location } from "@angular/common";
import { FormStatus } from "../../../@core/services/data/form-data";
import { ServiceRequestsService } from "../../../@core/services/service-requests.service";
import { Patient, ServiceRequest, Timing, TimingRepeat } from "fhir/r4";
import { FormComponent } from "../../../@core/components/form.component";
import { Observable } from "rxjs";
import { Directive } from "@angular/core";
import * as patientUtils from "../../../@core/services/utils/patient-utils";
import { getTimingsArray, TimingRepeatBuilder } from "../../../@core/services/utils/timing-repeat-builder";

@Directive()
export abstract class AbstractServiceRequestFormComponent extends FormComponent {
  protected carePlanId: string;
  patient: Patient;
  serviceForm: FormGroup;
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

    this.configureRequestForm();
  }

  get instructionsControl(): FormControl {
    return this.serviceForm.get('instructions') as FormControl;
  }

  get durationControl(): FormControl {
    return this.serviceForm.get('duration') as FormControl;
  }

  get weekTimingControl(): FormControl {
    return this.serviceForm.get('weekTiming') as FormControl;
  }

  get patientName(): string {
    return patientUtils.getPatientName(this.patient);
  }

  goBack(): void {
    this.location.back();
  }

  submitForm(): void {
    const baseTiming = this.getBaseTiming();
    const containedRequests = getTimingsArray(baseTiming, this.weekTimingControl.value)
      .map(timing => this.makeServiceRequest(timing));
    this.formStatus = FormStatus.loading;

    let request = this.serviceRequestService.getBaseServiceRequest(this.patient);
    request = this.setInstructions(request);
    request.occurrenceTiming = baseTiming;
    request.contained = containedRequests;

    this.saveMethod(request)
      .subscribe(_ => this.formStatus = FormStatus.success,
        error => {
          console.log(error);
          this.formStatus = FormStatus.error
        });
  }

  private getBaseTiming = (): TimingRepeat => TimingRepeatBuilder.create()
    .addRepeatBounds(this.durationControl.value)
    .build();

  private configureRequestForm(): void {
    this.serviceForm = this.formBuilder.group({
      instructions: [''],
      duration: [null, Validators.required],
      weekTiming: [null, Validators.required]
    });
  }

  private makeServiceRequest(timing: Timing): ServiceRequest {
    const request = this.serviceRequestService.getBaseServiceRequest(this.patient);
    request.occurrenceTiming = timing;
    return request;
  }

  private setInstructions(request: ServiceRequest): ServiceRequest {
    if (this.instructionsControl.value && this.instructionsControl.value.length > 0) {
      request.patientInstruction = this.instructionsControl.value;
    }

    return request;
  }
}
