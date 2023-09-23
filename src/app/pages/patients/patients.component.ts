import { Component, OnInit } from '@angular/core';
import { PatientsService } from "../../@core/services/patients.service";
import { PaginatedResult } from "../../@core/models/paginatedResult";
import { Patient } from "fhir/r4";

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  private readonly defaultLimit = 20;
  results: PaginatedResult<Patient>

  constructor(
    private patientService: PatientsService) {
  }

  ngOnInit(): void {
    this.getPatientsData(this.defaultLimit);
  }

  getPatients(lastCursor?: string): void {
    this.getPatientsData(this.defaultLimit, lastCursor);
  }

  private getPatientsData(limit: number, lastCursor?: string): void {
    this.patientService.getPatientsList(limit, lastCursor)
      .subscribe(paginatedPatients => {
          this.results = paginatedPatients;
        }
      )
  }
}
