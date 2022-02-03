import { Component, OnInit } from '@angular/core';
import { PatientsService } from "../../@core/services/patients.service";
import { LocalDataSource } from "ng2-smart-table";
import { ActivatedRoute, Router } from "@angular/router";
import { PatientsLocale } from "./patients.locale";

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  source: LocalDataSource;

  settings = {
    columns: {
      name: {
        title: PatientsLocale.nameColumn,
        type: 'string'
      },
      email: {
        title: PatientsLocale.emailColumn,
        type: 'string'
      }
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
      columnTitle: PatientsLocale.actionsColumn,
      custom: [
        {
          name: 'orders',
          title: `<div class="badge d-table"><i class="fa-xxs fa fa-list-alt"></i> <span class="label text-dark ml-1">${PatientsLocale.ordersAction}</span></div>`,
        },
        {
          name: 'glucose-levels',
          title: `<div class="badge d-table"><i class="fa-xxs far fa-chart-bar"></i> <span class="label text-dark ml-1">${PatientsLocale.glucoseAction}</span></div>`
        }
      ]
    }
  }

  constructor(
    private patientService: PatientsService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.getPatientData();
  }

  public async onCustomPatients(event: any): Promise<void> {
    switch (event.action) {
      case 'glucose-levels':
        await this.router.navigate([event.data.id + '/glucose-levels'], {relativeTo: this.activatedRoute.parent});
        break;
      case 'orders':
        await this.router.navigate([event.data.id + '/treatments'], {relativeTo: this.activatedRoute.parent});
        break;
    }
  }

  private getPatientData(): void {
    this.patientService.getPatientList()
      .subscribe(patients =>
        this.source = new LocalDataSource(patients.map(patient => {
          const data: any = patient;
          data.name = `${patient.firstName} ${patient.lastName}`;
          return data;
        }))
      )
  }
}
