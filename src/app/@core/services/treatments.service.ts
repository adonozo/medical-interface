import { Injectable } from '@angular/core';
import {RestApiService} from "./rest-api.service";
import {Observable} from "rxjs";
import {Bundle} from "fhir/r4";

@Injectable({
  providedIn: 'root'
})
export class TreatmentsService {

  constructor(private restService: RestApiService) { }

  public getTreatmentsFor(patientId: string) : Observable<Bundle> {
    return this.restService.get(`patients/${patientId}/carePlans/`);
  }
}
