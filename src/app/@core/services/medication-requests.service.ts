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

  createMedicationRequest(carePlanId: string, request: MedicationRequest): Observable<MedicationRequest> {
    return this.apiService.post(`carePlans/${carePlanId}/${this.path}`, request);
  }

  deleteMedicationRequest(carePlanId: string, medicationRequestId: string): Observable<void> {
    return this.apiService.delete(`carePlans/${carePlanId}/${this.path}${medicationRequestId}`);
  }

  updateMedicationRequest(id: string, request: MedicationRequest): Observable<void> {
    return this.apiService.put(this.path + id, request);
  }
}
