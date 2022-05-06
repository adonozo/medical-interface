import { Injectable } from '@angular/core';
import { RestApiService } from "./rest-api.service";
import { Observable } from "rxjs";
import { Bundle, FhirResource } from "fhir/r4";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TreatmentsService {

  constructor(private restService: RestApiService) {
  }

  getTreatmentsFor(patientId: string): Observable<FhirResource[]> {
    return this.restService.get<Bundle>(`patients/${patientId}/carePlans/`)
      .pipe(
        map(bundle  => {
          if (!bundle.entry) {
            return [];
          }

          return bundle.entry.map(entry => entry.resource);
        })
      );
  }
}
