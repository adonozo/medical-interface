import { Injectable } from '@angular/core';
import { RestApiService } from "./rest-api.service";
import { Observable } from "rxjs";
import { map} from "rxjs/operators";
import { Bundle, Patient } from "fhir/r4";
import { InternalPatient } from "../models/internalPatient";
import { ResourceUtils } from "./utils/resourceUtils";
import { Extensions, HttpHeaders } from "./data/constants";
import { PaginatedResult } from "../models/paginatedResult";
import { HttpResponse } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  private readonly path = 'patients/';

  constructor(private restService: RestApiService) {
  }

  getPatientsList(limit: number = 0, lastCursor?: string): Observable<PaginatedResult<Patient[]>> {
    return this.restService.get<HttpResponse<Bundle>>(this.path, {
      params: {
        limit: limit,
        after: lastCursor
      },
      observe: 'response' })
      .pipe(
        map(response => {
          const paginationLast = response.headers.get(HttpHeaders.PAGINATION_LAST);
          const remainingCount = +response.headers.get(HttpHeaders.REMAINING_COUNT);
          return ResourceUtils.getPaginatedResult(response.body, remainingCount, paginationLast);
        })
      );
  }

  getSinglePatient(id: string): Observable<Patient> {
    return this.restService.get<Patient>(this.path + id);
  }

  getInternalPatient(id: string): Observable<InternalPatient> {
    return this.restService.get<Patient>(this.path + id)
      .pipe(
        map(patient => PatientsService.toInternalPatient(patient))
      );
  }

  createPatient(patient: Patient): Observable<Patient> {
    return this.restService.post<Patient, Patient>(this.path, patient);
  }

  patchPatient(patient: InternalPatient): Observable<Patient> {
    return this.restService.patch<InternalPatient, Patient>(this.path + patient.id, patient);
  }

  static toInternalPatient(patient: Patient): InternalPatient {
    return {
      id: patient.id,
      email: ResourceUtils.getStringExtension(patient, Extensions.EMAIL),
      birthDate: new Date(patient.birthDate),
      gender: ResourceUtils.getPatientGender(patient),
      lastName: patient.name[0]?.family,
      firstName: patient.name[0]?.given?.join(' '),
      alexaUserId: ResourceUtils.getStringExtension(patient, Extensions.ALEXA_ID),
      phones: ResourceUtils.getPatientContacts(patient)
    };
  }
}
