import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  private baseUrl = 'http://localhost:5000/';

  constructor(private http: HttpClient) { }

  get<T>(resource: string): Observable<T> {
    return this.http.get<T>(this.baseUrl + resource);
  }

  post<T1, T2>(resource: string, body:T1): Observable<T2> {
    return this.http.post<T2>(this.baseUrl + resource, body);
  }
}
