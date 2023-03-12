import { Component } from '@angular/core';
import { FormComponent } from "../../../../@core/components/form.component";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { Medication, MedicationRequest, Resource, ServiceRequest, TimingRepeat } from "fhir/r4";
import { CarePlanService } from "../../../../@core/services/care-plan.service";
import { flatMap } from "rxjs/internal/operators";
import * as utils from "../../../../@core/services/utils/utils";

@Component({
  selector: 'app-care-plan-form',
  templateUrl: './care-plan-form.component.html',
  styleUrls: ['./care-plan-form.component.scss']
})
export class CarePlanFormComponent extends FormComponent{

  carePlanId: string;
  patientId: string;
  resources: Resource[];

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
        return this.carePlanService.getDetailedCarePlan(this.carePlanId);
      })
    ).subscribe(bundle => this.resources = bundle.entry?.map(entry => entry.resource) ?? []);
  }

  submitForm(): void {
  }

  goBack(): void {
    this.location.back();
  }

  deleteCarePlan(): void {
    this.carePlanService.deleteCarePlan(this.carePlanId)
      .subscribe(_ => this.location.back());
  }

  async navigate(page: string, id?: string): Promise<void> {
    switch (page) {
      case 'new-medication':
        await this.router.navigate(
          [`${this.patientId}/care-plans/${this.carePlanId}/new-medication-request`],
          {relativeTo: this.activatedRoute.parent})
        break;
      case 'edit-medication':
        await this.router.navigate(
          [`${this.patientId}/care-plans/${this.carePlanId}/medication-request/${id}/edit`],
          {relativeTo: this.activatedRoute.parent})
        break;
      case 'new-service':
        await this.router.navigate(
          [`${this.patientId}/care-plans/${this.carePlanId}/new-service-request`],
          {relativeTo: this.activatedRoute.parent})
        return;
      case 'edit-service':
        await this.router.navigate(
          [`${this.patientId}/care-plans/${this.carePlanId}/service-request/${id}/edit`],
          {relativeTo: this.activatedRoute.parent})
        break;
    }
  }

  get medicationRequests(): MedicationRequest[] {
    return this.resources.filter(resource => resource.resourceType === "MedicationRequest") as MedicationRequest[];
  }

  get serviceRequests(): ServiceRequest[] {
    return this.resources.filter(resource => resource.resourceType === "ServiceRequest") as ServiceRequest[];
  }

  getMedicationName(medicationRequest: MedicationRequest): string {
    if (!medicationRequest.contained || medicationRequest.contained.length === 0) {
      return '';
    }

    const medication = medicationRequest.contained[0] as Medication;
    return medication.code.coding[0].display;
  }

  getTimingStringDuration = (repeat: TimingRepeat): string =>
    utils.getTimingStringDuration(repeat);

  getServiceRequestDays = (serviceRequest: ServiceRequest): string =>
    utils.getServiceRequestDays(serviceRequest);
}
