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
        intent: 'plan',
        subject: {
          id: '12344',
          display: 'John Doe'
        },
        period: {
          start: '2021-07-01',
          end: '2021-08-01'
        },
        resourceType: 'CarePlan',
        created: '2021-07-01',
        contained: [
          {
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
          }
        ],
        status: 'active',
        activity: [
          {
            detail: {
              kind: 'MedicationRequest',
              status: 'scheduled'
            },
          }
        ],
      },
      {
        id: '1233',
        intent: 'plan',
        subject: {
          id: '12344',
          display: 'John Doe'
        },
        period: {
          start: '2021-06-01',
          end: '2021-06-30'
        },
        resourceType: 'CarePlan',
        created: '2021-06-01',
        contained: [
          {
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
          }
        ],
        status: 'completed',
        activity: [
          {
            detail: {
              kind: 'MedicationRequest',
              status: 'completed'
            },
          }
        ],
      }
    ];
    return from(new Promise<Treatment[]>(resolve => resolve(treatments)));
  }
}
