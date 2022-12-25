import { Component } from '@angular/core';
import { FormComponent } from "../../../../@core/components/form.component";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { CarePlan } from "fhir/r4";
import { CarePlanService } from "../../../../@core/services/care-plan.service";
import { flatMap } from "rxjs/internal/operators";

@Component({
  selector: 'app-care-plan-form',
  templateUrl: './care-plan-form.component.html',
  styleUrls: ['./care-plan-form.component.scss']
})
export class CarePlanFormComponent extends FormComponent{

  carePlanId: string;
  patientId: string;
  carePlan: CarePlan;

  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private carePlanService: CarePlanService,
  ) {
    super();
    this.activatedRoute.params.pipe(
      flatMap(params => {
        this.carePlanId = params["carePlanId"];
        this.patientId = params["patientId"];
        return this.carePlanService.getCarePlan(this.carePlanId);
      })
    ).subscribe(carePlan => this.carePlan = carePlan);
  }

  submitForm(): void {
  }

  goBack(): void {
    this.location.back();
  }

  async navigate(page: string): Promise<void> {
    switch (page) {
      case 'medication':
        await this.router.navigate(
          [`${this.patientId}/care-plans/${this.carePlanId}/new-medication-request`],
          {relativeTo: this.activatedRoute.parent})
        break;
      case 'service':
        await this.router.navigate(
          [`${this.patientId}/care-plans/${this.carePlanId}/new-service-request`],
          {relativeTo: this.activatedRoute.parent})
        return;
    }
  }
}
