import { Component } from "@angular/core";
import { MedicationRequestFormComponent } from "./medication-request-form.component";
import { PatientsService } from "../../../@core/services/patients.service";
import { MedicationsService } from "../../../@core/services/medications.service";
import { MedicationRequestsService } from "../../../@core/services/medication-requests.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { Location } from "@angular/common";
import { ResourceUtils } from "../../../@core/services/utils/resourceUtils";
import { FormStatus } from "../../../@core/services/data/form-data";

@Component({
  selector: 'app-medication-request-new',
  templateUrl: './medication-request-form.component.html',
  styleUrls: ['./medication-request-form.component.scss']
})
export class MedicationRequestNewFormComponent extends MedicationRequestFormComponent {
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
    this.setMedicationForm();
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

  private setMedicationForm(): void {
    this.medicationForm = this.formBuilder.group({
      medication: ['', Validators.required],
      medicationId: ['', Validators.required],
      doseQuantity: ['', [Validators.required, Validators.min(0)]],
      doseUnit: ['', Validators.required],
      dayOfWeek: this.formBuilder.group({}),
      when: this.formBuilder.group({}),
      timeOfDay: this.formBuilder.array([this.formBuilder.control('')]),
      frequency: [1],
      instructions: [''],
      durationQuantity: [],
      durationUnit: ['d'],
      periodRange: [],
      periodStart: []
    });

    this.setDayOfWeekControl();
    this.setTimeOfDayControl();
  }
}
