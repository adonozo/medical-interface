import { Component } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { MedicationRequest, ServiceRequest, TimingRepeat } from "fhir/r4";
import { flatMap } from "rxjs/internal/operators";
import { MedicationRequestsService } from "../../../@core/services/medication-requests.service";
import { ServiceRequestsService } from "../../../@core/services/service-requests.service";
import { timingToString } from "../../../@core/services/utils/utils";
import { OrderDetailsLocale } from "./order-details.locale";

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent {
  type: string;
  config: { type: string, id: string };
  medicationOrder: MedicationRequest;
  serviceRequest: ServiceRequest;

  constructor(
    private medicationRequestService: MedicationRequestsService,
    private serviceRequestService: ServiceRequestsService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.route.params.pipe(
      flatMap(params => {
        this.config = {type: params['order-type'], id: params['orderId']};
        if (this.config.type === 'medication-order') {
          this.type = OrderDetailsLocale.medicationOrder;
          return this.medicationRequestService.getSingleMedicationRequest(this.config.id);
        } else {
          this.type = OrderDetailsLocale.bloodGlucoseOrder;
        }
        return this.serviceRequestService.getSingleServiceRequest(this.config.id);
      })
    ).subscribe(resource => {
      if (this.config.type === 'medication-order') {
        this.medicationOrder = resource as MedicationRequest;
      } else {
        this.serviceRequest = resource as ServiceRequest;
      }
    });
  }

  public goBack(): void {
    this.location.back();
  }

  public getTimingText(occurrence: TimingRepeat): string {
    let duration = '';
    if (occurrence.boundsPeriod) {
      const start = new Date(occurrence.boundsPeriod.start).toLocaleDateString(OrderDetailsLocale.timeLocale);
      const end = new Date(occurrence.boundsPeriod.end).toLocaleDateString(OrderDetailsLocale.timeLocale);
      duration = `${start} - ${end}`;
    } else if (occurrence.boundsDuration) {
      duration = `${occurrence.boundsDuration.value} ${occurrence.boundsDuration.unit}`;
    }

    const timesOfDay = occurrence.timeOfDay && Array.isArray(occurrence.timeOfDay) ?
      occurrence.timeOfDay.join(', ') : '-';
    const when = occurrence.when && Array.isArray(occurrence.when) ?
      occurrence.when.map(item => timingToString(item)).join(', ') : '-';
    const days = occurrence.dayOfWeek && Array.isArray(occurrence.dayOfWeek) ?
      occurrence.dayOfWeek.join(', ') : '-';
    return `${OrderDetailsLocale.duration}: ${duration}
            ${OrderDetailsLocale.frequency}: ${occurrence.frequency}
            ${OrderDetailsLocale.daysOfWeek}: ${days}
            ${OrderDetailsLocale.timeOfDay}: ${timesOfDay}
            ${OrderDetailsLocale.when}: ${when}`;
  }
}
