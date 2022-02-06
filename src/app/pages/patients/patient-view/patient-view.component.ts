import { Component } from '@angular/core';
import { Patient } from "../../../@core/models/patient";
import { PatientsService } from "../../../@core/services/patients.service";
import { ActivatedRoute } from "@angular/router";
import { flatMap } from "rxjs/internal/operators";

@Component({
  selector: 'app-patient-view',
  templateUrl: './patient-view.component.html',
  styleUrls: ['./patient-view.component.scss']
})
export class PatientViewComponent {
  patient: Patient;

  constructor(
    private patientsService: PatientsService,
    private route: ActivatedRoute,) {
    this.route.params.pipe(
      flatMap(params => patientsService.getSinglePatient(params["patientId"]))
    ).subscribe(patient => this.patient = patient);
  }
}
