import { Component, OnInit } from '@angular/core';
import {TreatmentsService} from "../../../@core/services/treatments.service";
import {LocalDataSource} from "ng2-smart-table";
import {map} from "rxjs/operators";
import {Patient} from "../../../@core/models/patient";
import {FhirResource, MedicationRequest, ServiceRequest, Timing} from "fhir/r4";
import {flatMap} from "rxjs/internal/operators";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {PatientsService} from "../../../@core/services/patients.service";

@Component({
  selector: 'app-treatments',
  templateUrl: './treatments.component.html',
  styleUrls: ['./treatments.component.scss']
})
export class TreatmentsComponent implements OnInit {
  source: LocalDataSource;
  patient: Patient;

  settings = {
    columns: {
      type: {
        title: 'Type',
        type: 'string'
      },
      period: {
        title: 'Period',
        type: 'string'
      },
      time: {
        title: 'Time',
        type: 'string'
      },
      details: {
        title: 'Details',
        type: 'string'
      }
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
      columnTitle: 'Actions',
      custom: [
        {
          name: 'treatment-details',
          title: '<i class="nb-plus-circled inline-block width: 50px"></i>'
        },
        {
          name: 'records',
          title: '<i class="nb-list inline-block width: 50px"></i>',
        }
      ]
    }
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

  ngOnInit(): void {
  }

  public goBack(): void {
    this.location.back();
  }

  public navigate(page: string): void {
    switch (page) {
      case 'medication':
        this.router.navigate([this.patient.id + '/new-medication-request'], {relativeTo: this.activatedRoute.parent});
        break;
      case 'service':
        this.router.navigate([this.patient.id + '/new-service-request'], {relativeTo: this.activatedRoute.parent});
        return;
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
      type: 'Medication Order',
      period: timings.map(item => item.period).join('\n'),
      time: timings.map(item => item.time).join('\n'),
      details: `${resource.medicationReference.display} - ${dosage}`
    };
  }

  private getServiceRequestDetails(resource: ServiceRequest): object {
    return {
      resource,
      ...this.getPeriodAndTimeFromTiming(resource.occurrenceTiming),
      type: 'Blood glucose self-monitor order',
      details: resource.patientInstruction,
    }
  }

  private getPeriodAndTimeFromTiming(timing: Timing): {period: string, time: string } {
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
      time = timing.repeat.when.map(item => this.timingToString(item)).join(', ');
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
        return 'day(s)';
      case 'wk':
        return 'week(s)';
      case 'mo':
        return 'month(s)';
      default:
        return unit;
    }
  }

  private timingToString = (timing: string): string => {
    switch (timing) {
      case 'ACM':
        return 'before breakfast';
      case 'CM':
        return 'at breakfast';
      case 'PCM':
        return 'after breakfast';
      case 'ACD':
        return 'before lunch';
      case 'CD':
        return 'at lunch';
      case 'PCD':
        return 'after lunch';
      case 'ACV':
        return 'before dinner';
      case 'CV':
        return 'at dinner';
      case 'PCV':
        return 'after dinner';
      case 'AC':
        return 'before meal';
      case 'C':
        return 'with meal';
      case 'PC':
        return 'after meal';
      default:
        return timing;
    }
  }

  private frequencyToString = (frequency: number): string => {
    switch (frequency) {
      case 1:
        return 'once a day';
      case 2:
        return 'twice a day';
      case 3:
        return 'thrice a day';
      case 4:
        return 'four times a day';
      default:
        return '';
    }
  }
}
