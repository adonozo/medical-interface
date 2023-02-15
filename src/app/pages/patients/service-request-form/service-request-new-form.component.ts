import { ServiceRequestFormComponent } from "./service-request-form.component";
import { Component } from "@angular/core";
import { PatientsService } from "../../../@core/services/patients.service";
import { ServiceRequestsService } from "../../../@core/services/service-requests.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { Location } from "@angular/common";

@Component({
  selector: 'app-service-request-form',
  templateUrl: './service-request-form.component.html',
  styleUrls: ['./service-request-form.component.scss']
})
export class ServiceRequestNewFormComponent extends ServiceRequestFormComponent {

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
  }
}
