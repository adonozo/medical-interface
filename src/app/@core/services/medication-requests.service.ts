import { Injectable } from '@angular/core';
import { MedicationRequest } from "fhir/r4";
import { RestApiService } from "./rest-api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MedicationRequestsService {
  private readonly path = 'medicationRequests/'

  constructor(private apiService: RestApiService) {
  }

  getEmptyMedicationRequest(): MedicationRequest {
    return {
      intent: "order",
      resourceType: "MedicationRequest",
      status: "active",
      priority: "routine",
      subject: undefined
    }
  }

  getSingleMedicationRequest(id: string): Observable<MedicationRequest> {
    return this.apiService.get<MedicationRequest>(this.path + id);
  }

  createMedicationRequest(carePlanId: string ,request: MedicationRequest): Observable<MedicationRequest> {
    return this.apiService.put(`carePlans/${carePlanId}/${this.path}`, request);
  }
}
