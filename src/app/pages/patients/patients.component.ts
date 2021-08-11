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
      columnTitle: 'Treatments',
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

  constructor(
    private patientService: PatientsService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getPatientData();
  }

  public onCustomPatients(event: any) {
    console.log(event);
    switch (event.action) {
      case 'new-treatment':
        this.router.navigate(['1234/new-medication-request'], {relativeTo: this.activatedRoute.parent});
        break;
      case 'records':
        this.router.navigate(['treatments'], {relativeTo: this.activatedRoute.parent});
        break;
    }
  }

  private getPatientData(): void {
    this.patientService.getPatientList()
      .subscribe(patients =>
      {
        this.source = new LocalDataSource(patients);
      })
  }
}
