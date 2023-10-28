import { Injectable } from '@angular/core';
import { RestApiService } from "./rest-api.service";
import { Medication, Quantity } from "fhir/r5";
import { Observable } from "rxjs";
import { MedicationQuantities } from "./data/medication-quantities";
import { PaginatedResult } from "../models/paginatedResult";

@Injectable({
  providedIn: 'root'
})
export class MedicationsService {
  private readonly path = 'medications/';

  constructor(private restService: RestApiService) {
  }

  searchMedications(limit: number = 0, lastCursor?: string, name?: string): Observable<PaginatedResult<Medication>> {
    return this.restService.getPaginated(this.path, limit, lastCursor, {name: name});
  }

  getMedication(id: string): Observable<Medication> {
    return this.restService.get<Medication>(this.path + id);
  }

  getMedicationQuantities = (): Quantity[] => MedicationQuantities;
}
