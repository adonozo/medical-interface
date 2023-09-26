import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-care-plan-status',
  templateUrl: './care-plan-status.component.html',
  styleUrls: ['./care-plan-status.component.scss']
})
export class CarePlanStatusComponent implements OnInit {

  @Input() status: string;

  statusColor: string;

  ngOnInit(): void {
    this.statusColor = this.getStatusColor();
  }

  getStatusColor():string {
    switch (this.status) {
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
