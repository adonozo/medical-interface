import { Injectable } from '@angular/core';
import {RestApiService} from "./rest-api.service";
import {from, Observable} from "rxjs";
import {Treatment} from "../models/treatment";

@Injectable({
  providedIn: 'root'
})
export class TreatmentsService {

  constructor(private restService: RestApiService) { }

  getTreatmentsForPatient(): Observable<Treatment[]> {
    const treatments: Treatment[] = [
      {
        id: '1234',
        medication: {
          resourceType: 'Medication',
          status: 'active',
          code: {
            coding: [
              {
                system: 'http://snomed.info/sct',
                code: '12086701000001103',
                display: 'Invokana (product)'
              }
            ]
          }
        },
        dosage: {
          id: '1234',
        },
        date: new Date('2021-07-01')
      },
      {
        id: '1233',
        medication: {
          resourceType: 'Medication',
          status: 'active',
          code: {
            coding: [
              {
                system: 'http://snomed.info/sct',
                code: '384978002',
                display: 'Glyburide'
              }
            ]
          }
        },
        dosage: {
          id: '1233'
        },
        date: new Date('2021-06-01')
      }
    ];
    return from(new Promise<Treatment[]>(resolve => resolve(treatments)));
  }
}
