import { Directive } from "@angular/core";
import {
  CarePlan,
  MedicationRequest,
  Patient,
  Resource,
  ServiceRequest
} from "fhir/r4";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { CarePlanService } from "../../../@core/services/care-plan.service";
import { PatientsService } from "../../../@core/services/patients.service";
import { forkJoin, map, mergeMap } from "rxjs";
import { Location } from "@angular/common";
import { ResourceType } from "../../../@core/services/data/constants";
import { ServiceRequestView } from "../../../@core/models/service-request-view";
import { MedicationRequestView } from "../../../@core/models/medication-request-view";
import * as medicationRequestUtils from "../../../@core/services/utils/medication-request-utils";
import * as serviceRequestUtils from "../../../@core/services/utils/service-request-utils";
import { FormStatus } from "../../../@core/models/enums";
import { FormComponent } from "../../../@core/components/form.component";

@Directive()
export abstract class AbstractCarePlanViewComponent extends FormComponent {
  carePlanId: string | undefined;
  patientId: string | undefined;
  resources: Resource[] = [];
  patient: Patient | undefined;
  carePlan: CarePlan | undefined;
  serviceRequests: ServiceRequestView[] = [];
  medicationRequests: MedicationRequestView[] = [];

  protected constructor(
    protected location: Location,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected carePlanService: CarePlanService,
    protected patientService: PatientsService,
  ) {
    super();
    this.activatedRoute.paramMap.pipe(
      map((params: ParamMap) => {
        this.carePlanId = params.get("carePlanId") ?? '';
        this.patientId = params.get("patientId") ?? '';
        return {carePlanId: this.carePlanId, patientId: this.patientId};
      }),
      mergeMap(({patientId, carePlanId}: { patientId: string, carePlanId: string }) => {
        return forkJoin([
          this.carePlanService.getCarePlan(carePlanId),
          this.patientService.getSinglePatient(patientId),
          this.carePlanService.getDetailedCarePlan(carePlanId)
        ])
      })
    ).subscribe(([carePlan, patient, resources]) => {
      this.resources = resources.entry?.map(entry => entry.resource as Resource) ?? [];
      this.serviceRequests = this.serviceRequestViewFromResources(this.resources);
      this.medicationRequests = this.medicationRequestViewFromResources(this.resources);
      this.patient = patient;
      this.carePlan = carePlan;
    }, error => console.log(error));
  }

  disableButton = (): boolean => this.formStatus === FormStatus.loading || this.formStatus === FormStatus.success;

  goBack(): void {
    this.location.back();
  }

  submitForm() {
  }

  private serviceRequestViewFromResources(resources: Resource[]): ServiceRequestView[] {
    const serviceRequests = resources
      .filter(resource => resource.resourceType === ResourceType.ServiceRequest) as ServiceRequest[];
    return serviceRequests.map(serviceRequestUtils.mapToServiceRequestView);
  }

  private medicationRequestViewFromResources(resources: Resource[]): MedicationRequestView[] {
    const medicationRequests = resources
      .filter(resource => resource.resourceType === ResourceType.MedicationRequest) as MedicationRequest[]
    return medicationRequests.map(medicationRequestUtils.mapToMedicationRequestView);
  }
}
