import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Observation } from "fhir/r4";
import { RestApiService } from "./rest-api.service";
import { PaginatedResult } from "../models/paginatedResult";

@Injectable({
  providedIn: 'root'
})
export class ObservationsService {

  constructor(private restService: RestApiService) {
  }

  getObservations(patientId: string, limit: number = 0, lastCursor?: string): Observable<PaginatedResult<Observation>> {
    return this.restService.getPaginated(`patients/${patientId}/all/observations/`, limit, lastCursor);
  }

  updateObservation(observation: Observation): Observable<Observation> {
    return this.restService.put(`observations/${observation.id}`, observation);
  }
}
