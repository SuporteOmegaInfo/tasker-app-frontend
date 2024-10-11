import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { ISession } from '../../../kernel/shared/interfaces/session';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import * as CryptoJS from 'crypto-js';
import { IUser } from '../../../kernel/shared/entities/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private sessionSubject: BehaviorSubject<ISession>;
  public currentSession: Observable<ISession>;
  private session: ISession;

  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {
    if(sessionStorage.getItem('session')){
      this.sessionSubject = new BehaviorSubject<ISession>(
        JSON.parse(
          CryptoJS.AES.decrypt(sessionStorage.getItem('session'), environment.chaveCrypt).toString(CryptoJS.enc.Utf8)
        )
      )
    } else {
      this.sessionSubject = new BehaviorSubject<ISession>(
        JSON.parse(sessionStorage.getItem('session'))
      )
    }

    this.currentSession = this.sessionSubject.asObservable();
  }

  public get currentSessionValue(): ISession {
    return this.sessionSubject.value;
  }

  public login(email: string, password: string) {
    return this.http.post<ISession>(`${environment.apiUrl}/auth/login`, {
      email, password
    }, this.httpOptions)
    .pipe(
      map((result) => this.patchNewSessionData(result),
      (error) => {
        throwError(error)
      })
    )
  }

  public logout() {
    return this.http
      .post(`${environment.apiUrl}/auth/logout`, { user_id: this.currentSessionValue.user.id })
      .pipe(
        map(result => {
          this.sessionSubject = new BehaviorSubject<ISession>(null);
          sessionStorage.removeItem('session');

          return result
        }),
        catchError(this.handleError)
      );
  }

  public requestPassword(email: string) {
    return this.http
      .post(`${environment.apiUrl}/auth/request-password`, { email })
      .pipe(
        map(result => result),
        catchError(this.handleError)
      );
  }

  public validateRequestPassword(email: string, code?: string) {
    return this.http
      .post(`${environment.apiUrl}/auth/request-password/validate`, { email, code })
      .pipe(
        map(result => result),
        catchError(this.handleError)
      );
  }

  public changePassword(email: string, code: string, password: string) {
    return this.http
      .post(`${environment.apiUrl}/auth/request-password/change`, { email, code, password })
      .pipe(
        map(result => result),
        catchError(this.handleError)
      );
  }

  public complete_register(data: IUser){
    return this.http.post(`${environment.apiUrl}/auth/complete-register`, data)
    .pipe(
      map(result => {
        return result
      }),
      catchError(this.handleError)
    )
  }

  public get_complete_register_data(){
    return this.http.get(`${environment.apiUrl}/auth/complete-register`)
    .pipe(
      map(result => {
        return result
      }),
      catchError(this.handleError)
    )
  }

  public patchNewSessionData(data: ISession){
    this.session = data

    sessionStorage.setItem(
      'session',
      CryptoJS.AES.encrypt(
        JSON.stringify(this.session),
        environment.chaveCrypt
      ).toString()
    );

    this.sessionSubject.next(this.session);

    return this.sessionSubject.value
  }

  protected handleError(error: any): Observable<any> {
    //console.log("Erro na Requisição =>", error)
    return throwError(error);
  }
}
