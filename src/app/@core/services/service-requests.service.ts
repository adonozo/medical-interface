import { Injectable } from '@angular/core';
import { Patient, ServiceRequest } from "fhir/r4";
import { forkJoin, Observable } from "rxjs";
import { RestApiService } from "./rest-api.service";
import { ResourceUtils } from "./utils/resourceUtils";

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestsService {

  private readonly path = 'serviceRequests/';

  constructor(
    private restApiService: RestApiService
  ) {
  }

  getBaseServiceRequest(patient: Patient): ServiceRequest {
    const request = this.generateEmptyServiceRequest();
    request.subject = {
      reference: ResourceUtils.getPatientReference(patient.id),
      display: patient.name[0]?.family
    }
    request.requester = {
      reference: 'Practitioner/60fb0a79c055e8c0d3f853d0',
      display: 'Dr. Steven'
    }

    return request;
  }

  generateEmptyServiceRequest(): ServiceRequest {
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

  createServiceRequests(carePlanId: string, request: ServiceRequest): Observable<void> {
    return this.restApiService.put(`carePlans/${carePlanId}/${this.path}`, request);
  }

  getServiceRequest(id: string): Observable<ServiceRequest> {
    return this.restApiService.get<ServiceRequest>(this.path + id);
  }

  updateServiceRequest(id: string, request: ServiceRequest): Observable<void> {
    return this.restApiService.put(this.path + id, request);
  }

  deleteServiceRequest(carePlanId: string, serviceRequestId: string): Observable<void> {
    return this.restApiService.delete(`carePlans/${carePlanId}/${this.path}${serviceRequestId}`);
  }
}
