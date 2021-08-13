import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Bundle, Observation} from "fhir/r4";
import {RestApiService} from "./rest-api.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ObservationsService {

  constructor(private restService: RestApiService) { }

  getObservations(id: string): Observable<Observation[]> {
    return this.restService.get<Bundle>(`patients/${id}/all/observations/`)
      .pipe(map(bundle => bundle.entry.map(entry => entry.resource as Observation)));
  }
}
