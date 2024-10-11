import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

import { AuthService } from '../../../pages/auth/shared/auth.service';
import { ISession } from '../../shared/interfaces/session';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  ld: boolean = false;

  private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private submitting: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private sidebarCollapsed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isMobile() ? true : true);
  private showMenuEmiiter: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private currentEntity: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) { }

  public get currentSession(): ISession {
    return this.authService.currentSessionValue
  }

  public get currentLoading(): Observable<boolean> {
    return this.loading.asObservable();
  }

  public get currentSubmitting(): Observable<boolean> {
    return this.submitting.asObservable();
  }

  public get currentSidebarCollapsed(): Observable<boolean> {
    return this.sidebarCollapsed.asObservable();
  }

  public get currentShowMenu(): Observable<boolean> {
    return this.showMenuEmiiter.asObservable();
  }

  public get currentEntitySetted(): Observable<any> {
    return this.currentEntity.asObservable();
  }

  public isMobile(){
    return screen.width <= 768 ? true : false
  }

  public toggleLoading(force?: boolean) {
    if (force != null) {
      this.loading.next(force);
    } else {
      this.loading.next(!this.loading.value);
    }
  }
  public toggleSubmitting(force?: boolean) {
    if (force != null) {
      this.submitting.next(force);
    } else {
      this.submitting.next(!this.submitting.value);
    }
  }
  public toggleSidebar(force?: boolean) {
    if (force != null) {
      this.sidebarCollapsed.next(force);
    } else {
      this.sidebarCollapsed.next(!this.sidebarCollapsed.value);
    }
  }
  public toggleMenu(force?: boolean) {
    if (force != null) {
      this.showMenuEmiiter.next(force);
    } else {
      this.showMenuEmiiter.next(!this.showMenuEmiiter.value);
    }
  }

  public logout(){
    this.authService.logout().subscribe(
      result => {
        this.toggleMenu(false)
        this.router.navigate(['/auth/login'])
      }
    )
  }

  public sendToastr(action: string, message: string){
    this.toastr[action](message)
  }

  public sendDefaultErrorToastr(error: any){
    let messages = error.error.messages
    if(Array.isArray(messages)){
      messages.forEach(e => {
        this.toastr.error(e)
      });
    }
  }

  public hasPermissions(permissions: string[]){
    let userPermissions = this.currentSession?.permissions || []
    let result: boolean = false

    permissions?.map(p => {
      if(userPermissions.map(({slug}) => slug).indexOf(p) >= 0)
      result = true

      if(permissions.includes('all'))
      result = true

      if(userPermissions.map(({slug}) => slug).includes('master'))
      result = true
    })

    return result
  }

  protected handleError(error: any): Observable<any> {
    //console.log("Erro na Requisição =>", error)
    return throwError(error);
  }
}
