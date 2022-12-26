import { Component, OnInit } from "@angular/core";
import { MedicationRequestFormComponent } from "./medication-request-form.component";
import { PatientsService } from "../../../@core/services/patients.service";
import { MedicationsService } from "../../../@core/services/medications.service";
import { MedicationRequestsService } from "../../../@core/services/medication-requests.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { Location } from "@angular/common";
import { Medication, MedicationRequest } from "fhir/r4";
import { flatMap } from "rxjs/internal/operators";
import { ResourceUtils } from "../../../@core/services/utils/resourceUtils";
import { FormStatus } from "../../../@core/services/data/form-data";

@Component({
  selector: 'app-medication-request-edit',
  templateUrl: './medication-request-form.component.html',
  styleUrls: ['./medication-request-form.component.scss']
})
export class MedicationRequestEditFormComponent extends MedicationRequestFormComponent implements OnInit {
  private medicationRequestId: string;
  private medicationRequest: MedicationRequest;

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

    this.activatedRoute.params.subscribe(
      params => this.medicationRequestId = params['medicationRequestId']
    );

    this.activatedRoute.params
      .pipe(
        flatMap(params => {
          this.medicationRequestId = params['medicationRequestId']
          return this.medicationRequestService.getSingleMedicationRequest(this.medicationRequestId)
            .pipe(
              flatMap(request => {
                this.medicationRequest = request;
                return this.medicationService.getMedication(ResourceUtils.getIdFromReference(request.medicationReference));
              }))
        }))
      .subscribe(medication => this.setMedicationForm(medication));
  }

  ngOnInit(): void {
    this.medicationRequestService.getSingleMedicationRequest(this.medicationRequestId)
      .pipe(
        flatMap(request => {
          this.medicationRequest = request;
          return this.medicationService.getMedication(ResourceUtils.getIdFromReference(request.medicationReference));
        }))
      .subscribe(medication => this.setMedicationForm(medication));
  }

  submitForm(): void {
    const request = this.medicationRequestService.getEmptyMedicationRequest();
    const medication = this.medicationControl.value;
    request.contained = [medication];
    request.medicationReference = {
      reference: ResourceUtils.getMedicationReference(medication),
      display: this.getMedicationName(medication)
    }
    request.subject = {
      reference: ResourceUtils.getPatientReference(this.patient.id),
      display: this.patient.name[0]?.family
    }
    request.requester = {
      reference: 'Practitioner/60fb0a79c055e8c0d3f853d0',
      display: 'Dr. Steven'
    }
    request.note = [{text: this.instructionsControl.value}]
    request.dosageInstruction = [this.getDoseInstruction()];
    this.formStatus = FormStatus.loading;
    this.medicationRequestService.createMedicationRequest(this.carePlanId, request)
      .subscribe(_ => this.formStatus = FormStatus.success,
        error => {
          console.log(error);
          this.formStatus = FormStatus.error
        });
  }

  private setMedicationForm(medication: Medication) {
    this.medicationForm = this.formBuilder.group({
      medication: [medication, Validators.required],
      medicationId: [medication.id, Validators.required],
      doseQuantity: ['', [Validators.required, Validators.min(0)]],
      doseUnit: ['', Validators.required],
      dayOfWeek: this.formBuilder.group({}),
      when: this.formBuilder.group({}),
      timeOfDay: this.formBuilder.array([this.formBuilder.control('')]),
      frequency: [1],
      instructions: [this.medicationRequest.note[0]?.text],
      durationQuantity: [],
      durationUnit: ['d'],
      periodRange: [],
      periodStart: []
    });

    this.setDayOfWeekControl();
    this.setTimeOfDayControl();
  }
}
