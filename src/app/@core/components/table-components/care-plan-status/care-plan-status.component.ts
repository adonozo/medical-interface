import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from "ng2-smart-table";

@Component({
  selector: 'app-care-plan-status',
  templateUrl: './care-plan-status.component.html',
  styleUrls: ['./care-plan-status.component.scss']
})
export class CarePlanStatusComponent implements ViewCell, OnInit {

  @Input() rowData: any;
  @Input() value: string;

  statusColor: string;

  ngOnInit(): void {
    this.statusColor = this.getStatusColor();
  }

  getStatusColor():string {
    switch (this.value) {
      case 'draft':
        return 'text-warning';
      case 'active':
        return 'text-success';
      case 'revoked':
        return 'text-danger';
      default:
        return 'text-secondary';
    }
  }
}
