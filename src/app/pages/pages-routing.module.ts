import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {PagesComponent} from "./pages.component";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'patients',
        loadChildren: () => import('./patients/patients.module')
          .then(module => module.PatientsModule)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
