import { AbstractServiceRequestFormComponent } from "./abstract-service-request-form.component";
import { Component, OnInit } from "@angular/core";
import { PatientsService } from "../../../@core/services/patients.service";
import { ServiceRequestsService } from "../../../@core/services/service-requests.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { Location } from "@angular/common";
import { FormStatus } from "../../../@core/models/enums";
import { ServiceRequest } from "fhir/r4";
import { concatMap, Observable } from "rxjs";

@Component({
  selector: 'app-service-request-form',
  templateUrl: './service-request-form.component.html',
  styleUrls: ['./service-request-form.component.scss']
})
export class ServiceRequestEditFormComponent extends AbstractServiceRequestFormComponent implements OnInit {
  private serviceRequestId: string | undefined;
  private serviceRequest: ServiceRequest | undefined;

  constructor(
    protected override patientService: PatientsService,
    protected override serviceRequestService: ServiceRequestsService,
    protected override activatedRoute: ActivatedRoute,
    protected override formBuilder: FormBuilder,
    protected override location: Location
  ) {
    super(patientService,
      serviceRequestService,
      activatedRoute,
      formBuilder,
      location);

    this.editMode = true;
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(
        concatMap(params => {
          this.serviceRequestId = params.get('serviceRequestId') ?? '';
          return this.serviceRequestService.getServiceRequest(this.serviceRequestId);
        })
      )
      .subscribe(serviceRequest => {
        this.serviceRequest = serviceRequest;
        this.populateForm(serviceRequest);
      });
  }

  deleteServiceRequest(): void {
    if (!this.carePlanId || !this.serviceRequestId) {
      this.formStatus = FormStatus.error;
      return;
    }

    this.formStatus = FormStatus.loading;
    this.serviceRequestService.deleteServiceRequest(this.carePlanId, this.serviceRequestId)
      .subscribe(() => this.location.back(),
        error => {
          console.log(error);
          this.formStatus = FormStatus.error;
        });
  }

  saveMethod(request: ServiceRequest): Observable<void> {
    request.id = this.serviceRequestId;
    return this.serviceRequestService.updateServiceRequest(this.serviceRequestId ?? '', request);
  }

  private populateForm(serviceRequest: ServiceRequest): void {
    this.instructionsControl.setValue(serviceRequest.patientInstruction);
    this.durationControl.setValue(serviceRequest.occurrenceTiming?.repeat);
    this.weekTimingControl.setValue(serviceRequest.contained ?? []);
  }
}
