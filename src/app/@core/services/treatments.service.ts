import { Injectable } from '@angular/core';
import {RestApiService} from "./rest-api.service";

@Injectable({
  providedIn: 'root'
})
export class TreatmentsService {

  constructor(private restService: RestApiService) { }


}
