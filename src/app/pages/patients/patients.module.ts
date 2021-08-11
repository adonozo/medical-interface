import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PatientsRoutingModule} from "./patients-routing.module";
import {PatientsComponent} from "./patients.component";
import {Ng2SmartTableModule} from "ng2-smart-table";
import { NewTreatmentComponent } from './new-treatment/new-treatment.component';
import {NbButtonModule, NbCardModule, NbInputModule, NbSelectModule} from "@nebular/theme";
import { TreatmentsComponent } from './treatments/treatments.component';
import { NewCarePlanComponent } from './new-care-plan/new-care-plan.component';
import { MedicationRequestFormComponent } from './medication-request-form/medication-request-form.component';

@NgModule({
  declarations: [
    PatientsComponent,
    NewTreatmentComponent,
    TreatmentsComponent,
    NewCarePlanComponent,
    MedicationRequestFormComponent
  ],
  imports: [
    CommonModule,
    PatientsRoutingModule,
    Ng2SmartTableModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbSelectModule
  ]
})
export class PatientsModule { }
