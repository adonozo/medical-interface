import { Component } from '@angular/core';
import { NbSidebarService } from "@nebular/theme";
import { Router } from "@angular/router";

@Component({
  selector: 'app-one-column',
  templateUrl: './one-column.component.html',
  styleUrls: ['./one-column.component.scss']
})
export class OneColumnComponent{

  constructor(
    private sidebarService: NbSidebarService,
    private router: Router) {
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  async navigateHome(): Promise<boolean> {
    await this.router.navigate(['pages/home'])
    return false;
  }
}
