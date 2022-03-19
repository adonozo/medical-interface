import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { PatientsComponent } from "./patients.component";
import { TreatmentsComponent } from "./treatments/treatments.component";
import { MedicationRequestFormComponent } from "./medication-request-form/medication-request-form.component";
import { ServiceRequestFormComponent } from "./service-request-form/service-request-form.component";
import { GlucoseLevelsComponent } from "./glucose-levels/glucose-levels.component";
import { OrderDetailsComponent } from "./order-details/order-details.component";
import { PatientViewComponent } from "./patient-view/patient-view.component";
import { PatientFormComponent } from "./patient-form/patient-form.component";

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
    path: ':patientId/new-medication-request',
    component: MedicationRequestFormComponent
  },
  {
    path: ':patientId/new-service-request',
    component: ServiceRequestFormComponent
  },
  {
    path: ':patientId/glucose-levels',
    component: GlucoseLevelsComponent
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
