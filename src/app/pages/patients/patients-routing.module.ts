import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {PatientsComponent} from "./patients.component";
import {NewTreatmentComponent} from "./new-treatment/new-treatment.component";
import {TreatmentsComponent} from "./treatments/treatments.component";
import {MedicationRequestComponent} from "./medication-request/medication-request.component";

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
        path: 'treatments',
        component: TreatmentsComponent
      },
      {
        path: ':patientId/new-medication-request',
        component: MedicationRequestComponent
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientsRoutingModule { }
