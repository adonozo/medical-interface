import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  private baseUrl = 'http://localhost:5001/';

  constructor(private http: HttpClient) { }

  get<T>(resource: string): Observable<T> {
    return this.http.get<T>(this.baseUrl + resource);
  }
}
