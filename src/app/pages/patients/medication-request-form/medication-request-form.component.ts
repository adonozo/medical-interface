import {Component, OnInit, ViewChild} from '@angular/core';
import {Patient} from "../../../@core/models/patient";
import {PatientsService} from "../../../@core/services/patients.service";
import {ActivatedRoute} from "@angular/router";
import {flatMap, startWith} from "rxjs/internal/operators";
import {Medication} from "fhir/r4";
import {MedicationsService} from "../../../@core/services/medications.service";
import {Observable, of} from "rxjs";
import {map} from "rxjs/operators";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-medication-request',
  templateUrl: './medication-request-form.component.html',
  styleUrls: ['./medication-request-form.component.scss']
})
export class MedicationRequestFormComponent implements OnInit {

  patient: Patient;
  medications: Medication[] = [];
  selectedMedication: Medication;
  filteredMedications: Observable<Medication[]>;
  medicationForm: FormGroup;

  constructor(
    private patientService: PatientsService,
    private route: ActivatedRoute,
    private medicationService: MedicationsService,
    private formBuilder: FormBuilder
  ) {
    this.medicationForm = formBuilder.group({
      medication: ['', Validators.required]
    });
    this.route.params.pipe(
      flatMap(params => patientService.getSinglePatient(params["patientId"]))
    ).subscribe(patient => this.patient = patient);
    medicationService.getMedications().pipe(
      flatMap(medications => {
        this.medications = medications;
        this.filteredMedications = of(medications);
        return medications
      }),
    ).subscribe(_ => {
      this.filteredMedications = this.medicationControl.valueChanges
        .pipe(
          startWith(''),
          map(input => this.filterMedications(input))
        )
    });
  }

  ngOnInit(): void {
  }

  public get medicationControl(): AbstractControl {
    return this.medicationForm.get('medication');
  }

  public getMedicationName(medication: any): string {
    if (typeof medication === 'string' || medication instanceof String) {
      return medication.toString();
    }

    return medication.code.coding[0].display;
  }

  public onDrugSelectionChange(event): void {
    this.selectedMedication = event;
  }

  private filterMedications(name: any): Medication[] {
    let filter
    if (typeof name === "string" || name instanceof String) {
      filter = name;
    } else {
      filter = name.code.coding[0].display;
    }

    return this.medications.filter(medication => medication.code.coding?.find(code => code.display.toLowerCase().includes(filter.toLowerCase())));
  }
}
