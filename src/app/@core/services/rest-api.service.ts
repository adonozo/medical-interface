import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  private baseUrl = environment.apiUrl;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {
  }

  get<T>(resource: string): Observable<T> {
    return this.http.get<T>(this.baseUrl + resource);
  }

  post<T1, T2>(resource: string, body: T1): Observable<T2> {
    return this.http.post<T2>(this.baseUrl + resource, body, this.httpOptions);
  }
}
