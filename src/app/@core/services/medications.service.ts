import { Injectable } from '@angular/core';
import {RestApiService} from "./rest-api.service";
import {Medication} from "fhir/r4";
import {from, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MedicationsService {
  private medications: Medication[] = [{
    "resourceType": "Medication",
    "id": "60fb0a79c055e8c0d3f853d0",
    "code": {
      "coding": [
        {
          "system": "http://hl7.org/fhir/sid/ndc",
          "code": "0169-7501-11",
          "display": "Novolog 100u/ml"
        }
      ]
    },
    "form": {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "385219001",
          "display": "Injection solution (qualifier value)"
        }
      ]
    },
  },{
    "resourceType": "Medication",
    "id": "60fb0a79c055e8c0d3f853a5",
    "code": {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "408050008",
          "display": "Ramipril 2.5mg tablets"
        }
      ]
    },
    "form": {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "385055001",
          "display": " Tablet"
        }
      ]
    },
  }];

  constructor(private restApiService: RestApiService) { }

  public getMedications(): Observable<Medication[]> {
    return from(new Promise<Medication[]>(resolve => resolve(this.medications)));
  }
}
