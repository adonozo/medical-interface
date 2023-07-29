import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { CarePlanService } from "../../../@core/services/care-plan.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PaginatedResult } from "../../../@core/models/paginatedResult";
import { CarePlan } from "fhir/r4";
import { LocalDataSource } from "ng2-smart-table";
import { CarePlanStatusComponent } from "../../../@core/components/table-components/care-plan-status/care-plan-status.component";
import { ResourceActionsComponent } from "../../../@core/components/table-components/resource-actions/resource-actions.component";
import { TableActions } from "../../../@core/components/table-components/resource-actions/table-actions";
import { TableActionsService } from "../../../@core/components/table-components/resource-actions/table-actions.service";
import { Subject } from "rxjs";
import { dateToString, getDateFromString } from "../../../@core/services/utils/utils";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-care-plan',
  templateUrl: './care-plan.component.html',
  styleUrls: ['./care-plan.component.scss']
})
export class CarePlanComponent implements AfterViewInit, OnDestroy {
  private patientId: string;
  private readonly defaultLimit = 20;
  private unSubscriber: Subject<void> = new Subject();

  source: LocalDataSource;
  paginatedCarePlans: PaginatedResult<CarePlan>;

  settings = {
    selectedRowIndex: -1,
    columns: {
      resourceAction: {
        title: 'Action',
        filter: false,
        sort: false,
        type: 'custom',
        renderComponent: ResourceActionsComponent
      },
      status: {
        title: 'Status',
        filter: false,
        sort: false,
        type: 'custom',
        renderComponent: CarePlanStatusComponent
      },
      created: {
        title: 'Created at',
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
    },
    hideSubHeader: true,
    mode: 'external',
  }

  constructor(
    private carePlanService: CarePlanService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tableActionsService: TableActionsService
  ) {
    this.subscribeToActions()
  }

  ngAfterViewInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.patientId = params['patientId'];
      this.getCarePlans();
    });
  }

  ngOnDestroy() {
    this.unSubscriber.next();
    this.unSubscriber.complete();
  }

  private subscribeToActions() {
    this.tableActionsService.callEdit
      .pipe(takeUntil(this.unSubscriber))
      .subscribe(resource => this.router.navigate(
        [`${this.patientId}/care-plans/${resource.id}/edit`],
        {relativeTo: this.activatedRoute.parent}));

    this.tableActionsService.callView
      .pipe(takeUntil(this.unSubscriber))
      .subscribe(resource => this.router.navigate(
        [`${this.patientId}/care-plans/${resource.id}/view`],
        {relativeTo: this.activatedRoute.parent}));
  }

  private getCarePlans(): void {
    this.carePlanService.getCarePlans(this.patientId, this.defaultLimit)
      .subscribe(carePlans => {
        this.paginatedCarePlans = carePlans;
        this.source = new LocalDataSource(carePlans.results.map(carePlan => {
          const createdDate = getDateFromString(carePlan.created);
          return {
            id: carePlan.id,
            status: carePlan.status,
            created: dateToString(createdDate),
            resourceAction: carePlan.status === "draft" ? TableActions.Edit : TableActions.View
          }
        }));
      });
  }
}