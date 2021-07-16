import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {PatientsComponent} from "./patients.component";
import {NewTreatmentComponent} from "./new-treatment/new-treatment.component";
import {TreatmentsComponent} from "./treatments/treatments.component";

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
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientsRoutingModule { }
