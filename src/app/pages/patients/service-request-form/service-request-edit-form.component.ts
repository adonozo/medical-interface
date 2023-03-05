import { ServiceRequestFormComponent } from "./service-request-form.component";
import { Component, OnInit, ViewChild } from "@angular/core";
import { PatientsService } from "../../../@core/services/patients.service";
import { ServiceRequestsService } from "../../../@core/services/service-requests.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { Location } from "@angular/common";
import { FormStatus } from "../../../@core/services/data/form-data";
import { ServiceRequest } from "fhir/r4";
import { flatMap } from "rxjs/internal/operators";
import { Observable } from "rxjs";
import { DurationFormComponent } from "../components/duration-form/duration-form.component";

@Component({
  selector: 'app-service-request-form',
  templateUrl: './service-request-form.component.html',
  styleUrls: ['./service-request-form.component.scss']
})
export class ServiceRequestEditFormComponent extends ServiceRequestFormComponent implements OnInit {
  @ViewChild('durationForm') durationFormComponent: DurationFormComponent;
  private serviceRequestId: string;
  private serviceRequest: ServiceRequest;

  constructor(
    protected patientService: PatientsService,
    protected serviceRequestService: ServiceRequestsService,
    protected activatedRoute: ActivatedRoute,
    protected formBuilder: FormBuilder,
    protected location: Location
  ) {
    super(patientService,
      serviceRequestService,
      activatedRoute,
      formBuilder,
      location);

    this.editMode = true;
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        flatMap(params => {
          this.serviceRequestId = params['serviceRequestId'];
          return this.serviceRequestService.getServiceRequest(this.serviceRequestId);
        })
      )
      .subscribe(serviceRequest => {
        this.serviceRequest = serviceRequest;
        this.setForm(serviceRequest);
      });
  }

  deleteServiceRequest(): void {
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
    return this.serviceRequestService.updateServiceRequest(this.serviceRequestId, request);
  }

  private setForm(serviceRequest: ServiceRequest): void {
    this.instructionsControl.setValue(serviceRequest.patientInstruction);
    this.durationFormComponent.setFormDuration(serviceRequest.occurrenceTiming.repeat)
    this.setTimingCheckboxes((serviceRequest.contained ?? []) as ServiceRequest[]);
  }

  private setTimingCheckboxes(serviceRequests: ServiceRequest[]): void {
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
}
