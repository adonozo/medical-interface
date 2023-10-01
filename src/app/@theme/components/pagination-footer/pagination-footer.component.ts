import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatedResult } from "../../../@core/models/paginatedResult";

@Component({
  selector: 'app-pagination-footer',
  templateUrl: './pagination-footer.component.html',
  styleUrls: ['./pagination-footer.component.scss']
})
export class PaginationFooterComponent {
  @Input() results: PaginatedResult<any> | undefined;
  @Output() nextClicked = new EventEmitter<string>();
  @Output() backClicked = new EventEmitter<string>();
  @Output() firstClicked = new EventEmitter<void>();

  cursorHistory: string[] = [];
  currentIndex = 0;

  nextResults(): void {
    this.currentIndex++;
    this.cursorHistory[this.currentIndex] = this.results?.lastDataCursor ?? '';
    this.nextClicked.next(this.results?.lastDataCursor ?? '')
  }

  previousResults(): void {
    this.currentIndex -= this.currentIndex > 0 ? 1 : 0;
    const previousCursor = this.cursorHistory[this.currentIndex];
    this.backClicked.next(previousCursor);
  }

  goToFirst(): void {
    this.currentIndex = 0;
    this.cursorHistory = [];
    this.firstClicked.emit();
  }
}
