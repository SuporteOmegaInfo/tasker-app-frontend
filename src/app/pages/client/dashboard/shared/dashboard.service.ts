import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService{

  protected http: HttpClient;

  /**
   *
   */
  constructor(
    protected injector: Injector
  ) {this.http = injector.get(HttpClient);}

  protected readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  /**
   *
   * @param filters
   * @returns
   */
  public dashboard(filters?: any): Observable<any> {
    // const filter = this.mountFilters(filters);
    //console.log(filter)

    return this.http
      .get(`${environment.apiUrl}/admin/dashboard`, this.httpOptions)
      .pipe(
        map(x => x),
        catchError(this.handleError)
      );
  }

  /**
   *
   * @param error
   * @returns
   */
  protected handleError(error: any): Observable<any> {
    //console.log("Erro na Requisição =>", error)
    return throwError(error);
  }
}
