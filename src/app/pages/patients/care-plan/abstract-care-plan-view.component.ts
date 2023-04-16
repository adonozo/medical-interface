import { Directive } from "@angular/core";
import { CarePlan, Patient, Resource } from "fhir/r4";
import { ActivatedRoute, Router } from "@angular/router";
import { CarePlanService } from "../../../@core/services/care-plan.service";
import { PatientsService } from "../../../@core/services/patients.service";
import { flatMap, map } from "rxjs/internal/operators";
import { forkJoin } from "rxjs";
import { Location } from "@angular/common";

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

  goBack(): void {
    this.location.back();
  }
}
