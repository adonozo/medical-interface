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
  NbCardModule, NbCheckboxModule, NbDatepickerModule, NbFormFieldModule, NbIconModule,
  NbInputModule, NbRadioModule,
  NbSelectModule, NbTimepickerModule
} from "@nebular/theme";
import { TreatmentsComponent } from './treatments/treatments.component';
import { ReactiveFormsModule } from "@angular/forms";
import { GlucoseLevelsComponent } from './glucose-levels/glucose-levels.component';
import { NgxEchartsModule } from "ngx-echarts";
import { OrderDetailsComponent } from './order-details/order-details.component';
import { PatientViewComponent } from './patient-view/patient-view.component';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { PatientFormService } from "./patient-form/patient-form.service";
import { ThemeModule } from "../../@theme/theme.module";
import { ObservationFormComponent } from './glucose-levels/observation-form/observation-form.component';
import { CarePlanComponent } from './care-plan/care-plan.component';
import { CarePlanFormComponent } from './care-plan/care-plan-form/care-plan-form.component';
import { MedicationRequestEditFormComponent } from "./medication-request-form/medication-request-edit-form.component";
import { MedicationRequestNewFormComponent } from "./medication-request-form/medication-request-new-form.component";
import { NbMomentDateModule } from "@nebular/moment";
import { ServiceRequestNewFormComponent } from "./service-request-form/service-request-new-form.component";
import { ServiceRequestEditFormComponent } from "./service-request-form/service-request-edit-form.component";
import { DurationFormComponent } from './components/duration-form/duration-form.component';
import { WeekTimingFormComponent } from './components/week-timing-form/week-timing-form.component';
import { DailyFrequencyFormComponent } from './components/daily-frequency-form/daily-frequency-form.component';
import { FrequencyFormComponent } from './components/frequency-form/frequency-form.component';

@NgModule({
  declarations: [
    PatientsComponent,
    TreatmentsComponent,
    MedicationRequestEditFormComponent,
    MedicationRequestNewFormComponent,
    ServiceRequestNewFormComponent,
    ServiceRequestEditFormComponent,
    GlucoseLevelsComponent,
    OrderDetailsComponent,
    PatientViewComponent,
    PatientFormComponent,
    ObservationFormComponent,
    CarePlanComponent,
    CarePlanFormComponent,
    DurationFormComponent,
    WeekTimingFormComponent,
    DailyFrequencyFormComponent,
    FrequencyFormComponent
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
    NbMomentDateModule,
    NbAlertModule,
    ThemeModule,
    NbFormFieldModule
  ],
  providers: [
    PatientFormService
  ]
})
export class PatientsModule {
}
