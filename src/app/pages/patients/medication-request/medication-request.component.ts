import { Component, OnInit } from '@angular/core';
import {Patient} from "../../../@core/models/patient";
import {PatientsService} from "../../../@core/services/patients.service";
import {ActivatedRoute} from "@angular/router";
import {flatMap} from "rxjs/internal/operators";

@Component({
  selector: 'app-medication-request',
  templateUrl: './medication-request.component.html',
  styleUrls: ['./medication-request.component.scss']
})
export class MedicationRequestComponent implements OnInit {

  patient: Patient;

  constructor(private patientService: PatientsService,
              private route: ActivatedRoute) {
    this.route.params.pipe(
      flatMap(params => patientService.getSinglePatient(params["patientId"]))
    ).subscribe(patient => this.patient = patient);
  }

  ngOnInit(): void {
  }

}
