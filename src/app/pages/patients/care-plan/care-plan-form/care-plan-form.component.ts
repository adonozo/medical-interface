import { Component } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { CarePlan, Medication, MedicationRequest, Patient, Resource, ServiceRequest, TimingRepeat } from "fhir/r4";
import { CarePlanService } from "../../../../@core/services/care-plan.service";
import * as utils from "../../../../@core/services/utils/utils";
import { FormStatus } from "../../../../@core/services/data/form-data";
import { NbDialogService } from "@nebular/theme";
import { ConfirmationDialogComponent } from "../../components/confirmation-dialog/confirmation-dialog.component";
import { PatientsService } from "../../../../@core/services/patients.service";
import { AbstractCarePlanViewComponent } from "../abstract-care-plan-view.component";

@Component({
  selector: 'app-care-plan-form',
  templateUrl: './care-plan-form.component.html',
  styleUrls: ['./care-plan-form.component.scss']
})
export class CarePlanFormComponent extends AbstractCarePlanViewComponent {

  carePlanId: string;
  patientId: string;
  resources: Resource[];
  patient: Patient;
  carePlan: CarePlan;
  formStatus: FormStatus = FormStatus.default;

  constructor(
    protected location: Location,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected carePlanService: CarePlanService,
    protected patientService: PatientsService,
    private dialogService: NbDialogService,
  ) {
    super(
      location,
      router,
      activatedRoute,
      carePlanService,
      patientService
    );
  }

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
