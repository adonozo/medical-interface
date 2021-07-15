import { NgModule } from '@angular/core';
import {ThemeModule} from "../@theme/theme.module";
import { PagesComponent } from './pages.component';
import {NbCardModule, NbMenuModule} from "@nebular/theme";
import {HomeModule} from "./home/home.module";
import {PagesRoutingModule} from "./pages-routing.module";
import { PatientsComponent } from './patients/patients.component';
import {Ng2SmartTableModule} from "ng2-smart-table";


@NgModule({
  declarations: [
    PagesComponent,
    PatientsComponent
  ],
  imports: [
    ThemeModule,
    NbMenuModule,
    PagesRoutingModule,
    HomeModule,
    NbCardModule,
    Ng2SmartTableModule
  ]
})
export class PagesModule { }
