import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientsRoutingModule } from "./patients-routing.module";
import { PatientsComponent } from "./patients.component";
import { Ng2SmartTableModule } from "ng2-smart-table";
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
import { MedicationRequestFormComponent } from './medication-request-form/medication-request-form.component';
import { ReactiveFormsModule } from "@angular/forms";
import { ServiceRequestFormComponent } from './service-request-form/service-request-form.component';
import { GlucoseLevelsComponent } from './glucose-levels/glucose-levels.component';
import { NgxEchartsModule } from "ngx-echarts";
import { OrderDetailsComponent } from './order-details/order-details.component';
import { PatientViewComponent } from './patient-view/patient-view.component';

@NgModule({
  declarations: [
    PatientsComponent,
    TreatmentsComponent,
    MedicationRequestFormComponent,
    ServiceRequestFormComponent,
    GlucoseLevelsComponent,
    OrderDetailsComponent,
    PatientViewComponent
  ],
  imports: [
    CommonModule,
    PatientsRoutingModule,
    Ng2SmartTableModule,
    NgxEchartsModule,
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
export class PatientsModule {
}
