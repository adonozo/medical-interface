import { Component } from "@angular/core";
import { AbstractMedicationRequestFormComponent } from "./abstract-medication-request-form.component";
import { PatientsService } from "../../../@core/services/patients.service";
import { MedicationsService } from "../../../@core/services/medications.service";
import { MedicationRequestsService } from "../../../@core/services/medication-requests.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { Location } from "@angular/common";
import { Observable } from "rxjs";
import { MedicationRequest } from "fhir/r4";

@Component({
  selector: 'app-medication-request-new',
  templateUrl: './medication-request-form.component.html',
  styleUrls: ['./medication-request-form.component.scss']
})
export class MedicationRequestNewFormComponent extends AbstractMedicationRequestFormComponent {
  constructor(
    protected patientService: PatientsService,
    protected medicationService: MedicationsService,
    protected medicationRequestService: MedicationRequestsService,
    protected activatedRoute: ActivatedRoute,
    protected formBuilder: FormBuilder,
    protected location: Location
  ) {
    super(patientService,
      medicationService,
      medicationRequestService,
      activatedRoute,
      formBuilder,
      location);
  }

  saveMethod(request: MedicationRequest): Observable<any> {
    return this.medicationRequestService.createMedicationRequest(this.carePlanId, request);
  }
}
