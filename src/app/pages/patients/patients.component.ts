import { Component, OnInit } from '@angular/core';
import { PatientsService } from "../../@core/services/patients.service";
import { LocalDataSource } from "ng2-smart-table";
import { ActivatedRoute, Router } from "@angular/router";
import { PatientsLocale } from "./patients.locale";
import { Extensions } from "../../@core/services/data/constants";
import { PaginatedResult } from "../../@core/models/paginatedResult";
import { Patient } from "fhir/r4";
import * as patientUtils from "../../@core/services/utils/patient-utils";
import * as resourceUtils from "../../@core/services/utils/resource-utils";

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
      display: false
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
      columnTitle: PatientsLocale.actionsColumn,
      custom: [
        {
          name: 'view',
          title: `<div class="badge d-table"><i class="fa-xs far fa-eye"></i> <span class="icon-text text-dark ml-1">${PatientsLocale.viewAction}</span></div>`,
        }
      ]
    },
    hideSubHeader: true
  }

  constructor(
    private patientService: PatientsService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.getPatientsData(this.defaultLimit);
  }

  async onCustomPatients(event: any): Promise<void> {
    switch (event.action) {
      case 'view':
        await this.router.navigate([event.data.id + '/view'], {relativeTo: this.activatedRoute.parent});
        break;
    }
  }

  async onRowSelected(event: any): Promise<void> {
    await this.router.navigate([event.data.id + '/view'], {relativeTo: this.activatedRoute.parent});
  }

  getPatients(lastCursor?: string): void {
    this.getPatientsData(this.defaultLimit, lastCursor);
  }

  private getPatientsData(limit: number, lastCursor?: string): void {
    this.patientService.getPatientsList(limit, lastCursor)
      .subscribe(paginatedPatients => {
          this.results = paginatedPatients;
          this.source = new LocalDataSource(paginatedPatients.results.map(patient => {
            const data: any = patient;
            data.name = patientUtils.getPatientName(patient);
            data.email = resourceUtils.getStringExtension(patient, Extensions.EMAIL)
            return data;
          }))
        }
      )
  }
}
