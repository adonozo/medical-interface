import { Component, Input } from '@angular/core';
import { ServiceRequestView } from "../../../../@core/models/service-request-view";
import { DayCode } from "../../../../@core/models/types";
import * as utils from "../../../../@core/services/utils/utils";
import { timingToString } from "../../../../@core/services/utils/utils";
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

  dayStringFromCode = (dayCode: DayCode): string => utils.dayStringFromCode(dayCode);

  whenArrayToString = (when: string[]): string => when
    .map(whenCode => timingToString(whenCode))
    .join(', ');

  navigateToEdit = async () => {
    await this.router.navigate([this.editPageRoute], {relativeTo: this.activatedRoute.parent})
  }
}
