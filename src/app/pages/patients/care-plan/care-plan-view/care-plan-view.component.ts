import { Component } from '@angular/core';
import { AbstractCarePlanViewComponent } from "../abstract-care-plan-view.component";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { CarePlanService } from "../../../../@core/services/care-plan.service";
import { PatientsService } from "../../../../@core/services/patients.service";

@Component({
  selector: 'app-care-plan-view',
  templateUrl: './care-plan-view.component.html',
  styleUrls: ['./care-plan-view.component.scss']
})
export class CarePlanViewComponent extends AbstractCarePlanViewComponent {

  constructor(
    protected location: Location,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected carePlanService: CarePlanService,
    protected patientService: PatientsService,
  ) {
    super(
      location,
      router,
      activatedRoute,
      carePlanService,
      patientService
    );
  }

}
