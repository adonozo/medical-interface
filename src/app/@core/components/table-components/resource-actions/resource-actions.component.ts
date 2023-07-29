import { Component, Input } from '@angular/core';
import { ViewCell } from "ng2-smart-table";
import { TableActionsService } from "./table-actions.service";
import { TableActions } from "./table-actions";

@Component({
  selector: 'app-resource-actions',
  templateUrl: './resource-actions.component.html',
  styleUrls: ['./resource-actions.component.scss']
})
export class ResourceActionsComponent implements ViewCell {
  @Input() rowData: any;
  @Input() value: TableActions;
  tableActions = TableActions;

  constructor(private actionsService: TableActionsService) { }

  moveToEdit(): void {
    this.actionsService.editAction(this.rowData.id);
  }

  moveToView(): void {
    this.actionsService.viewAction(this.rowData.id);
  }
}