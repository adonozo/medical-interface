import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatedResult } from "../../../@core/models/paginatedResult";

@Component({
  selector: 'app-pagination-footer',
  templateUrl: './pagination-footer.component.html',
  styleUrls: ['./pagination-footer.component.scss']
})
export class PaginationFooterComponent {
  @Input() results: PaginatedResult<any>;
  @Output() nextClicked = new EventEmitter<string>();

  nextResults(): void {
    this.nextClicked.next(this.results.lastDataCursor)
  }
}
