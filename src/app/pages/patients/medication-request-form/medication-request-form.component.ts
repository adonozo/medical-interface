import { Component, OnInit } from '@angular/core';
import { Patient } from "../../../@core/models/patient";
import { PatientsService } from "../../../@core/services/patients.service";
import { ActivatedRoute } from "@angular/router";
import { flatMap, startWith } from "rxjs/internal/operators";
import { Dosage, Medication, Quantity } from "fhir/r4";
import { MedicationsService } from "../../../@core/services/medications.service";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Location } from "@angular/common";
import { DailyFrequencyFormData, DayOfWeek, FrequencyFormData, TimeOfDay } from "./form-data";
import { MedicationRequestsService } from "../../../@core/services/medication-requests.service";
import { DurationFormData, FormStatus } from "../../../@core/services/data/form-data";

@Component({
  selector: 'app-medication-request',
  templateUrl: './medication-request-form.component.html',
  styleUrls: ['./medication-request-form.component.scss']
})
export class MedicationRequestFormComponent implements OnInit {

  patient: Patient;
  medications: Medication[] = [];
  quantities: Quantity[] = [];
  frequencyType = FrequencyFormData;
  frequencySelected: FrequencyFormData;
  dailyFrequencyType = DailyFrequencyFormData;
  dailyFrequencySelected: DailyFrequencyFormData = DailyFrequencyFormData.everyday;
  durationType = DurationFormData;
  durationSelected: DurationFormData;
  dayOfWeekArray = DayOfWeek;
  timesOfDayArray = TimeOfDay;

  formStatus: FormStatus = FormStatus.default;
  formStatusType = FormStatus;
  filteredMedications: Observable<Medication[]>;
  medicationForm: FormGroup;

  constructor(
    private patientService: PatientsService,
    private medicationService: MedicationsService,
    private medicationRequestService: MedicationRequestsService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private location: Location
  ) {
    this.medicationForm = formBuilder.group({
      medication: ['', Validators.required],
      medicationId: ['', Validators.required],
      doseQuantity: ['', [Validators.required, Validators.min(0)]],
      doseUnit: ['', Validators.required],
      dayOfWeek: formBuilder.group({}),
      when: formBuilder.group({}),
      timeOfDay: formBuilder.array([formBuilder.control('')]),
      frequency: [1],
      instructions: [''],
      durationQuantity: [],
      durationUnit: ['d'],
      periodRange: [],
      periodStart: []
    });
    this.setDayOfWeekControl();
    this.setTimeOfDayControl();
    this.route.params.pipe(
      flatMap(params => patientService.getSinglePatient(params["patientId"]))
    ).subscribe(patient => this.patient = patient);

    medicationService.getMedications().subscribe(medications => {
      this.medications = medications;
      this.filteredMedications = of(medications);
      this.filteredMedications = this.medicationControl.valueChanges
        .pipe(
          startWith(''),
          map(input => this.filterMedications(input))
        )
    });
  }

  ngOnInit(): void {
    this.quantities = this.medicationService.getMedicationQuantities();
  }

  public get medicationControl(): FormControl {
    return this.medicationForm.get('medication') as FormControl;
  }

  public get medicationIdControl(): FormControl {
    return this.medicationForm.get('medicationId') as FormControl;
  }

  public get doseQuantityControl(): FormControl {
    return this.medicationForm.get('doseQuantity') as FormControl;
  }

  public get doseUnitControl(): FormControl {
    return this.medicationForm.get('doseUnit') as FormControl;
  }

  public get dayOfWeekGroup(): FormGroup {
    return this.medicationForm.get('dayOfWeek') as FormGroup;
  }

  public get whenGroup(): FormGroup {
    return this.medicationForm.get('when') as FormGroup;
  }

  public get timeOfDayFormArray(): FormArray {
    return this.medicationForm.get('timeOfDay') as FormArray;
  }

  public get frequencyControl(): FormControl {
    return this.medicationForm.get('frequency') as FormControl;
  }

  public get durationQuantityControl(): FormControl {
    return this.medicationForm.get('durationQuantity') as FormControl;
  }

  public get durationUnitControl(): FormControl {
    return this.medicationForm.get('durationUnit') as FormControl;
  }

  public get periodRangeControl(): FormControl {
    return this.medicationForm.get('periodRange') as FormControl;
  }

  public get periodStartControl(): FormControl {
    return this.medicationForm.get('periodStart') as FormControl;
  }

