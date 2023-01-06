import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // Flag to track if a refresh token request is in progress
  blnIsRefreshing = false;
  // Subject to hold the new access token after a successful refresh token request
  private refreshTokenSubject$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    // Inject the authentication service
    private objAuthService: AuthService,
  ) { }

  intercept(objRequest: HttpRequest<any>, objNext: HttpHandler): Observable<HttpEvent<any>> {
    // If there is a valid access token, add it to the request headers
    if (this.objAuthService.getAccessToken())
      objRequest = this.addToken(objRequest, this.objAuthService.getAccessToken())

    // Pass the request to the next handler
    return objNext.handle(objRequest).pipe(
      // Catch errors and check if they are unauthorized (401 or 403)
      catchError((objError: any) => {
        if (objError instanceof HttpErrorResponse && objError.status === 401)
          // If the error is unauthorized, try to refresh the access token
          return this.handle401Error(objRequest, objNext)
        else
          // If the error is not unauthorized, throw it
          return throwError(objError)
      })
    );
  }

  // Add the access token to the request headers
  private addToken(objRequest: HttpRequest<any>, access_token: string | null): HttpRequest<any> {
    if (objRequest.url.includes('/login') || objRequest.url.includes('/user')) {
      // Do not add the access token to these specific routes
      return objRequest.clone({ setHeaders: { 'Content-Type': `application/json; charset=utf-8`, } })
    }
    else {
      // Add the access token to all other routes
      return objRequest.clone({
        setHeaders: { 'Content-Type': `application/json; charset=utf-8`, 'Authorization': `LEAGUE_LINK ${access_token}` }
      })
    }
  }
  //is used to handle HTTP 401 errors, which occur when the user's access token has expired.
  private handle401Error(
    objRequest: HttpRequest<any>,
    objNext: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Check if the access token is currently being refreshed.
    if (!this.blnIsRefreshing) {
      // Set a flag to indicate that the access token is being refreshed.
      this.blnIsRefreshing = true
      // Send a null value to all subscribers of the refreshTokenSubject$.
      this.refreshTokenSubject$.next(null);
      // Call the refreshLogin method of the objAuthService object, which is expected to return an Observable that emits the new access and refresh tokens.
      return this.objAuthService.refreshLogin().pipe(
        // Use the switchMap operator to replace the Observable of the refreshLogin method with the Observable returned by the objNext.handle method,
        //which sends the HTTP request with the new access token to the server.
        switchMap((objToken: any) => {
          // Set the flag to indicate that the access token is no longer being refreshed.
          this.blnIsRefreshing = false;
          // Save the new access and refresh tokens.
          this.objAuthService.saveNewToken(objToken.accessToken['value'], objToken.refreshToken['value']);
          // Send the new access token to all subscribers of the refreshTokenSubject$.
          this.refreshTokenSubject$.next(objToken.accessToken['value']);
          // Return an Observable that sends the HTTP request with the new access token to the server.
          return objNext.handle(
            this.addToken(objRequest, objToken.accessToken['value'])
          );
        }),
        // If an error occurs during the refresh process, catch the error and log the user out.
        catchError((objError: any) => {
          // Set the flag to indicate that the access token is no longer being refreshed.
          this.blnIsRefreshing = false;
          // Log the user out.
          this.objAuthService.logOut();
          // Throw the error.
          return throwError(objError)
        })
      )
    }
    // If the access token has already been refreshed.
    else {
      // Return an Observable that first filters the values emitted by the refreshTokenSubject$ Observable by only allowing those that are not null,
      //takes the first value emitted, and then uses the switchMap operator to replace the Observable with the one returned by the objNext.handle method,
      //which sends the HTTP request with the new access token to the server.
      return this.refreshTokenSubject$.pipe(
        filter(strToken => strToken != null),
        take(1),
        switchMap(jwt => objNext.handle(this.addToken(objRequest, jwt))),
        // Log a message to the console when the Observable completes.
        finalize(() => { console.log("finished refresh token subject"); })
      )
    }
  }

}

// Export the AuthInterceptor class as an array of providers that can be imported and added to the HTTP_INTERCEPTORS array of the Angular module where it will be used.
export const authInterceptorProviders = [
  {
    // Specify that these providers should be added to the HTTP_INTERCEPTORS array.
    provide: HTTP_INTERCEPTORS,
    // Specify the AuthInterceptor class as the provider.
    useClass: AuthInterceptor,
    // Specify that there can be multiple providers for the HTTP_INTERCEPTORS token.
    multi: true
  }
]
