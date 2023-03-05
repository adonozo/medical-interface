import { PatientsService } from "../../../@core/services/patients.service";
import { ActivatedRoute } from "@angular/router";
import { debounceTime, distinctUntilChanged, flatMap } from "rxjs/internal/operators";
import { Dosage, DosageDoseAndRate, Medication, MedicationRequest, Patient, Quantity, Timing } from "fhir/r4";
import { MedicationsService } from "../../../@core/services/medications.service";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Location } from "@angular/common";
import { FrequencyFormData, TimeOfDay } from "./form-data";
import { MedicationRequestsService } from "../../../@core/services/medication-requests.service";
import { FormComponent } from "../../../@core/components/form.component";
import { ResourceUtils } from "../../../@core/services/utils/resourceUtils";
import { Moment } from 'moment'
import { Directive, ViewChild } from "@angular/core";
import { DurationFormComponent } from "../components/duration-form/duration-form.component";
import { FormStatus } from "../../../@core/services/data/form-data";
import { DailyFrequencyFormComponent } from "../components/daily-frequency-form/daily-frequency-form.component";
import { selectedFilter } from "../../../@core/services/utils/utils";

@Directive()
export abstract class MedicationRequestFormComponent extends FormComponent {
  private readonly defaultLimit = 20;
  protected carePlanId: string;
  editMode: boolean = false;

  patient: Patient;
  quantities: Quantity[] = [];
  frequencyType = FrequencyFormData;
  frequencySelected: FrequencyFormData;
  timesOfDayArray = TimeOfDay;

  filteredMedications: Observable<Medication[]>;
  medicationForm: FormGroup;

  abstract saveMethod<T>(request: MedicationRequest): Observable<T>;
  @ViewChild('durationForm') durationForm: DurationFormComponent;
  @ViewChild('dailyFrequencyForm') dailyFrequencyForm: DailyFrequencyFormComponent;

  protected constructor(
    protected patientService: PatientsService,
    protected medicationService: MedicationsService,
    protected medicationRequestService: MedicationRequestsService,
    protected activatedRoute: ActivatedRoute,
    protected formBuilder: FormBuilder,
    protected location: Location
  ) {
    super();

    this.quantities = this.medicationService.getMedicationQuantities();
    this.configureMedicationForm();

    this.activatedRoute.params.pipe(
      flatMap(params => {
        this.carePlanId = params['carePlanId'];
        return patientService.getSinglePatient(params['patientId'])
      }))
      .subscribe(patient => this.patient = patient);
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

  get whenGroup(): FormGroup {
    return this.medicationForm.get('when') as FormGroup;
  }

  get timeOfDayFormArray(): FormArray {
    return this.medicationForm.get('timeOfDay') as FormArray;
  }

  get frequencyControl(): FormControl {
    return this.medicationForm.get('frequency') as FormControl;
  }

  get instructionsControl(): FormControl {
    return this.medicationForm.get('instructions') as FormControl;
  }

  getMedicationName(medication: string | Medication): string {
    if (typeof medication === 'string') {
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

  addTimeForm = (date?: Moment): void =>
    this.timeOfDayFormArray.push(this.formBuilder.control(date ?? ''));

  removeTimeForm = (index: number): void =>
    this.timeOfDayFormArray.removeAt(index)

  goBack(): void {
    this.location.back();
  }

  submitForm(): void {
    const request = this.getRequestFromForm();
    this.formStatus = FormStatus.loading;
    this.saveMethod(request)
      .subscribe(_ => this.formStatus = FormStatus.success,
        error => {
          console.log(error);
          this.formStatus = FormStatus.error
        });
  }

  private configureMedicationForm(): void {
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
      periodEnd: []
    });

    this.setTimeOfDayControl();
    this.enableMedicationSearch();
  }

  private getRequestFromForm(): MedicationRequest {
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
    return request;
  }

  private setTimeOfDayControl(): void {
    this.timesOfDayArray.forEach(time => this.whenGroup
      .addControl(time.value, this.formBuilder.control(time.selected)))
  }

  private enableMedicationSearch(): void {
    this.medicationService.searchMedications(this.defaultLimit, '', '')
      .subscribe(medications => {
        this.filteredMedications = of(medications.results);
        this.filteredMedications = this.medicationControl?.valueChanges
          .pipe(
            debounceTime(750),
            distinctUntilChanged(),
            flatMap(input => this.medicationService.searchMedications(this.defaultLimit, '', input)),
            map(paginatedResult => paginatedResult.results)
          );
      });
  }

  private getDoseInstruction(): Dosage {
    return {
      doseAndRate: this.getDoseAndRate(),
      timing: this.getDosageTiming()
    }
  }

  private getDosageTiming(): Timing {
    const timing: Timing = {
      repeat: {
        when: this.frequencySelected === FrequencyFormData.mealTime ? selectedFilter(this.whenGroup.value) : [],
        period: 1,
        periodUnit: 'd',
        frequency: this.frequencySelected === FrequencyFormData.timesPerDay ? this.frequencyControl.value : 1,
        timeOfDay: this.frequencySelected === FrequencyFormData.specificTimes ?
          this.timeOfDayFormArray.value.map((date: Moment) => date.format('HH:mm')) : []
      }
    }

    timing.repeat.dayOfWeek = this.dailyFrequencyForm.getDayOfWeekFrequency();
    timing.repeat = this.durationForm.setRepeatBounds(timing.repeat);
    return timing;
  }

  private getDoseAndRate(): DosageDoseAndRate[] {
    return [
      {
        doseQuantity: {
          ...this.doseUnitControl.value,
          value: this.doseQuantityControl.value
        }
      }
    ]
  }
}
