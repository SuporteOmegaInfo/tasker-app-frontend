import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MainService } from '../../../kernel/core/services/main.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private router: Router,
    private mainServ: MainService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    const currentSession = this.mainServ.currentSession;

    if (currentSession) {
      // authorized so return true and emit toggling the menu sidebar and navbar
      this.mainServ.toggleMenu(true)
      return true;
    }     
    
    if(sessionStorage.getItem("session")){

      //this.authService.logout()

    }

    this.mainServ.toggleMenu(false)
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
    return false;

  }

  canLoad(route: Route, state: RouterStateSnapshot) : Observable<boolean> | boolean {
    const currentSession = this.mainServ.currentSession;

    if(currentSession){
        return true;
    }

    // not logged in so redirect to login page with the return url
    this.mainServ.toggleMenu(false)
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}