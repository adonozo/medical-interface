import { Injectable } from '@angular/core';
import { RestApiService } from "./rest-api.service";
import { Observable } from "rxjs";
import { PaginatedResult } from "../models/paginatedResult";
import { Bundle, CarePlan } from "fhir/r5";
import * as patientUtils from "./utils/patient-utils";

@Injectable({
  providedIn: 'root'
})
export class CarePlanService {
  private readonly path = 'care-plans/'

  constructor(private restService: RestApiService) {
  }

  getCarePlans(patientId: string, limit: number = 0, lastCursor?: string): Observable<PaginatedResult<CarePlan>> {
    return this.restService.getPaginated(`patients/${patientId}/care-plans`, limit, lastCursor);
  }

  getCarePlan(id: string): Observable<CarePlan> {
    return this.restService.get(this.path + id);
  }

  getDetailedCarePlan(id: string): Observable<Bundle> {
    return this.restService.get(this.path + id + '/details');
  }

  createCarePlan(patientId: string): Observable<CarePlan> {
    const carePlan: CarePlan = {
      resourceType: 'CarePlan',
      intent: 'plan',
      status: 'draft',
      subject: {
        reference: patientUtils.getPatientReference(patientId),
      }
    }
    return this.restService.post(this.path, carePlan);
  }

  deleteCarePlan(id: string): Observable<void> {
    return this.restService.delete(this.path + id);
  }

  activateCarePlan(id: string): Observable<void> {
    return this.restService.put(this.path + id + '/activate', {});
  }

  revokeCarePlan(id?: string): Observable<void> {
    return this.restService.put(this.path + id + '/revoke', {});
  }
}
