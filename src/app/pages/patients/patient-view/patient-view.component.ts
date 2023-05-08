import { Component } from '@angular/core';
import { PatientsService } from "../../../@core/services/patients.service";
import { ActivatedRoute, Router } from "@angular/router";
import { flatMap } from "rxjs/internal/operators";
import { InternalPatient } from "../../../@core/models/internalPatient";
import { CarePlanService } from "../../../@core/services/care-plan.service";

@Component({
  selector: 'app-patient-view',
  templateUrl: './patient-view.component.html',
  styleUrls: ['./patient-view.component.scss']
})
export class PatientViewComponent {
  patient: InternalPatient;
  patientId: string;

  constructor(
    private patientsService: PatientsService,
    private carePlanService: CarePlanService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.activatedRoute.params.pipe(
      flatMap(params => {
        this.patientId = params["patientId"];
        return patientsService.getInternalPatient(params["patientId"]);
      })
    ).subscribe(patient => this.patient = patient);
  }

  async navigate(page: string): Promise<void> {
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

  createCarePlan(): void {
    this.carePlanService.createCarePlan(this.patientId)
      .subscribe(carePlan =>
        this.router.navigate(
          [`${this.patientId}/care-plans/${carePlan.id}/edit`],
          {relativeTo: this.activatedRoute.parent})
      );
  }
}
