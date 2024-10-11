import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';

import { MainService } from '../services/main.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  /**
   *
   */
  constructor(private mainServ: MainService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
        catchError(( err: any) => {
            if(err.status == 403 && err.code === 'E_INVALID_TOKEN'){
                this.mainServ.logout()
            }
            throw err
        })
    )
  }
}
