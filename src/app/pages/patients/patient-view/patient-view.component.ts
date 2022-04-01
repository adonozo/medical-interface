import { Component } from '@angular/core';
import { PatientsService } from "../../../@core/services/patients.service";
import { ActivatedRoute, Router } from "@angular/router";
import { flatMap } from "rxjs/internal/operators";
import { ResourceUtils } from "../../../@core/services/utils/resourceUtils";
import { InternalPatient } from "../../../@core/models/internalPatient";

@Component({
  selector: 'app-patient-view',
  templateUrl: './patient-view.component.html',
  styleUrls: ['./patient-view.component.scss']
})
export class PatientViewComponent {
  patient: InternalPatient;
  patientId: string;
  extensions: ResourceUtils = ResourceUtils;

  constructor(
    private patientsService: PatientsService,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private router: Router) {
    this.route.params.pipe(
      flatMap(params => {
        this.patientId = params["patientId"];
        return patientsService.getInternalPatient(params["patientId"]);
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
      case 'edit':
        await this.router.navigate([this.patientId + '/edit'], {relativeTo: this.activatedRoute.parent});
        return
    }
  }
}
