import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(private objAuthService: AuthService, private objRouter: Router) { }

  // This method is a route guard that is called by the Angular router to determine if a route can be activated.
  // It returns a boolean or a UrlTree to indicate if the route can be activated.
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Check if the user is not logged in.
    // If the user is not logged in, return true to allow the route to be activated.
    if (!this.objAuthService.isLoggedIn()) {
      return true;
    }
    // If the user is logged in, redirect to the home page and return false to prevent the route from being activated.
    else {
      this.objRouter.navigate(['/'])
      return false;
    }
  }


}
