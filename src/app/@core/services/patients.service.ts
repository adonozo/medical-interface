import { Injectable } from '@angular/core';
import {RestApiService} from "./rest-api.service";
import {Observable} from "rxjs";
import {Patient} from "../models/patient";

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  private readonly path = 'patients/';

  constructor(private restService: RestApiService) { }

  getPatientList(): Observable<Patient[]> {
    return this.restService.get(this.path);
  }

  getSinglePatient(id: string): Observable<Patient> {
    return this.restService.get(this.path + id);
  }
}
