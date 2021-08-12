import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PatientsRoutingModule} from "./patients-routing.module";
import {PatientsComponent} from "./patients.component";
import {Ng2SmartTableModule} from "ng2-smart-table";
import { NewTreatmentComponent } from './new-treatment/new-treatment.component';
import {
    NbAlertModule,
    NbAutocompleteModule,
    NbButtonGroupModule,
    NbButtonModule,
    NbCardModule, NbCheckboxModule, NbDatepickerModule, NbIconModule,
    NbInputModule, NbRadioModule,
    NbSelectModule, NbTimepickerModule
} from "@nebular/theme";
import { TreatmentsComponent } from './treatments/treatments.component';
import { NewCarePlanComponent } from './new-care-plan/new-care-plan.component';
import { MedicationRequestFormComponent } from './medication-request-form/medication-request-form.component';
import {ReactiveFormsModule} from "@angular/forms";
import { ServiceRequestFormComponent } from './service-request-form/service-request-form.component';

@NgModule({
  declarations: [
    PatientsComponent,
    NewTreatmentComponent,
    TreatmentsComponent,
    NewCarePlanComponent,
    MedicationRequestFormComponent,
    ServiceRequestFormComponent
  ],
    imports: [
        CommonModule,
        PatientsRoutingModule,
        Ng2SmartTableModule,
        NbCardModule,
        NbInputModule,
        NbButtonModule,
        NbSelectModule,
        NbAutocompleteModule,
        ReactiveFormsModule,
        NbButtonGroupModule,
        NbCheckboxModule,
        NbTimepickerModule,
        NbIconModule,
        NbRadioModule,
        NbDatepickerModule,
        NbAlertModule
    ]
})
export class PatientsModule { }
