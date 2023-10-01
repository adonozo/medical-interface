import { Component, OnInit } from "@angular/core";
import { AbstractMedicationRequestFormComponent } from "./abstract-medication-request-form.component";
import { PatientsService } from "../../../@core/services/patients.service";
import { MedicationsService } from "../../../@core/services/medications.service";
import { MedicationRequestsService } from "../../../@core/services/medication-requests.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { Location } from "@angular/common";
import { Medication, MedicationRequest, Quantity } from "fhir/r4";
import { Observable } from "rxjs";
import * as medicationRequestUtils from "../../../@core/services/utils/medication-request-utils";
import * as resourceUtils from "../../../@core/services/utils/resource-utils";
import { concatMap } from "rxjs/operators";

@Component({
  selector: 'app-medication-request-edit',
  templateUrl: './medication-request-form.component.html',
  styleUrls: ['./medication-request-form.component.scss']
})
export class MedicationRequestEditFormComponent extends AbstractMedicationRequestFormComponent implements OnInit {
  private medicationRequest: MedicationRequest | undefined;

  constructor(
    protected override patientService: PatientsService,
    protected override medicationService: MedicationsService,
    protected override medicationRequestService: MedicationRequestsService,
    protected override activatedRoute: ActivatedRoute,
    protected override formBuilder: FormBuilder,
    protected override location: Location,
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
    this.activatedRoute.paramMap
      .pipe(
        concatMap(params => {
          this.medicationRequestId = params.get('medicationRequestId') ?? ''
          return this.medicationRequestService.getSingleMedicationRequest(this.medicationRequestId);
        }),
        concatMap(request => {
          this.medicationRequest = request;
          return this.medicationService.getMedication(resourceUtils.getIdFromReference(request.medicationReference));
        }))
      .subscribe(medication => this.populateForm(medication));
  }

  saveMethod(request: MedicationRequest): Observable<any> {
    return this.medicationRequestService.updateMedicationRequest(this.medicationRequestId ?? '', request);
  }

  private populateForm(medication: Medication) {
    const dosageInstruction = this.medicationRequest?.dosageInstruction && this.medicationRequest.dosageInstruction[0];
    const quantity = dosageInstruction?.doseAndRate && dosageInstruction?.doseAndRate[0]?.doseQuantity?.value;

    this.medicationControl.setValue(medication);
    this.medicationIdControl.setValue(medication.id);
    this.doseQuantityControl.setValue(quantity ?? 0);
    this.doseUnitControl.setValue(this.findRequestQuantity());
    this.instructionsControl.setValue(medicationRequestUtils.getMedicationNote(this.medicationRequest));

    const repeat = dosageInstruction?.timing?.repeat;
    this.dailyFrequencyControl.setValue(repeat);
    this.durationControl.setValue(repeat);
    this.frequencyControl.setValue(repeat);
  }

  private findRequestQuantity(): Quantity {
    const dosageInstruction = this.medicationRequest?.dosageInstruction && this.medicationRequest.dosageInstruction[0];
    const doseAndRate = dosageInstruction?.doseAndRate && dosageInstruction.doseAndRate[0];

    return this.quantities
      .find(quantity =>
        quantity.unit === doseAndRate?.doseQuantity?.unit
        && quantity.code === doseAndRate?.doseQuantity?.code)
      ?? {};
  }
}
