import { Injectable } from '@angular/core';
import { RestApiService } from "./rest-api.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Patient } from "fhir/r5";
import { InternalPatient } from "../models/internalPatient";
import { PaginatedResult } from "../models/paginatedResult";
import * as patientUtils from "./utils/patient-utils";

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  private readonly path = 'patients/';

  constructor(private restService: RestApiService) {
  }

  getPatientsList(limit: number = 0, lastCursor?: string): Observable<PaginatedResult<Patient>> {
    return this.restService.getPaginated(this.path, limit, lastCursor);
  }

  getSinglePatient(id: string): Observable<Patient> {
    return this.restService.get<Patient>(this.path + id);
  }

  getInternalPatient(id: string): Observable<InternalPatient> {
    return this.restService.get<Patient>(this.path + id)
      .pipe(
        map(patientUtils.toInternalPatient)
      );
  }

  createPatient(patient: Patient): Observable<Patient> {
    return this.restService.post<Patient, Patient>(this.path, patient);
  }

  patchPatient(patient: InternalPatient): Observable<Patient> {
    return this.restService.patch<InternalPatient, Patient>(this.path + patient.id, patient);
  }
}
