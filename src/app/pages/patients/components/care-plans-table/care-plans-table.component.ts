import { Component, Input } from '@angular/core';
import { CarePlan } from "fhir/r5";
import { TableAction } from "../../../../@core/components/table-components/resource-actions/table-action";

@Component({
  selector: 'app-care-plans-table',
  templateUrl: './care-plans-table.component.html',
  styleUrls: ['./care-plans-table.component.scss']
})
export class CarePlansTableComponent {
  @Input() carePlans: CarePlan[] = [];

  constructor() { }

  carePlanTableAction = (status: string) => status === "draft" ? TableAction.Edit : TableAction.View;
}
