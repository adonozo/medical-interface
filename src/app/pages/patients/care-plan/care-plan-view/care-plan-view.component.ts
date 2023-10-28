import { Component } from '@angular/core';
import { AbstractCarePlanViewComponent } from "../abstract-care-plan-view.component";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { CarePlanService } from "../../../../@core/services/care-plan.service";
import { PatientsService } from "../../../../@core/services/patients.service";
import { NbDialogService } from "@nebular/theme";
import {
  ConfirmationDialogComponent
} from "../../../../@core/components/confirmation-dialog/confirmation-dialog.component";
import { FormStatus } from "../../../../@core/models/enums";

@Component({
  selector: 'app-care-plan-view',
  templateUrl: './care-plan-view.component.html',
  styleUrls: ['./care-plan-view.component.scss']
})
export class CarePlanViewComponent extends AbstractCarePlanViewComponent {

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
      patientService,
    );
  }

  showDeactivateDialog(): void {
    this.dialogService.open(ConfirmationDialogComponent, {
      context: {
        title: $localize`Deactivate care plan`,
        message: $localize`Do you want to deactivate the care plan? You won't be able to activate it again.`,
        confirmationButton: $localize`Yes`
      }
    }).onClose.subscribe(result => {
      if (result) {
        this.deactivateCarePlan();
      }
    });
  }

  private deactivateCarePlan(): void {
    this.formStatus = FormStatus.loading;
    this.carePlanService.revokeCarePlan(this.carePlanId)
      .subscribe(_ => {
        this.formStatus = FormStatus.success;
      }, error =>  {
        console.log(error);
        this.formStatus = FormStatus.error;
      })
  }
}
