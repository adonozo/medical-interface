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

  public getEmptyMedicationRequest(): MedicationRequest {
    return {
      intent: "order",
      resourceType: "MedicationRequest",
      status: "active",
      priority: "routine",
      subject: undefined
    }
  }

  public getSingleMedicationRequest(id: string): Observable<MedicationRequest> {
    return this.apiService.get<MedicationRequest>(this.path + id);
  }

  public createMedicationRequest(request: MedicationRequest): Observable<MedicationRequest> {
    return this.apiService.post(this.path, request);
  }
}
