import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientsRoutingModule } from "./patients-routing.module";
import { PatientsComponent } from "./patients.component";
import {
  NbAlertModule,
  NbAutocompleteModule,
  NbButtonGroupModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbTimepickerModule
} from "@nebular/theme";
import { ReactiveFormsModule } from "@angular/forms";
import { GlucoseLevelsComponent } from './glucose-levels/glucose-levels.component';
import { NgxEchartsModule } from "ngx-echarts";
import { PatientViewComponent } from './patient-view/patient-view.component';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { PatientFormService } from "./patient-form/patient-form.service";
import { ThemeModule } from "../../@theme/theme.module";
import { ObservationFormComponent } from './glucose-levels/observation-form/observation-form.component';
import { CarePlanComponent } from './care-plan/care-plan.component';
import { CarePlanFormComponent } from './care-plan/care-plan-form/care-plan-form.component';
import { MedicationRequestEditFormComponent } from "./medication-request-form/medication-request-edit-form.component";
import { MedicationRequestNewFormComponent } from "./medication-request-form/medication-request-new-form.component";
import { ServiceRequestNewFormComponent } from "./service-request-form/service-request-new-form.component";
import { ServiceRequestEditFormComponent } from "./service-request-form/service-request-edit-form.component";
import { DurationControlComponent } from './components/duration-control/duration-control.component';
import { WeekTimingControlComponent } from './components/week-timing-control/week-timing-control.component';
import { DailyFrequencyControlComponent } from './components/daily-frequency-control/daily-frequency-control.component';
import { FrequencyFormControl } from './components/frequency-control/frequency-form-control.component';
import { ConfirmationDialogComponent } from '../../@core/components/confirmation-dialog/confirmation-dialog.component';
import { CarePlanStatusComponent } from '../../@core/components/table-components/care-plan-status/care-plan-status.component';
import { ResourceActionsComponent } from '../../@core/components/table-components/resource-actions/resource-actions.component';
import { CarePlanDetailsComponent } from './components/care-plan-details/care-plan-details.component';
import { CarePlanViewComponent } from './care-plan/care-plan-view/care-plan-view.component';
import { ServiceRequestViewComponent } from './components/service-request-view/service-request-view.component';
import { MedicationRequestViewComponent } from './components/medication-request-view/medication-request-view.component';
import { FormActionsComponent } from './components/form-actions/form-actions.component';
import { PatientsTableComponent } from './components/patients-table/patients-table.component';
import { CarePlansTableComponent } from './components/care-plans-table/care-plans-table.component';
import { ObservationsTableComponent } from './glucose-levels/observations-table/observations-table.component';

@NgModule({
  declarations: [
    PatientsComponent,
    MedicationRequestEditFormComponent,
    MedicationRequestNewFormComponent,
    ServiceRequestNewFormComponent,
    ServiceRequestEditFormComponent,
    GlucoseLevelsComponent,
    PatientViewComponent,
    PatientFormComponent,
    ObservationFormComponent,
    CarePlanComponent,
    CarePlanFormComponent,
    DurationControlComponent,
    WeekTimingControlComponent,
    DailyFrequencyControlComponent,
    FrequencyFormControl,
    ConfirmationDialogComponent,
    CarePlanStatusComponent,
    ResourceActionsComponent,
    CarePlanDetailsComponent,
    CarePlanViewComponent,
    ServiceRequestViewComponent,
    MedicationRequestViewComponent,
    FormActionsComponent,
    PatientsTableComponent,
    CarePlansTableComponent,
    ObservationsTableComponent
  ],
  imports: [
    CommonModule,
    PatientsRoutingModule,
    NgxEchartsModule.forRoot({echarts: () => import('echarts')}),
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