  public get instructionsControl(): FormControl {
    return this.medicationForm.get('instructions') as FormControl;
  }

  public getMedicationName(medication: any): string {
    if (typeof medication === 'string' || medication instanceof String) {
      return medication.toString();
    }

    return medication.code.coding[0].display;
  }

  public onDrugSelectionChange = (event): void =>
    this.medicationIdControl.setValue(event.id);

  public getUnitName(): string {
    const quantity = this.doseUnitControl.value;
    if (quantity) {
      return quantity.extension[0].valueString;
    }

    return '';
  }

  public addTimeForm = (): void =>
    this.timeOfDayFormArray.push(this.formBuilder.control(''))

  public removeTimeForm = (index: number): void =>
    this.timeOfDayFormArray.removeAt(index)

  public goBack(): void {
    this.location.back();
  }

  public submitForm(): void {
    const request = this.medicationRequestService.getEmptyMedicationRequest();
    const medication = this.medicationControl.value;
    request.contained = [medication];
    request.medicationReference = {
      id: medication.id,
      display: this.getMedicationName(medication)
    }
    request.subject = {
      id: this.patient.id,
      display: `${this.patient.firstName} + ${this.patient.lastName}`
    }
    request.requester = {
      id: '60fb0a79c055e8c0d3f853d0',
      display: 'Dr. Steven'
    }
    request.note = [{text: this.instructionsControl.value}]
    request.dosageInstruction = [this.getDoseInstruction()];
    this.formStatus = FormStatus.loading;
    this.medicationRequestService.createMedicationRequest(request)
      .subscribe(_ => this.formStatus = FormStatus.success,
        error => {
          console.log(error);
          this.formStatus = FormStatus.error
        });
  }

  private filterMedications(name: any): Medication[] {
    let filter = this.getMedicationName(name).toLowerCase();
    return this.medications.filter(medication => medication.code.coding?.find(code => code.display.toLowerCase().includes(filter)));
  }

  private setDayOfWeekControl(): void {
    this.dayOfWeekArray.forEach(day => this.dayOfWeekGroup
      .addControl(day.value, this.formBuilder.control(day.selected))
    );
  }

  private setTimeOfDayControl(): void {
    this.timesOfDayArray.forEach(time => this.whenGroup
      .addControl(time.value, this.formBuilder.control(time.selected)))
  }

  private getDoseInstruction(): Dosage {
    const selectedFilter = (object: any): any[] =>
      Object.entries(object).filter(([_, isSelected]) => isSelected).map(([key]) => key);
    const dosage: Dosage = {};
    dosage.timing = {
      repeat: {
        dayOfWeek: this.dailyFrequencySelected === DailyFrequencyFormData.specificDays ? selectedFilter(this.dayOfWeekGroup.value) : [],
        when: this.frequencySelected === FrequencyFormData.mealTime ? selectedFilter(this.whenGroup.value) : [],
        period: 1,
        periodUnit: 'd',
        frequency: this.frequencySelected === FrequencyFormData.timesPerDay ? this.frequencyControl.value : 1
      }
    }
    switch (this.durationSelected) {
      case DurationFormData.period:
        dosage.timing.repeat.boundsPeriod = {
          start: this.periodRangeControl.value.start.toISOString(),
          end: this.periodRangeControl.value.end.toISOString(),
        }
        break;
      case DurationFormData.duration:
        dosage.timing.repeat.boundsDuration = this.getBoundsDuration();
        break;
      case DurationFormData.untilNext:
        dosage.timing.repeat.boundsPeriod = {
          start: this.periodStartControl.value.toISOString(),
          end: MedicationRequestFormComponent.getSixMonthsFromDate(this.periodStartControl.value).toISOString(),
        }
        break;
    }
    dosage.doseAndRate = [
      {
        doseQuantity: {
          ...this.doseUnitControl.value,
          value: this.doseQuantityControl.value
        }
      }
    ];

    return dosage
  }

  private getBoundsDuration(): { value: number, unit: string } {
    let value = this.durationQuantityControl.value;
    let unit = this.durationUnitControl.value;
    switch (unit) {
      case 'wk':
        value *= 7;
        unit = 'd';
        break;
      case 'mo':
        value *= 30;
        unit = 'd';
        break;
    }

    return {value, unit};
  }

  private static getSixMonthsFromDate(date: Date): Date {
    date.setMonth(date.getMonth() + 6)
    return date;
  }
}
