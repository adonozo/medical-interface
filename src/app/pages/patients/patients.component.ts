import { Component, OnInit } from '@angular/core';
import {PatientsService} from "../../@core/services/patients.service";
import {LocalDataSource} from "ng2-smart-table";
import {ActivatedRoute, Router} from "@angular/router";

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
        title: 'Name',
        type: 'string'
      },
      email: {
        title: 'Email',
        type: 'string'
      }
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
      columnTitle: 'Actions',
      custom: [
        {
          name: 'records',
          title: '<i class="action-icon fa fa-list-ul inline-block"></i>',
        },
        {
          name: 'glucose-levels',
          title: '<i class="action-icon far fa-chart-bar inline-block"></i>'
        }
      ]
    }
  }

  constructor(
    private patientService: PatientsService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getPatientData();
  }

  public onCustomPatients(event: any) {
    switch (event.action) {
      case 'glucose-levels':
        this.router.navigate([event.data.id + '/glucose-levels'], {relativeTo: this.activatedRoute.parent});
        break;
      case 'records':
        this.router.navigate([event.data.id + '/treatments'], {relativeTo: this.activatedRoute.parent});
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
