import { Component, Input, OnInit } from '@angular/core';
import { CarePlan } from "fhir/r4";
import { TableActions } from "../../../../@core/components/table-components/resource-actions/table-actions";

@Component({
  selector: 'app-care-plans-table',
  templateUrl: './care-plans-table.component.html',
  styleUrls: ['./care-plans-table.component.scss']
})
export class CarePlansTableComponent implements OnInit {
  @Input() carePlans: CarePlan[];

  constructor() { }

  ngOnInit(): void {
  }

  carePlanTableAction = (status: string) => status === "draft" ? TableActions.Edit : TableActions.View;
}
