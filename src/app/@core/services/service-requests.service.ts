import { Injectable } from '@angular/core';
import { Patient, ServiceRequest } from "fhir/r4";
import { Observable } from "rxjs";
import { RestApiService } from "./rest-api.service";
import * as patientUtils from "./utils/patient-utils";

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestsService {

  private readonly path = 'service-requests/';

  constructor(
    private restApiService: RestApiService
  ) {
  }

  getBaseServiceRequest(patient: Patient): ServiceRequest {
    const request = this.generateEmptyServiceRequest();
    request.subject = {
      reference: patientUtils.getPatientReference(patient.id ?? ''),
      display: patient.name ? patient.name[0].family : ''
    }
    request.requester = {
      reference: 'Practitioner/60fb0a79c055e8c0d3f853d0',
      display: 'Dr. Steven'
    }

    return request;
  }

  createServiceRequests(carePlanId: string, request: ServiceRequest): Observable<void> {
    return this.restApiService.post(`care-plans/${carePlanId}/${this.path}`, request);
  }

  getServiceRequest(id: string): Observable<ServiceRequest> {
    return this.restApiService.get<ServiceRequest>(this.path + id);
  }

  updateServiceRequest(id: string, request: ServiceRequest): Observable<void> {
    return this.restApiService.put(this.path + id, request);
  }

  deleteServiceRequest(carePlanId: string, serviceRequestId: string): Observable<void> {
    return this.restApiService.delete(`care-plans/${carePlanId}/${this.path}${serviceRequestId}`);
  }

  private generateEmptyServiceRequest(): ServiceRequest {
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
      subject: {}
    };
  }
}
