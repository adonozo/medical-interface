import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TableActionsService {

  callEdit = new Subject<{ id: string }>();
  callView = new Subject<{ id: string }>();

  editAction(id: string): void {
    this.callEdit.next({id});
  }

  viewAction(id: string): void {
    this.callView.next({id});
  }
}
