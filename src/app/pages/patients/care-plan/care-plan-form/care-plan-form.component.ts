import { Component } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { CarePlan, Patient, Resource } from "fhir/r4";
import { CarePlanService } from "../../../../@core/services/care-plan.service";
import { FormStatus } from "../../../../@core/models/enums";
import { NbDialogService } from "@nebular/theme";
import { ConfirmationDialogComponent } from "../../../../@core/components/confirmation-dialog/confirmation-dialog.component";
import { PatientsService } from "../../../../@core/services/patients.service";
import { AbstractCarePlanViewComponent } from "../abstract-care-plan-view.component";

@Component({
  selector: 'app-care-plan-form',
  templateUrl: './care-plan-form.component.html',
  styleUrls: ['./care-plan-form.component.scss']
})
export class CarePlanFormComponent extends AbstractCarePlanViewComponent {

  override carePlanId: string | undefined;
  override patientId: string | undefined;
  override resources: Resource[] = [];
  override patient: Patient | undefined;
  override carePlan: CarePlan | undefined;

  constructor(
    protected override location: Location,
    protected override router: Router,
    protected override activatedRoute: ActivatedRoute,
    protected override carePlanService: CarePlanService,
    protected override patientService: PatientsService,
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
        title: $localize`Activate care plan`,
        message: $localize`Do you want to activate the care plan?`,
        confirmationButton: $localize`Yes`
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
        title: $localize`Delete care plan`,
        message: $localize`Do you want to delete this care plan? This action cannot be reverted.`,
        confirmationButton: $localize`Delete`
      }
    }).onClose.subscribe(result => {
      if (result) {
        this.deleteCarePlan();
      }
    });
  }

  async navigate(page: string): Promise<void> {
    switch (page) {
      case 'new-medication':
        await this.router.navigate(
          [`${this.patientId}/care-plans/${this.carePlanId}/new-medication-request`],
          {relativeTo: this.activatedRoute.parent})
        break;
      case 'new-service':
        await this.router.navigate(
          [`${this.patientId}/care-plans/${this.carePlanId}/new-service-request`],
          {relativeTo: this.activatedRoute.parent})
        return;
    }
  }

  makeServiceRequestEditRoute = (id: string): string =>
    `${this.patientId}/care-plans/${this.carePlanId}/service-request/${id}/edit`;

  makeMedicationRequestEditRoute = (id: string): string =>
    `${this.patientId}/care-plans/${this.carePlanId}/medication-request/${id}/edit`;

  private activateCarePlan(): void {
    if (!this.carePlanId) {
      this.formStatus = FormStatus.error;
      return;
    }

    this.formStatus = FormStatus.loading;
    this.carePlanService.activateCarePlan(this.carePlanId)
      .subscribe(_ => {
        this.formStatus = FormStatus.success;
      }, error =>  {
        console.log(error);
        this.formStatus = FormStatus.error;
      })
  }

  private deleteCarePlan(): void {
    if (!this.carePlanId) {
      this.formStatus = FormStatus.error;
      return;
    }

    this.formStatus = FormStatus.loading;
    this.carePlanService.deleteCarePlan(this.carePlanId)
      .subscribe(_ => this.location.back(),
        error => {
          console.log(error);
          this.formStatus = FormStatus.error;
        });
  }
}
