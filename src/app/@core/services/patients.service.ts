import { Injectable } from '@angular/core';
import {RestApiService} from "./rest-api.service";
import {from, Observable} from "rxjs";
import {Patient} from "../models/patient";

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  constructor(private restService: RestApiService) { }

  getPatientList(): Observable<Patient[]> {
    // return this.restService.get('patients');
    const testData: Patient[] = [
      {
        id: '12345',
        name: 'John Doe',
        email: 'jdoe@mail.com'
      },
      {
        id: '12346',
        name: 'Josh Walker',
        email: 'jwalker@mail.com'
      }
    ]
    return from(new Promise<Patient[]>(resolve => resolve(testData)));
  }
}
