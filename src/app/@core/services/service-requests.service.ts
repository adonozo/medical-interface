import { Injectable } from '@angular/core';
import {ServiceRequest} from "fhir/r4";
import {forkJoin, Observable} from "rxjs";
import {RestApiService} from "./rest-api.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestsService {

  private readonly path = 'serviceRequests/';

  constructor(
    private restApiService: RestApiService
  ) { }

  public getEmptyServiceRequest(): ServiceRequest {
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

  public createServiceRequests(requests: ServiceRequest[]): Observable<string[]> {
    return forkJoin(requests.map(request => this.restApiService.post<ServiceRequest, ServiceRequest>(this.path, request)))
      .pipe(map(requests => requests.map(request => request.id)));
  }
}
