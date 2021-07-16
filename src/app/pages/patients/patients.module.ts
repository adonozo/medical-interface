import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PatientsRoutingModule} from "./patients-routing.module";
import {PatientsComponent} from "./patients.component";
import {Ng2SmartTableModule} from "ng2-smart-table";
import { NewTreatmentComponent } from './new-treatment/new-treatment.component';
import {NbButtonModule, NbCardModule, NbInputModule, NbSelectModule} from "@nebular/theme";



@NgModule({
  declarations: [
    PatientsComponent,
    NewTreatmentComponent
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
