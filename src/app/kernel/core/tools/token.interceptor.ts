import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MainService } from '../services/main.service';
import { AuthService } from '../../../pages/auth/shared/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(
        private mainserv: MainService,
        private authserv: AuthService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let token = this.mainserv?.currentSession?.token?.token

        if((request.url.indexOf(environment.apiUrl) >= 0) && token){

            if(request.url.indexOf('login') < 0){
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            
        }

        return next.handle(request);
    }
}
