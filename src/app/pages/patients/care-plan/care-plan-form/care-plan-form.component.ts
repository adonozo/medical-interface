import { Component } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { Medication, MedicationRequest, Resource, ServiceRequest, TimingRepeat } from "fhir/r4";
import { CarePlanService } from "../../../../@core/services/care-plan.service";
import { flatMap } from "rxjs/internal/operators";
import * as utils from "../../../../@core/services/utils/utils";
import { FormStatus } from "../../../../@core/services/data/form-data";
import { NbDialogService } from "@nebular/theme";
import { ConfirmationDialogComponent } from "../../components/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-care-plan-form',
  templateUrl: './care-plan-form.component.html',
  styleUrls: ['./care-plan-form.component.scss']
})
export class CarePlanFormComponent {

  carePlanId: string;
  patientId: string;
  resources: Resource[];
  formStatus: FormStatus = FormStatus.default;
  readonly formStatusType = FormStatus;

  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private carePlanService: CarePlanService,
    private dialogService: NbDialogService,
  ) {
    this.activatedRoute.params.pipe(
      flatMap(params => {
        this.carePlanId = params["carePlanId"];
        this.patientId = params["patientId"];
        return this.carePlanService.getDetailedCarePlan(this.carePlanId);
      })
    ).subscribe(bundle => this.resources = bundle.entry?.map(entry => entry.resource) ?? []);
  }

  // TODO validate medication/service requests against activated care plan
  showActivateDialog(): void {
    this.dialogService.open(ConfirmationDialogComponent, {
      context: {
        title: 'Activate care plan',
        message: 'Do you want to activate the care plan?',
        confirmationButton: "Yes"
      }
    }).onClose.subscribe(result => {
      if (result) {
        this.activateCarePlan();
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  showDeleteDialog(): void {
    this.dialogService.open(ConfirmationDialogComponent, {
      context: {
        title: 'Delete care plan',
        message: 'Do you want to delete this care plan? This action cannot be reverted.',
        confirmationButton: "Delete"
      }
    }).onClose.subscribe(result => {
      if (result) {
        this.deleteCarePlan();
      }
    });
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

  disableButton = (): boolean => this.formStatus === FormStatus.loading || this.formStatus === FormStatus.success;

  private activateCarePlan() {
    this.formStatus = FormStatus.loading;
    this.carePlanService.activateCarePlan(this.carePlanId)
      .subscribe(_ => {
        this.formStatus = FormStatus.success;
      }, error =>  {
        console.log(error);
        this.formStatus = FormStatus.error;
      })
  }

  private deleteCarePlan() {
    this.formStatus = FormStatus.loading;
    this.carePlanService.deleteCarePlan(this.carePlanId)
      .subscribe(_ => this.location.back(),
        error => {
          console.log(error);
          this.formStatus = FormStatus.error;
        });
  }
}
