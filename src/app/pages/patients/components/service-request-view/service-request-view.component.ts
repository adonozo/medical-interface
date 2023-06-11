import { Component, Input } from '@angular/core';
import { ServiceRequestView } from "../../../../@core/models/service-request-view";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-service-request-view',
  templateUrl: './service-request-view.component.html',
  styleUrls: ['./service-request-view.component.scss']
})
export class ServiceRequestViewComponent {

  @Input() serviceRequestView: ServiceRequestView;
  @Input() editButton: Boolean;
  @Input() disableEditButton: Boolean;
  @Input() editPageRoute: string;

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute
  ) {
  }

  navigateToEdit = async () => {
    await this.router.navigate([this.editPageRoute], {relativeTo: this.activatedRoute.parent})
  }
}
