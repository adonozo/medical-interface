import { Component, OnInit } from "@angular/core";
import { AbstractMedicationRequestFormComponent } from "./abstract-medication-request-form.component";
import { PatientsService } from "../../../@core/services/patients.service";
import { MedicationsService } from "../../../@core/services/medications.service";
import { MedicationRequestsService } from "../../../@core/services/medication-requests.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { Location } from "@angular/common";
import { Medication, MedicationRequest, Quantity } from "fhir/r4";
import { flatMap } from "rxjs/internal/operators";
import { FormStatus } from "../../../@core/services/data/form-data";
import { Observable } from "rxjs";
import * as medicationRequestUtils from "../../../@core/services/utils/medication-request-utils";
import * as resourceUtils from "../../../@core/services/utils/resource-utils";

@Component({
  selector: 'app-medication-request-edit',
  templateUrl: './medication-request-form.component.html',
  styleUrls: ['./medication-request-form.component.scss']
})
export class MedicationRequestEditFormComponent extends AbstractMedicationRequestFormComponent implements OnInit {
  private medicationRequestId: string;
  private medicationRequest: MedicationRequest;

  constructor(
    protected patientService: PatientsService,
    protected medicationService: MedicationsService,
    protected medicationRequestService: MedicationRequestsService,
    protected activatedRoute: ActivatedRoute,
    protected formBuilder: FormBuilder,
    protected location: Location,
  ) {
    super(patientService,
      medicationService,
      medicationRequestService,
      activatedRoute,
      formBuilder,
      location);

    this.editMode = true;
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        flatMap(params => {
          this.medicationRequestId = params['medicationRequestId']
          return this.medicationRequestService.getSingleMedicationRequest(this.medicationRequestId);
        }),
        flatMap(request => {
          this.medicationRequest = request;
          return this.medicationService.getMedication(resourceUtils.getIdFromReference(request.medicationReference));
        }))
      .subscribe(medication => this.populateForm(medication));
  }

  deleteMedicationRequest(): void {
    this.formStatus = FormStatus.loading;
    this.medicationRequestService.deleteMedicationRequest(this.carePlanId, this.medicationRequestId)
      .subscribe(() => this.location.back(),
        error => {
          console.log(error);
          this.formStatus = FormStatus.error;
        })
  }

  saveMethod(request: MedicationRequest): Observable<any> {
    return this.medicationRequestService.updateMedicationRequest(this.medicationRequestId, request);
  }

  private populateForm(medication: Medication) {
    this.medicationControl.setValue(medication);
    this.medicationIdControl.setValue(medication.id);
    this.doseQuantityControl.setValue(this.medicationRequest.dosageInstruction[0]?.doseAndRate[0]?.doseQuantity.value);
    this.doseUnitControl.setValue(this.findRequestQuantity());
    this.instructionsControl.setValue(medicationRequestUtils.getMedicationNote(this.medicationRequest));

    const repeat = this.medicationRequest.dosageInstruction[0].timing.repeat;
    this.dailyFrequencyControl.setValue(repeat);
    this.durationControl.setValue(repeat);
    this.frequencyForm.populateFrequencyForm(repeat);
  }

  private findRequestQuantity(): Quantity {
    return this.quantities
      .find(quantity => quantity.unit === this.medicationRequest.dosageInstruction[0]?.doseAndRate[0]?.doseQuantity.unit
        && quantity.code === this.medicationRequest.dosageInstruction[0]?.doseAndRate[0]?.doseQuantity.code);
  }
}
