import { Component, OnInit } from "@angular/core";
import { MedicationRequestFormComponent } from "./medication-request-form.component";
import { PatientsService } from "../../../@core/services/patients.service";
import { MedicationsService } from "../../../@core/services/medications.service";
import { MedicationRequestsService } from "../../../@core/services/medication-requests.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { Location } from "@angular/common";
import { Medication, MedicationRequest, Quantity, TimingRepeat } from "fhir/r4";
import { flatMap } from "rxjs/internal/operators";
import { ResourceUtils } from "../../../@core/services/utils/resourceUtils";
import { getDefaultDateFrom } from "../../../@core/services/utils/utils";
import { FormStatus } from "../../../@core/services/data/form-data";
import { DailyFrequencyFormData, FrequencyFormData } from "./form-data";
import * as moment from 'moment'
import { Observable } from "rxjs";

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
          return this.medicationService.getMedication(ResourceUtils.getIdFromReference(request.medicationReference));
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
    this.instructionsControl.setValue(this.medicationRequest.note[0]?.text);

    const repeat = this.medicationRequest.dosageInstruction[0].timing.repeat;
    this.setDailyFrequency(repeat);
    this.setFrequency(repeat);
    this.durationForm.populateFormDuration(repeat);
  }

  private findRequestQuantity(): Quantity {
    return this.quantities.find(
      quantity => quantity.unit === this.medicationRequest.dosageInstruction[0]?.doseAndRate[0]?.doseQuantity.unit
      && quantity.code === this.medicationRequest.dosageInstruction[0]?.doseAndRate[0]?.doseQuantity.code);
  }

  private setDailyFrequency(repeat: TimingRepeat): void {
    if (repeat.dayOfWeek && repeat.dayOfWeek.length > 0) {
      this.dailyFrequencySelected = DailyFrequencyFormData.specificDays;
      repeat.dayOfWeek.forEach(day => this.dayOfWeekGroup.get(day).setValue(true));
    } else {
      this.dailyFrequencySelected = DailyFrequencyFormData.everyday;
    }
  }

  private setFrequency(repeat: TimingRepeat): void {
    if (repeat.when?.length > 0) {
      this.frequencySelected = FrequencyFormData.mealTime;
      repeat.when.forEach(time => this.whenGroup.get(time).setValue(true));
    } else if (repeat.timeOfDay?.length > 0) {
      this.frequencySelected = FrequencyFormData.specificTimes;
      this.medicationForm.setControl('timeOfDay', this.formBuilder.array([]));
      repeat.timeOfDay.forEach(time => {
        const date = getDefaultDateFrom(time);
        this.addTimeForm(moment(date));
      });
    } else {
      this.frequencySelected = FrequencyFormData.timesPerDay;
      this.frequencyControl.setValue(repeat.frequency);
    }
  }
}
