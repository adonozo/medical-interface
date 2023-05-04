import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-medication-request-view',
  templateUrl: './medication-request-view.component.html',
  styleUrls: ['./medication-request-view.component.scss']
})
export class MedicationRequestViewComponent {

  @Input() editButton: Boolean;
  @Input() disableEditButton: Boolean;
  @Input() editPageRoute: string;
  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute
  ) { }

}
