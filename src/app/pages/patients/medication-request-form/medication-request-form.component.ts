import { Component, OnInit } from '@angular/core';
import {Patient} from "../../../@core/models/patient";
import {PatientsService} from "../../../@core/services/patients.service";
import {ActivatedRoute} from "@angular/router";
import {flatMap} from "rxjs/internal/operators";
import {Medication} from "fhir/r4";
import {MedicationsService} from "../../../@core/services/medications.service";

@Component({
  selector: 'app-medication-request',
  templateUrl: './medication-request-form.component.html',
  styleUrls: ['./medication-request-form.component.scss']
})
export class MedicationRequestFormComponent implements OnInit {

  patient: Patient;
  medications: Medication[]

  constructor(
    private patientService: PatientsService,
    private route: ActivatedRoute,
    private medicationService: MedicationsService) {
    this.route.params.pipe(
      flatMap(params => patientService.getSinglePatient(params["patientId"]))
    ).subscribe(patient => this.patient = patient);
    medicationService.getMedications()
      .subscribe(medications => this.medications = medications);
  }

  ngOnInit(): void {
  }

}
