import { Directive } from "@angular/core";
import { CarePlan, Medication, MedicationRequest, Patient, Resource, ServiceRequest, TimingRepeat } from "fhir/r4";
import { ActivatedRoute, Router } from "@angular/router";
import { CarePlanService } from "../../../@core/services/care-plan.service";
import { PatientsService } from "../../../@core/services/patients.service";
import { flatMap, map } from "rxjs/internal/operators";
import { forkJoin } from "rxjs";
import { Location } from "@angular/common";
import * as utils from "../../../@core/services/utils/utils";

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
    return this.resources.filter(resource => resource.resourceType === "MedicationRequest") as MedicationRequest[];
  }

  get serviceRequests(): ServiceRequest[] {
    return this.resources.filter(resource => resource.resourceType === "ServiceRequest") as ServiceRequest[];
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

  goBack(): void {
    this.location.back();
  }
}
