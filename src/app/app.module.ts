import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThemeModule } from "./@theme/theme.module";
import {
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule, NbTimepickerModule,
  NbToastrModule,
  NbWindowModule
} from "@nebular/theme";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from "@angular/forms";
import { NbDateFnsDateModule } from "@nebular/date-fns";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbTimepickerModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDateFnsDateModule.forRoot({
      format: "dd/MM/yyyy",
      parseOptions: { useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true },
      formatOptions: { useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true },
    }),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    ThemeModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
