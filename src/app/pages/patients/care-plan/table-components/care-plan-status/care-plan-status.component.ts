import { Component, OnInit } from '@angular/core';
import { ViewCell } from "ng2-smart-table";

@Component({
  selector: 'app-care-plan-status',
  templateUrl: './care-plan-status.component.html',
  styleUrls: ['./care-plan-status.component.scss']
})
export class CarePlanStatusComponent implements ViewCell, OnInit {

  rowData: any;
  value: string;
  statusColor: string;

  constructor() { }

  getStatusColor():string {
    switch (this.value) {
      case 'draft':
        return 'text-warning';
      case 'active':
        return 'text-success';
      default:
        return 'text-secondary'
    }
  }

  ngOnInit(): void {
    this.statusColor = this.getStatusColor();
  }
}
