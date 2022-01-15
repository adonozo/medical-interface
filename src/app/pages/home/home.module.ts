import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from "./home.component";
import { NbCardModule, NbIconModule } from "@nebular/theme";


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NbIconModule
  ]
})
export class HomeModule {
}
