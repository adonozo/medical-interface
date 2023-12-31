import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { MedicationRequestView } from "../../../../@core/models/medication-request-view";

@Component({
  selector: 'app-medication-request-view',
  templateUrl: './medication-request-view.component.html',
  styleUrls: ['./medication-request-view.component.scss']
})
export class MedicationRequestViewComponent {

  @Input() editButton: boolean | undefined;
  @Input() disableEditButton: boolean | undefined;
  @Input() editPageRoute: string = '';
  @Input() medicationRequestView: MedicationRequestView | undefined;

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute
  ) { }

  navigateToEdit = async () => {
    await this.router.navigate([this.editPageRoute], {relativeTo: this.activatedRoute.parent})
  }
}
