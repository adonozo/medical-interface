import { PatientsService } from "../../../@core/services/patients.service";
import { ActivatedRoute } from "@angular/router";
import { debounceTime, distinctUntilChanged, flatMap } from "rxjs/internal/operators";
import { Dosage, DosageDoseAndRate, Medication, MedicationRequest, Patient, Quantity, Timing } from "fhir/r4";
import { MedicationsService } from "../../../@core/services/medications.service";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Location } from "@angular/common";
import { MedicationRequestsService } from "../../../@core/services/medication-requests.service";
import { FormComponent } from "../../../@core/components/form.component";
import { Directive, ViewChild } from "@angular/core";
import { DurationFormComponent } from "../components/duration-form/duration-form.component";
import { FormStatus } from "../../../@core/services/data/form-data";
import { DailyFrequencyFormComponent } from "../components/daily-frequency-form/daily-frequency-form.component";
import { FrequencyFormComponent } from "../components/frequency-form/frequency-form.component";
import * as patientUtils from "../../../@core/services/utils/patient-utils";
import * as medicationRequestUtils from "../../../@core/services/utils/medication-request-utils";

@Directive()
export abstract class AbstractMedicationRequestFormComponent extends FormComponent {
  private readonly defaultLimit = 20;
  protected carePlanId: string;
  editMode: boolean = false;

  patient: Patient;
  quantities: Quantity[] = [];

  filteredMedications: Observable<Medication[]>;
  medicationForm: FormGroup;

  abstract saveMethod<T>(request: MedicationRequest): Observable<T>;
  @ViewChild('durationForm') durationForm: DurationFormComponent;
  @ViewChild('frequencyForm') frequencyForm: FrequencyFormComponent;

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

  get instructionsControl(): FormControl {
    return this.medicationForm.get('instructions') as FormControl;
  }

  get dailyFrequencyControl(): FormGroup {
    return this.medicationForm.get('dailyFrequency') as FormGroup;
  }

  getMedicationName(medication: string | Medication): string {
    if (typeof medication === 'string') {
      return medication.toString();
    }

    return medication.code.coding[0].display;
  }

  get patientName(): string {
    return patientUtils.getPatientName(this.patient);
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

  goBack(): void {
    this.location.back();
  }

  submitForm(): void {
    const request = this.getRequestFromForm();
    this.formStatus = FormStatus.loading;
    this.saveMethod(request)
      .subscribe(
        _ => this.formStatus = FormStatus.success,
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
      instructions: [''],
      durationQuantity: [],
      durationUnit: ['d'],
      periodRange: [],
      periodEnd: [],
      dailyFrequency: []
    });

    this.enableMedicationSearch();
  }

  private getRequestFromForm(): MedicationRequest {
    let request = this.medicationRequestService.getEmptyMedicationRequest();
    request = this.setInstructions(request);

    const medication = this.medicationControl.value;
    request.contained = [medication];
    request.medicationReference = {
      reference: medicationRequestUtils.getMedicationReference(medication),
      display: this.getMedicationName(medication)
    }
    request.subject = {
      reference: patientUtils.getPatientReference(this.patient.id),
      display: this.patient.name[0]?.family
    }
    request.requester = {
      reference: 'Practitioner/60fb0a79c055e8c0d3f853d0',
      display: 'Dr. Steven'
    }
    request.dosageInstruction = [this.getDoseInstruction()];
    return request;
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
        when: this.frequencyForm.getTimingWhen(),
        period: 1,
        periodUnit: 'd',
        frequency: this.frequencyForm.getTimingFrequency(),
        timeOfDay: this.frequencyForm.getTimeOfDayFrequency()
      }
    }

    timing.repeat.dayOfWeek = DailyFrequencyFormComponent.getSelectedDays(this.dailyFrequencyControl);
    timing.repeat = this.durationForm.getRepeatBounds(timing.repeat);
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

  private setInstructions(request: MedicationRequest): MedicationRequest {
    if (this.instructionsControl.value && this.instructionsControl.value.length > 0) {
      request.note = [{text: this.instructionsControl.value}]
    }

    return request;
  }
}
