import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {PatientsComponent} from "./patients.component";
import {NewTreatmentComponent} from "./new-treatment/new-treatment.component";
import {TreatmentsComponent} from "./treatments/treatments.component";
import {MedicationRequestFormComponent} from "./medication-request-form/medication-request-form.component";
import {ServiceRequestFormComponent} from "./service-request-form/service-request-form.component";
import {GlucoseLevelsComponent} from "./glucose-levels/glucose-levels.component";

const routes: Routes = [
  {
    path: '',
    component: PatientsComponent,
    children: [
      {
        path: 'new',
        component: NewTreatmentComponent,
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
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientsRoutingModule { }
