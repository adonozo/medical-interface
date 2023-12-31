import { AbstractServiceRequestFormComponent } from "./abstract-service-request-form.component";
import { Component } from "@angular/core";
import { PatientsService } from "../../../@core/services/patients.service";
import { ServiceRequestsService } from "../../../@core/services/service-requests.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { Location } from "@angular/common";
import { ServiceRequest } from "fhir/r5";
import { Observable } from "rxjs";

@Component({
  selector: 'app-service-request-form',
  templateUrl: './service-request-form.component.html',
  styleUrls: ['./service-request-form.component.scss']
})
export class ServiceRequestNewFormComponent extends AbstractServiceRequestFormComponent {

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
  }

  saveMethod(request: ServiceRequest): Observable<void> {
    return this.serviceRequestService.createServiceRequests(this.carePlanId ?? '', request);
  }
}
