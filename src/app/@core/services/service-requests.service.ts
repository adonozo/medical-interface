import { Injectable } from '@angular/core';
import { ServiceRequest } from "fhir/r4";
import { forkJoin, Observable } from "rxjs";
import { RestApiService } from "./rest-api.service";

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestsService {

  private readonly path = 'serviceRequests/';

  constructor(
    private restApiService: RestApiService
  ) {
  }

  getEmptyServiceRequest(): ServiceRequest {
    return {
      intent: "plan",
      resourceType: "ServiceRequest",
      status: "active",
      code: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "36048009",
            display: "Glucose measurement"
          }
        ]
      },
      subject: undefined
    };
  }

  createServiceRequests(carePlanId: string, requests: ServiceRequest[]): Observable<unknown[]> {
    // TODO create a container service request and put all requests in the Contained property
    return forkJoin(requests.map(request =>
      this.restApiService.put(`carePlans/${carePlanId}/${this.path}`, request)));
  }

  getServiceRequest(id: string): Observable<ServiceRequest> {
    return this.restApiService.get<ServiceRequest>(this.path + id);
  }

  deleteServiceRequest(carePlanId: string, serviceRequestId: string): Observable<void> {
    return this.restApiService.delete(`carePlans/${carePlanId}/${this.path}${serviceRequestId}`);
  }
}
