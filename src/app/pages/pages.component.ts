import { Component } from '@angular/core';
import { NbMenuItem } from "@nebular/theme";

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent {
  public menu: NbMenuItem[] = [
    {
      title: $localize`:Left-side menu item:Home`,
      icon: 'home-outline',
      link: '/pages/home'
    },
    {
      title: $localize`:Left-side menu item:Patients`,
      icon: 'people-outline',
      link: '/pages/patients',
      pathMatch: 'prefix'
    }
  ]
}
