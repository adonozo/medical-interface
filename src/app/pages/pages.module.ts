import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ThemeModule} from "../@theme/theme.module";
import { PagesComponent } from './pages.component';
import {NbMenuModule} from "@nebular/theme";
import {HomeModule} from "./home/home.module";
import {PagesRoutingModule} from "./pages-routing.module";
import { PatientsComponent } from './patients/patients.component';


@NgModule({
  declarations: [
    PagesComponent,
    PatientsComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    NbMenuModule,
    PagesRoutingModule,
    HomeModule
  ]
})
export class PagesModule { }
