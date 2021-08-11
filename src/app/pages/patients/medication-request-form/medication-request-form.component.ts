import {Component, OnInit} from '@angular/core';
import {Patient} from "../../../@core/models/patient";
import {PatientsService} from "../../../@core/services/patients.service";
import {ActivatedRoute} from "@angular/router";
import {flatMap, startWith} from "rxjs/internal/operators";
import {Medication, Quantity} from "fhir/r4";
import {MedicationsService} from "../../../@core/services/medications.service";
import {Observable, of} from "rxjs";
import {map} from "rxjs/operators";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Location} from "@angular/common";
import {FrequencyFormData} from "./form-data";

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
  selectedMedication: Medication;
  filteredMedications: Observable<Medication[]>;
  medicationForm: FormGroup;

  constructor(
    private patientService: PatientsService,
    private route: ActivatedRoute,
    private medicationService: MedicationsService,
    private formBuilder: FormBuilder,
    private location: Location
  ) {
    this.medicationForm = formBuilder.group({
      medication: ['', Validators.required],
      medicationId: ['', Validators.required],
      doseQuantity: ['', [Validators.required, Validators.min(0)]],
      doseUnit: ['', Validators.required],
      instructions: [''],
    });
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

  public get instructionsControl(): FormControl {
    return this.medicationForm.get('instructions') as FormControl;
  }

  public getMedicationName(medication: any): string {
    if (typeof medication === 'string' || medication instanceof String) {
      return medication.toString();
    }

    return medication.code.coding[0].display;
  }

  public onDrugSelectionChange(event): void {
    this.selectedMedication = event;
    this.medicationIdControl.setValue(this.selectedMedication.id);
  }

  public getUnitName(): string {
    const quantity = this.doseUnitControl.value;
    if (quantity) {
      return quantity.extension[0].valueString;
    }

    return '';
  }

  public goBack(): void {
    this.location.back();
  }

  public submitForm(): void {
    console.log(this.medicationForm.value);
  }

  private filterMedications(name: any): Medication[] {
    let filter = this.getMedicationName(name).toLowerCase();
    return this.medications.filter(medication => medication.code.coding?.find(code => code.display.toLowerCase().includes(filter)));
  }
}
