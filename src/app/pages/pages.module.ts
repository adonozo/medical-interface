import { NgModule } from '@angular/core';
import {ThemeModule} from "../@theme/theme.module";
import { PagesComponent } from './pages.component';
import {NbCardModule, NbMenuModule} from "@nebular/theme";
import {HomeModule} from "./home/home.module";
import {PagesRoutingModule} from "./pages-routing.module";


@NgModule({
  declarations: [
    PagesComponent,
  ],
  imports: [
    ThemeModule,
    NbMenuModule,
    PagesRoutingModule,
    HomeModule,
    NbCardModule,
  ]
})
export class PagesModule { }
