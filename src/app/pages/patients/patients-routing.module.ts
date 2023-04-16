import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { PatientsComponent } from "./patients.component";
import { TreatmentsComponent } from "./treatments/treatments.component";
import { GlucoseLevelsComponent } from "./glucose-levels/glucose-levels.component";
import { OrderDetailsComponent } from "./order-details/order-details.component";
import { PatientViewComponent } from "./patient-view/patient-view.component";
import { PatientFormComponent } from "./patient-form/patient-form.component";
import { CarePlanFormComponent } from "./care-plan/care-plan-form/care-plan-form.component";
import { MedicationRequestEditFormComponent } from "./medication-request-form/medication-request-edit-form.component";
import { MedicationRequestNewFormComponent } from "./medication-request-form/medication-request-new-form.component";
import { ServiceRequestNewFormComponent } from "./service-request-form/service-request-new-form.component";
import { ServiceRequestEditFormComponent } from "./service-request-form/service-request-edit-form.component";
import { CarePlanViewComponent } from "./care-plan/care-plan-view/care-plan-view.component";

const routes: Routes = [
  {
    path: '',
    component: PatientsComponent,
  },
  {
    path: 'new-patient',
    component: PatientFormComponent
  },
  {
    path: ':patientId/view',
    component: PatientViewComponent
  },
  {
    path: ':patientId/edit',
    component: PatientFormComponent
  },
  {
    path: ':patientId/treatments',
    component: TreatmentsComponent
  },
  {
    path: ':patientId/glucose-levels',
    component: GlucoseLevelsComponent
  },
  {
    path: ':patientId/care-plans/:carePlanId/edit',
    component: CarePlanFormComponent
  },
  {
    path: ':patientId/care-plans/:carePlanId/view',
    component: CarePlanViewComponent
  },
  {
    path: ':patientId/care-plans/:carePlanId/new-medication-request',
    component: MedicationRequestNewFormComponent
  },
  {
    path: ':patientId/care-plans/:carePlanId/medication-request/:medicationRequestId/edit',
    component: MedicationRequestEditFormComponent
  },
  {
    path: ':patientId/care-plans/:carePlanId/new-service-request',
    component: ServiceRequestNewFormComponent
  },
  {
    path: ':patientId/care-plans/:carePlanId/service-request/:serviceRequestId/edit',
    component: ServiceRequestEditFormComponent
  },
  {
    // order-type: medication-order or service-order
    path: ':patientId/:order-type/:orderId',
    component: OrderDetailsComponent
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientsRoutingModule {
}
