import { Directive } from "@angular/core";
import {
  CarePlan,
  MedicationRequest,
  Patient,
  Resource,
  ServiceRequest
} from "fhir/r4";
import { ActivatedRoute, Router } from "@angular/router";
import { CarePlanService } from "../../../@core/services/care-plan.service";
import { PatientsService } from "../../../@core/services/patients.service";
import { flatMap, map } from "rxjs/internal/operators";
import { forkJoin } from "rxjs";
import { Location } from "@angular/common";
import { ResourceType } from "../../../@core/services/data/constants";
import { ResourceUtils } from "../../../@core/services/utils/resourceUtils";
import { ServiceRequestView } from "../../../@core/models/service-request-view";
import { MedicationRequestView } from "../../../@core/models/medication-request-view";

@Directive()
export abstract class AbstractCarePlanViewComponent {

  carePlanId: string;
  patientId: string;
  resources: Resource[];
  patient: Patient;
  carePlan: CarePlan;
  serviceRequests: ServiceRequestView[];
  medicationRequests: MedicationRequestView[];

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
      this.serviceRequests = this.serviceRequestViewFromResources(this.resources);
      this.medicationRequests = this.medicationRequestViewFromResources(this.resources);
      this.patient = patient;
      this.carePlan = carePlan;
    }, error => console.log(error));
  }

  goBack(): void {
    this.location.back();
  }

  private serviceRequestViewFromResources(resources: Resource[]): ServiceRequestView[] {
    const serviceRequests = resources
      .filter(resource => resource.resourceType === ResourceType.ServiceRequest) as ServiceRequest[];
    return serviceRequests.map(ResourceUtils.mapToServiceRequestView);
  }

  private medicationRequestViewFromResources(resources: Resource[]): MedicationRequestView[] {
    const medicationRequests = resources
      .filter(resource => resource.resourceType === ResourceType.MedicationRequest) as MedicationRequest[]
    return medicationRequests.map(ResourceUtils.mapToMedicationRequestView);
  }
}
