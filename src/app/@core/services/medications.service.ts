import { Injectable } from '@angular/core';
import {RestApiService} from "./rest-api.service";
import {Bundle, Medication, Quantity} from "fhir/r4";
import {Observable} from "rxjs";
import {MedicationQuantities} from "./data/medication-quantities";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MedicationsService {
  private readonly path = 'medications/';

  constructor(private restService: RestApiService) { }

  public getMedications(): Observable<Medication[]> {
    return this.restService.get<Bundle>(this.path)
      .pipe(
        map(bundle => bundle.entry.map(entry => entry.resource as Medication))
      );
  }

  public getMedicationQuantities = (): Quantity[] => MedicationQuantities;
}
