import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Observation } from "fhir/r5";
import { RestApiService } from "./rest-api.service";
import { PaginatedResult } from "../models/paginatedResult";
import * as patientUtils from "./utils/patient-utils";

@Injectable({
  providedIn: 'root'
})
export class ObservationsService {

  constructor(private restService: RestApiService) {
  }

  getObservations(patientId: string, limit: number = 0, lastCursor?: string): Observable<PaginatedResult<Observation>> {
    return this.restService.getPaginated(`patients/${patientId}/observations/`, limit, lastCursor);
  }

  postObservation(observation: Observation): Observable<Observation> {
    return this.restService.post('observations', observation);
  }

  updateObservation(observation: Observation): Observable<Observation> {
    return this.restService.put(`observations/${observation.id}`, observation);
  }

  deleteObservation(id: string): Observable<void> {
    return this.restService.delete(`observations/${id}`);
  }

  getEmptyGlucoseObservation(patientId: string): Observation {
    const defaultDate = new Date();
    defaultDate.setHours(9, 0, 0);

    return {
      resourceType: "Observation",
      status: "final",
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: "15074-8",
            display: "Glucose [Moles/volume] in Blood"
          }
        ]
      },
      subject: {
        reference: patientUtils.getPatientReference(patientId),
      },
      issued: defaultDate.toISOString(),
      performer: [
        {
          reference: 'Practitioner/60fb0a79c055e8c0d3f853d0',
          display: 'Dr. Steven'
        }
      ],
      valueQuantity: {
        value: undefined,
        unit: "mmol/l",
        system: "http://unitsofmeasure.org",
        code: "mmol/L"
      },
      referenceRange: [
        {
          low: {
            value: 3.1,
            unit: "mmol/l",
            system: "http://unitsofmeasure.org",
            code: "mmol/L"
          },
          high: {
            value: 6.2,
            unit: "mmol/l",
            system: "http://unitsofmeasure.org",
            code: "mmol/L"
          }
        }
      ]
    };
  }
}
