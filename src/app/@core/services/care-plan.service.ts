import { Injectable } from '@angular/core';
import { RestApiService } from "./rest-api.service";
import { Observable } from "rxjs";
import { PaginatedResult } from "../models/paginatedResult";
import { Bundle, CarePlan } from "fhir/r4";
import { ResourceUtils } from "./utils/resourceUtils";

@Injectable({
  providedIn: 'root'
})
export class CarePlanService {
  private readonly path = 'carePlans/'

  constructor(private restService: RestApiService) {
  }

  getCarePlans(patientId: string, limit: number = 0, lastCursor?: string): Observable<PaginatedResult<CarePlan>> {
    return this.restService.getPaginated(`patients/${patientId}/carePlans`, limit, lastCursor);
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
        reference: ResourceUtils.getPatientReference(patientId),
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
}
