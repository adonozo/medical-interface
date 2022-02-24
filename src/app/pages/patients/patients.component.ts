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
    selectedRowIndex: -1,
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
          name: 'view',
          title: `<div class="badge d-table"><i class="fa-xxs fa fa-eye"></i> <span class="label text-dark ml-1">${PatientsLocale.viewAction}</span></div>`,
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
    this.getPatientsData();
  }

  public async onCustomPatients(event: any): Promise<void> {
    switch (event.action) {
      case 'view':
        await this.router.navigate([event.data.id + '/view'], {relativeTo: this.activatedRoute.parent});
        break;
    }
  }

  public async onRowSelected(event: any): Promise<void> {
    await this.router.navigate([event.data.id + '/view'], {relativeTo: this.activatedRoute.parent});
  }

  public async openPatientForm(): Promise<void> {
    await this.router.navigate(['new-patient'], {relativeTo: this.activatedRoute.parent});
  }

  private getPatientsData(): void {
    this.patientService.getPatientsList()
      .subscribe(patients =>
        this.source = new LocalDataSource(patients.map(patient => {
          const data: any = patient;
          data.name = `${patient.firstName} ${patient.lastName}`;
          return data;
        }))
      )
  }
}
