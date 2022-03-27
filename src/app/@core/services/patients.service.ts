import { Injectable } from '@angular/core';
import { RestApiService } from "./rest-api.service";
import { Observable } from "rxjs";
import { Patient } from "../models/patient";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  private readonly path = 'patients/';

  constructor(private restService: RestApiService) {
  }

  getPatientsList(): Observable<Patient[]> {
    return this.restService.get<Patient[]>(this.path)
      .pipe(
        map(patients => patients.map(PatientsService.mapPatientDate))
      );
  }

  getSinglePatient(id: string): Observable<Patient> {
    return this.restService.get<Patient>(this.path + id)
      .pipe(
        map(PatientsService.mapPatientDate)
      );
  }

  createPatient(patient: Patient): Observable<Patient> {
    return this.restService.post<Patient, Patient>(this.path, patient)
      .pipe(
        map(PatientsService.mapPatientDate)
      );
  }

  updatePatient(patient: Patient): Observable<Patient> {
    return this.restService.patch<Patient, Patient>(this.path + patient.id, patient)
      .pipe(
        map(PatientsService.mapPatientDate)
      );
  }

  private static mapPatientDate(patient: Patient): Patient {
    patient.birthDate = new Date(patient.birthDate);
    return patient;
  }
}
