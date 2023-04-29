import { Directive } from "@angular/core";
import {
  CarePlan,
  Dosage,
  Medication,
  MedicationRequest,
  Patient,
  Resource,
  ServiceRequest,
  TimingRepeat
} from "fhir/r4";
import { ActivatedRoute, Router } from "@angular/router";
import { CarePlanService } from "../../../@core/services/care-plan.service";
import { PatientsService } from "../../../@core/services/patients.service";
import { flatMap, map } from "rxjs/internal/operators";
import { forkJoin } from "rxjs";
import { Location } from "@angular/common";
import * as utils from "../../../@core/services/utils/utils";
import { ResourceType } from "../../../@core/services/data/constants";
import { ResourceUtils } from "../../../@core/services/utils/resourceUtils";
import {
  dailyFrequencyString,
  dayStringFromCode,
  sortDayCodes,
  timingToString
} from "../../../@core/services/utils/utils";

@Directive()
export abstract class AbstractCarePlanViewComponent {

  carePlanId: string;
  patientId: string;
  resources: Resource[];
  patient: Patient;
  carePlan: CarePlan;

  protected constructor(
    protected location: Location,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected carePlanService: CarePlanService,
    protected patientService: PatientsService,
  ) {
    this.activatedRoute.params.pipe(
      map(params => {
        this.carePlanId = params["carePlanId"];
        this.patientId = params["patientId"];
        return {carePlanId: this.carePlanId, patientId: this.patientId}
      }),
      flatMap(({patientId, carePlanId}) => {
        return forkJoin({
          carePlan: this.carePlanService.getCarePlan(carePlanId),
          patient: this.patientService.getSinglePatient(patientId),
          resources: this.carePlanService.getDetailedCarePlan(carePlanId),
        })
      })
    ).subscribe(({carePlan, patient, resources}) => {
      this.resources = resources.entry?.map(entry => entry.resource) ?? [];
      this.patient = patient;
      this.carePlan = carePlan;
    }, error => console.log(error));
  }

  get medicationRequests(): MedicationRequest[] {
    return this.resources.filter(resource => resource.resourceType === ResourceType.MedicationRequest) as MedicationRequest[];
  }

  get serviceRequests(): ServiceRequest[] {
    return this.resources.filter(resource => resource.resourceType === ResourceType.ServiceRequest) as ServiceRequest[];
  }

  getTimingStringDuration = (repeat: TimingRepeat): string =>
    utils.getTimingStringDuration(repeat);

  getServiceRequestDays = (serviceRequest: ServiceRequest): string =>
    utils.getServiceRequestDays(serviceRequest);

  getMedicationName(medicationRequest: MedicationRequest): string {
    if (!medicationRequest.contained || medicationRequest.contained.length === 0) {
      return '';
    }

    const medication = medicationRequest.contained[0] as Medication;
    return medication.code.coding[0].display;
  }

  getDoseText(dosage: Dosage): string {
    if (!dosage.doseAndRate || dosage.doseAndRate.length === 0) {
      return '';
    }

    const dosageQuantity = dosage.doseAndRate[0].doseQuantity;
    return ResourceUtils.getDosageText(dosageQuantity);
  }

  getWhenToTakeText(timingRepeat: TimingRepeat): string {
    if (timingRepeat.dayOfWeek && Array.isArray(timingRepeat.dayOfWeek)) {
      return timingRepeat.dayOfWeek
        .sort(sortDayCodes)
        .map(day => dayStringFromCode(day))
        .join(' - ');
    }

    return $localize`Every day`;
  }

  getFrequencyText(timingRepeat: TimingRepeat): string {
    if (timingRepeat.when && Array.isArray(timingRepeat.when)) {
      return timingRepeat.when
        .map(whenCode => timingToString(whenCode))
        .join(', ');
    }

    if (timingRepeat.timeOfDay && Array.isArray(timingRepeat.timeOfDay)) {
      return timingRepeat.timeOfDay.join(', ');
    }

    return dailyFrequencyString(timingRepeat.frequency);
  }

  goBack(): void {
    this.location.back();
  }
}
