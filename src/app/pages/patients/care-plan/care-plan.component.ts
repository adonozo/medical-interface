import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { CarePlanService } from "../../../@core/services/care-plan.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PaginatedResult } from "../../../@core/models/paginatedResult";
import { CarePlan } from "fhir/r4";
import { TableActionsService } from "../../../@core/components/table-components/resource-actions/table-actions.service";
import { Subject } from "rxjs";
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

  paginatedCarePlans: PaginatedResult<CarePlan>;

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
      this.getCarePlansData(this.defaultLimit);
    });
  }

  ngOnDestroy() {
    this.unSubscriber.next();
    this.unSubscriber.complete();
  }

  getCarePlans(lastCursor?: string): void {
    this.getCarePlansData(this.defaultLimit, lastCursor);
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

  private getCarePlansData(limit: number, lastCursor?: string): void {
    this.carePlanService.getCarePlans(this.patientId, limit, lastCursor)
      .subscribe(carePlans => {
        this.paginatedCarePlans = carePlans;
      });
  }
}
