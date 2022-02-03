import { Component } from '@angular/core';
import { TreatmentsService } from "../../../@core/services/treatments.service";
import { LocalDataSource } from "ng2-smart-table";
import { map } from "rxjs/operators";
import { Patient } from "../../../@core/models/patient";
import { FhirResource, MedicationRequest, ServiceRequest, Timing } from "fhir/r4";
import { flatMap } from "rxjs/internal/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { PatientsService } from "../../../@core/services/patients.service";
import { timingToString } from "../../../@core/services/utils/utils";
import { TreatmentsLocale } from "./treatments.locale";

@Component({
  selector: 'app-treatments',
  templateUrl: './treatments.component.html',
  styleUrls: ['./treatments.component.scss']
})
export class TreatmentsComponent {
  source: LocalDataSource;
  patient: Patient;

  settings = {
    columns: {
      type: {
        title: TreatmentsLocale.columnType,
        type: 'string'
      },
      period: {
        title: TreatmentsLocale.columnPeriod,
        type: 'string'
      },
      time: {
        title: TreatmentsLocale.columnTime,
        type: 'string'
      },
      details: {
        title: TreatmentsLocale.columnDetails,
        type: 'string'
      }
    },
    actions: false
  }

  constructor(
    private patientService: PatientsService,
    private treatmentService: TreatmentsService,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.route.params.pipe(
      flatMap(params => patientService.getSinglePatient(params["patientId"]))
    ).subscribe(patient => {
      this.patient = patient;
      this.getAllCarePlans();
    });
  }

  public goBack(): void {
    this.location.back();
  }

  public async navigate(page: string): Promise<void> {
    switch (page) {
      case 'medication':
        await this.router.navigate([this.patient.id + '/new-medication-request'], {relativeTo: this.activatedRoute.parent});
        break;
      case 'service':
        await this.router.navigate([this.patient.id + '/new-service-request'], {relativeTo: this.activatedRoute.parent});
        return;
    }
  }

  public async viewOrder(event: any): Promise<void> {
    const resource: FhirResource = event.data.resource;
    switch (resource.resourceType) {
      case "MedicationRequest":
        await this.router.navigate([this.patient.id + '/medication-order/' + resource.id], {relativeTo: this.activatedRoute.parent});
        break;
      case "ServiceRequest":
        await this.router.navigate([this.patient.id + '/service-order/' + resource.id], {relativeTo: this.activatedRoute.parent});
        break;
    }
  }

  private getAllCarePlans(): void {
    this.treatmentService.getTreatmentsFor(this.patient.id)
      .pipe(
        map(bundle => bundle.entry.map(entry => entry.resource))
      )
      .subscribe(resources => {
        this.source = new LocalDataSource(resources.map(resource => this.addDataToResource(resource)))
      })
  }

  private addDataToResource(resource: FhirResource): object {
    switch (resource.resourceType) {
      case 'MedicationRequest':
        return this.getMedicationRequestDetails(resource);
      case 'ServiceRequest':
        return this.getServiceRequestDetails(resource);
      default:
        return {
          type: '',
          period: '',
          time: '',
          details: ''
        };
    }
  }

  private getMedicationRequestDetails(resource: MedicationRequest): object {
    const dosage = resource.dosageInstruction
      .map(dose => `${dose.doseAndRate[0].doseQuantity.value} ${dose.doseAndRate[0].doseQuantity.unit}`)
      .join('\n')
    const timings = resource.dosageInstruction.map(dose => this.getPeriodAndTimeFromTiming(dose.timing));
    return {
      resource,
      type: TreatmentsLocale.medicationOrder,
      period: timings.map(item => item.period).join('\n'),
      time: timings.map(item => item.time).join('\n'),
      details: `${resource.medicationReference.display} - ${dosage}`
    };
  }

  private getServiceRequestDetails(resource: ServiceRequest): object {
    return {
      resource,
      ...this.getPeriodAndTimeFromTiming(resource.occurrenceTiming),
      type: TreatmentsLocale.bloodGlucose,
      details: resource.patientInstruction,
    }
  }

  private getPeriodAndTimeFromTiming(timing: Timing): { period: string, time: string } {
    let period = '';
    let time = '';

    if (timing.repeat.boundsDuration) {
      period = `${timing.repeat.boundsDuration.value} ${this.dayUnitFromCode(timing.repeat.boundsDuration.unit)}`
    } else if (timing.repeat.boundsPeriod) {
      const start = new Date(timing.repeat.boundsPeriod.start).toLocaleDateString('en-gb');
      const end = new Date(timing.repeat.boundsPeriod.end).toLocaleDateString('en-gb');
      period = `${start} - ${end}`
    }

    if (timing.repeat.when) {
      time = timing.repeat.when.map(item => timingToString(item)).join(', ');
    } else if (timing.repeat.timeOfDay) {
      time = timing.repeat.timeOfDay.join(', ');
    } else if (timing.repeat.frequency > 0) {
      time = this.frequencyToString(timing.repeat.frequency);
    }

    return {period, time};
  }

  private dayUnitFromCode = (unit: string): string => {
    switch (unit) {
      case 'd':
        return TreatmentsLocale.days;
      case 'wk':
        return TreatmentsLocale.week;
      case 'mo':
        return TreatmentsLocale.month;
      default:
        return unit;
    }
  }

  private frequencyToString = (frequency: number): string => {
    switch (frequency) {
      case 1:
        return TreatmentsLocale.onceADay;
      case 2:
        return TreatmentsLocale.twiceADay;
      case 3:
        return TreatmentsLocale.thriceADay;
      case 4:
        return TreatmentsLocale.fourTimesADay;
      default:
        return '';
    }
  }
}
