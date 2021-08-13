import { Component, OnInit } from '@angular/core';
import {PatientsService} from "../../../@core/services/patients.service";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {flatMap} from "rxjs/internal/operators";
import {Patient} from "../../../@core/models/patient";
import {ObservationsService} from "../../../@core/services/observations.service";

@Component({
  selector: 'app-glucose-levels',
  templateUrl: './glucose-levels.component.html',
  styleUrls: ['./glucose-levels.component.scss']
})
export class GlucoseLevelsComponent implements OnInit {

  patient: Patient;

  constructor(
    private patientService: PatientsService,
    private observationsService: ObservationsService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.route.params.pipe(
      flatMap(params => patientService.getSinglePatient(params["patientId"]))
    ).subscribe(patient => {
      this.patient = patient;
      this.getObservations()
    });
  }

  ngOnInit(): void {
  }

  public goBack(): void {
    this.location.back();
  }

  private getObservations(): void {
    this.observationsService.getObservations(this.patient.id)
      .subscribe(observations => console.log(observations),
        error => console.log(error));
  }
}
