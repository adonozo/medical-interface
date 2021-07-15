import { Component, OnInit } from '@angular/core';
import {PatientsService} from "../../@core/services/patients.service";
import {LocalDataSource} from "ng2-smart-table";

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
        type: 'number'
      }
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
      custom: [
        {
          name: 'new-treatment',
          title: '<i class="nb-plus-circled inline-block width: 50px"></i>'
        },
        {
          name: 'records',
          title: '<i class="nb-list inline-block width: 50px"></i>',
        }
      ]
    }
  }

  constructor(private patientService: PatientsService) { }

  ngOnInit(): void {
    this.getPatientData();
  }

  private getPatientData(): void {
    this.patientService.getPatientList()
      .subscribe(patients =>
      {
        this.source = new LocalDataSource(patients);
      })
  }
}
