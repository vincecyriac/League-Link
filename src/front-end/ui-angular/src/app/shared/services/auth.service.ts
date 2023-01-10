import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AppConstants } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_ENDPOINT = AppConstants.API_URL;
  private JWT_TOKEN = 'JWT_TOKEN';
  private REFRESH_TOKEN = 'REFRESH_TOKEN'

  constructor(
    private objHttpClient: HttpClient,
    private objRouter: Router
  ) { }

  //Login service
  public loginUser(objParams: any): Observable<any> {
    // send a POST request to the login endpoint with the login form data
    return this.objHttpClient.post(`${this.API_ENDPOINT}login`, objParams).pipe(
      // if the request is successful, extract the access and refresh tokens from the response
      map((response: any) => {
        const accessToken = response["accessToken"];
        const refreshToken = response["refreshToken"];
        // if the tokens are present, store them in local storage
        if (accessToken && refreshToken) {
          localStorage.setItem(this.JWT_TOKEN, accessToken);
          localStorage.setItem(this.REFRESH_TOKEN, refreshToken);
        }
        // return the response data for use in the component
        return response;
      })
    );
  }
  // check if there is a valid access token in local storage
  isLoggedIn(): boolean {
    return localStorage.getItem(this.JWT_TOKEN) != null;
  }

  // clear the local storage and navigate to the login page
  logOut() {
    localStorage.clear();
    this.objRouter.navigateByUrl('/login');
  }

  // get the access token from local storage (for use in the auth interceptor)
  getAccessToken(): string | null {
    return localStorage.getItem(this.JWT_TOKEN) || null;
  }

  // send a PUT request to the login endpoint with the refresh token (for use in the auth interceptor)
  refreshLogin(): Observable<any> {
    return this.objHttpClient.put(this.API_ENDPOINT + 'login', { refreshToken : localStorage.getItem(this.REFRESH_TOKEN)});
  }

  // save the new access and refresh tokens in local storage (for use in the auth interceptor)
  saveNewToken(aToken: string, rToken: string) {
    localStorage.setItem(this.JWT_TOKEN, aToken);
    localStorage.setItem(this.REFRESH_TOKEN, rToken);
  }

}
