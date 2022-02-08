import { Component } from '@angular/core';
import { Patient } from "../../../@core/models/patient";
import { PatientsService } from "../../../@core/services/patients.service";
import { ActivatedRoute, Router } from "@angular/router";
import { flatMap } from "rxjs/internal/operators";

@Component({
  selector: 'app-patient-view',
  templateUrl: './patient-view.component.html',
  styleUrls: ['./patient-view.component.scss']
})
export class PatientViewComponent {
  patient: Patient;
  patientId: string;

  constructor(
    private patientsService: PatientsService,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private router: Router) {
    this.route.params.pipe(
      flatMap(params => {
        this.patientId = params["patientId"];
        return patientsService.getSinglePatient(params["patientId"]);
      })
    ).subscribe(patient => this.patient = patient);
  }

  public async navigate(page: string): Promise<void> {
    switch (page) {
      case 'medication':
        await this.router.navigate([this.patientId + '/new-medication-request'], {relativeTo: this.activatedRoute.parent});
        break;
      case 'service':
        await this.router.navigate([this.patientId + '/new-service-request'], {relativeTo: this.activatedRoute.parent});
        return;
    }
  }
}
