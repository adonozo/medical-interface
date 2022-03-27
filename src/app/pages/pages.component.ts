import { Component } from '@angular/core';
import { NbMenuItem } from "@nebular/theme";
import { PagesLocale } from "./pages.locale";

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent {
  public menu: NbMenuItem[] = [
    {
      title: PagesLocale.home,
      icon: 'home-outline',
      link: '/pages/home'
    },
    {
      title: PagesLocale.patients,
      icon: 'people-outline',
      link: '/pages/patients',
      pathMatch: 'prefix'
    }
  ]
}
