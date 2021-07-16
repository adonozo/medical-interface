import { Component, OnInit } from '@angular/core';
import {TreatmentsService} from "../../../@core/services/treatments.service";
import {LocalDataSource} from "ng2-smart-table";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-treatments',
  templateUrl: './treatments.component.html',
  styleUrls: ['./treatments.component.scss']
})
export class TreatmentsComponent implements OnInit {
  source: LocalDataSource;

  settings = {
    columns: {
      created: {
        title: 'Created',
        type: 'string'
      },
      period: {
        title: 'Period',
        type: 'string'
      },
      plan: {
        title: 'Plan',
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
          name: 'treatment-details',
          title: '<i class="nb-plus-circled inline-block width: 50px"></i>'
        },
        {
          name: 'records',
          title: '<i class="nb-list inline-block width: 50px"></i>',
        }
      ]
    }
  }

  constructor(private treatmentService: TreatmentsService) { }

  ngOnInit(): void {
    this.getPatientTreatments();
  }

  private getPatientTreatments(): void {
    this.treatmentService.getTreatmentsForPatient()
      .pipe(
        map(treatments => {
          return treatments.map(treatment => {
            return {
              created: treatment.created,
              period: `${treatment.period.start} - ${treatment.period.end}`,
              plan: treatment.contained.map(item => item.resourceType + ' ')
            }
          })
        })
      )
      .subscribe(treatments => {
        this.source = new LocalDataSource(treatments);
      })
  }
}
