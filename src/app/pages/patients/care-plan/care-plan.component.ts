import { AfterViewInit, Component } from '@angular/core';
import { CarePlanService } from "../../../@core/services/care-plan.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PaginatedResult } from "../../../@core/models/paginatedResult";
import { CarePlan } from "fhir/r4";
import { LocalDataSource } from "ng2-smart-table";

@Component({
  selector: 'app-care-plan',
  templateUrl: './care-plan.component.html',
  styleUrls: ['./care-plan.component.scss']
})
export class CarePlanComponent implements AfterViewInit {
  private patientId: string;
  private readonly defaultLimit = 20;

  source: LocalDataSource;
  paginatedCarePlans: PaginatedResult<CarePlan>;

  settings = {
    selectedRowIndex: -1,
    columns: {
      status: {
        title: 'Status',
        filter: false,
        sort: false
      },
      lastModified: {
        title: 'Last modified',
        filter: false,
        sort: false
      }
    },
    pager: {
      display: false
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
      columnTitle: 'Actions',
      custom: [
        {
          name: 'details',
          title: `<div class="badge d-table"><i class="fa-xs far fa-eye"></i> <span class="icon-text text-dark ml-1">Details</span></div>`,
        },
        {
          name: 'edit',
          title: `<div class="badge d-table mr-3"><i class="fa-xs far fa-edit"></i> <span class="icon-text text-dark ml-1">Edit</span></div>`,
        }
      ]
    },
    hideSubHeader: true,
    mode: 'external',
  }

  constructor(
    private carePlanService: CarePlanService,
    private activatedRoute: ActivatedRoute,
    private router: Router,) {
  }

  ngAfterViewInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.patientId = params['patientId'];
      this.getCarePlans();
    });
  }

  async onCustomEvent(event: any): Promise<void> {
    switch (event.action) {
      case 'edit':
        await this.router.navigate(
          [`${this.patientId}/care-plans/${event.data.id}/edit`],
          {relativeTo: this.activatedRoute.parent})
        break;
    }
  }

  private getCarePlans(): void {
    this.carePlanService.getCarePlans(this.patientId, this.defaultLimit)
      .subscribe(carePlans => {
        this.paginatedCarePlans = carePlans;
        this.source = new LocalDataSource(carePlans.results.map(carePlan => {
          return {
            id: carePlan.id,
            status: carePlan.status,
            lastModified: carePlan.created
          }
        }));
      });
  }
}
