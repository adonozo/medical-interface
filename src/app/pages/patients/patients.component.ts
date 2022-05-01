import { Component, OnInit } from '@angular/core';
import { PatientsService } from "../../@core/services/patients.service";
import { LocalDataSource } from "ng2-smart-table";
import { ActivatedRoute, Router } from "@angular/router";
import { PatientsLocale } from "./patients.locale";
import { ResourceUtils } from "../../@core/services/utils/resourceUtils";
import { Extensions } from "../../@core/services/data/constants";
import { PaginatedResult } from "../../@core/models/paginatedResult";
import { Patient } from "fhir/r4";

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  private readonly defaultLimit = 20;
  source: LocalDataSource;
  results: PaginatedResult<Patient>

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
    pager: {
      perPage: this.defaultLimit
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
    this.getPatientsData(this.defaultLimit);
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

  nextPatients(): void {
    this.getPatientsData(this.defaultLimit, this.results.lastDataCursor);
  }

  private getPatientsData(limit: number, lastCursor?: string): void {
    this.patientService.getPatientsList(limit, lastCursor)
      .subscribe(paginatedPatients => {
          this.results = paginatedPatients;
          this.source = new LocalDataSource(paginatedPatients.results.map(patient => {
            const data: any = patient;
            data.name = ResourceUtils.getPatientName(patient);
            data.email = ResourceUtils.getStringExtension(patient, Extensions.EMAIL)
            return data;
          }))
        }
      )
  }
}
