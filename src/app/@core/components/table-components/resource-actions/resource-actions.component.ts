import { Component, Input } from '@angular/core';
import { TableActionsService } from "./table-actions.service";
import { TableAction } from "./table-action";

@Component({
  selector: 'app-resource-actions',
  templateUrl: './resource-actions.component.html',
  styleUrls: ['./resource-actions.component.scss']
})
export class ResourceActionsComponent {
  @Input() id: string;
  @Input() action: TableAction;
  tableAction = TableAction;

  constructor(private actionsService: TableActionsService) { }

  moveToEdit(): void {
    this.actionsService.editAction(this.id);
  }

  moveToView(): void {
    this.actionsService.viewAction(this.id);
  }
}
