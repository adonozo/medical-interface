import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { PaginatedResult } from "../models/paginatedResult";
import { map } from "rxjs/operators";
import { Bundle } from "fhir/r5";
import { Headers } from "./data/constants";
import * as resourceUtils from "./utils/resource-utils";

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

  get<T>(resource: string, options?: {}): Observable<T> {
    return this.http.get<T>(this.baseUrl + resource, options);
  }

  getPaginated(resource: string, limit: number = 0, lastCursor?: string, params?: {}): Observable<PaginatedResult<any>> {
    return this.http.get<Bundle>(this.baseUrl + resource, {
      params: {
        limit: limit,
        after: lastCursor ?? '',
        ...params
      },
      observe: 'response'
    })
      .pipe(
        map(response => {
          const paginationLast = response.headers.get(Headers.PAGINATION_LAST);
          const remainingCount = response.headers.get(Headers.REMAINING_COUNT) ?? 0;
          return resourceUtils.getPaginatedResult(response.body, +remainingCount, paginationLast);
        })
      );
  }

  post<T1, T2>(resource: string, body: T1): Observable<T2> {
    return this.http.post<T2>(this.baseUrl + resource, body, this.httpOptions);
  }

  put<T1, T2>(resource: string, body: T1): Observable<T2> {
    return this.http.put<T2>(this.baseUrl + resource, body, this.httpOptions);
  }

  patch<T1, T2>(resource: string, body: T1): Observable<T2> {
    return this.http.patch<T2>(this.baseUrl + resource, body, this.httpOptions);
  }

  delete(resource: string): Observable<void> {
    return this.http.delete<void>(this.baseUrl + resource);
  }
}
