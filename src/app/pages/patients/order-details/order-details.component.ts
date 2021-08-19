import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {MedicationRequest, ServiceRequest, TimingRepeat} from "fhir/r4";
import {flatMap} from "rxjs/internal/operators";
import {MedicationRequestsService} from "../../../@core/services/medication-requests.service";
import {ServiceRequestsService} from "../../../@core/services/service-requests.service";
import {timingToString} from "../../../@core/services/utils/utils";

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  type: string;
  config: {type: string, id: string};
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
          this.type = 'Medication order';
          return this.medicationRequestService.getSingleMedicationRequest(this.config.id);
        } else {
          this.type = 'Self-monitoring blood glucose order';
        } return this.serviceRequestService.getSingleServiceRequest(this.config.id);
      })
    ).subscribe(resource => {
      if (this.config.type === 'medication-order') {
        this.medicationOrder = resource as MedicationRequest;
      } else {
        this.serviceRequest = resource as ServiceRequest;
      }
    });
  }

  ngOnInit(): void {
  }

  public goBack(): void {
    this.location.back();
  }

  public getTimingText(occurrence: TimingRepeat): string {
    let duration = '';
    if (occurrence.boundsPeriod) {
      const start = new Date(occurrence.boundsPeriod.start).toLocaleDateString('en-gb');
      const end = new Date(occurrence.boundsPeriod.end).toLocaleDateString('en-gb');
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
    return `Duration: ${duration}
            Frequency: ${occurrence.frequency}
            Days of week: ${days}
            Times of day: ${timesOfDay}
            When: ${when}`;
  }
}
