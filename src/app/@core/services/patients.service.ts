import { Injectable } from '@angular/core';
import {RestApiService} from "./rest-api.service";
import {Observable} from "rxjs";
import {Patients} from "../models/patients";

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  constructor(private restService: RestApiService) { }

  getPatientList(): Observable<Patients> {
    return this.restService.get('patients');
  }
}
