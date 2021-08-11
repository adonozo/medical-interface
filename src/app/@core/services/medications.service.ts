import { Injectable } from '@angular/core';
import {RestApiService} from "./rest-api.service";
import {Medication} from "fhir/r4";
import {from, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MedicationsService {
  private medications: Medication[] = [];

  constructor(private restApiService: RestApiService) { }

  public getMedications(): Observable<Medication[]> {
    return from(new Promise<Medication[]>(resolve => resolve(this.medications)));
  }
}
