import { PatientsService } from "../../../@core/services/patients.service";
import { ActivatedRoute } from "@angular/router";
import { debounceTime, distinctUntilChanged, flatMap } from "rxjs/internal/operators";
import { Dosage, Medication, Patient, Quantity } from "fhir/r4";
import { MedicationsService } from "../../../@core/services/medications.service";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Location } from "@angular/common";
import { DailyFrequencyFormData, DayOfWeek, FrequencyFormData, TimeOfDay } from "./form-data";
import { MedicationRequestsService } from "../../../@core/services/medication-requests.service";
import { DurationFormData } from "../../../@core/services/data/form-data";
import { FormComponent } from "../../../@core/components/form.component";
import { ResourceUtils } from "../../../@core/services/utils/resourceUtils";

export abstract class MedicationRequestFormComponent extends FormComponent {
  private readonly defaultLimit = 20;
  protected carePlanId: string;

  patient: Patient;
  quantities: Quantity[] = [];
  frequencyType = FrequencyFormData;
  frequencySelected: FrequencyFormData;
  dailyFrequencyType = DailyFrequencyFormData;
  dailyFrequencySelected: DailyFrequencyFormData = DailyFrequencyFormData.everyday;
  durationType = DurationFormData;
  durationSelected: DurationFormData;
  dayOfWeekArray = DayOfWeek;
  timesOfDayArray = TimeOfDay;

  filteredMedications: Observable<Medication[]>;
  medicationForm: FormGroup;

  protected constructor(
    protected patientService: PatientsService,
    protected medicationService: MedicationsService,
    protected medicationRequestService: MedicationRequestsService,
    protected activatedRoute: ActivatedRoute,
    protected formBuilder: FormBuilder,
    protected location: Location
  ) {
    super();

    this.activatedRoute.params.pipe(
      flatMap(params => {
        this.carePlanId = params['carePlanId'];
        return patientService.getSinglePatient(params['patientId'])
      })
    ).subscribe(patient => this.patient = patient);

    medicationService.searchMedications(this.defaultLimit, '', '').subscribe(medications => {
      this.filteredMedications = of(medications.results);
      this.filteredMedications = this.medicationControl.valueChanges
        .pipe(
          debounceTime(750),
          distinctUntilChanged(),
          flatMap(input => medicationService.searchMedications(this.defaultLimit, '', input)),
          map(paginatedResult => paginatedResult.results)
        );
    });

    this.quantities = this.medicationService.getMedicationQuantities();
  }

  get medicationControl(): FormControl {
    return this.medicationForm.get('medication') as FormControl;
  }

  get medicationIdControl(): FormControl {
    return this.medicationForm.get('medicationId') as FormControl;
  }

  get doseQuantityControl(): FormControl {
    return this.medicationForm.get('doseQuantity') as FormControl;
  }

  get doseUnitControl(): FormControl {
    return this.medicationForm.get('doseUnit') as FormControl;
  }

  get dayOfWeekGroup(): FormGroup {
    return this.medicationForm.get('dayOfWeek') as FormGroup;
  }

  get whenGroup(): FormGroup {
    return this.medicationForm.get('when') as FormGroup;
  }

  get timeOfDayFormArray(): FormArray {
    return this.medicationForm.get('timeOfDay') as FormArray;
  }

  get frequencyControl(): FormControl {
    return this.medicationForm.get('frequency') as FormControl;
  }

  get durationQuantityControl(): FormControl {
    return this.medicationForm.get('durationQuantity') as FormControl;
  }

  get durationUnitControl(): FormControl {
    return this.medicationForm.get('durationUnit') as FormControl;
  }

  get periodRangeControl(): FormControl {
    return this.medicationForm.get('periodRange') as FormControl;
  }

  get periodStartControl(): FormControl {
    return this.medicationForm.get('periodStart') as FormControl;
  }

  get instructionsControl(): FormControl {
    return this.medicationForm.get('instructions') as FormControl;
  }

  getMedicationName(medication: any): string {
    if (typeof medication === 'string' || medication instanceof String) {
      return medication.toString();
    }

    return medication.code.coding[0].display;
  }

  get patientName(): string {
    return ResourceUtils.getPatientName(this.patient);
  }

  onDrugSelectionChange = (event): void =>
    this.medicationIdControl.setValue(event.id);

  getUnitName(): string {
    const quantity = this.doseUnitControl.value;
    if (quantity) {
      return quantity.extension[0].valueString;
    }

    return '';
  }

  addTimeForm = (): void =>
    this.timeOfDayFormArray.push(this.formBuilder.control(''))

  removeTimeForm = (index: number): void =>
    this.timeOfDayFormArray.removeAt(index)

  goBack(): void {
    this.location.back();
  }

  protected setDayOfWeekControl(): void {
    this.dayOfWeekArray.forEach(day => this.dayOfWeekGroup
      .addControl(day.value, this.formBuilder.control(day.selected))
    );
  }

  protected setTimeOfDayControl(): void {
    this.timesOfDayArray.forEach(time => this.whenGroup
      .addControl(time.value, this.formBuilder.control(time.selected)))
  }

  protected getDoseInstruction(): Dosage {
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
