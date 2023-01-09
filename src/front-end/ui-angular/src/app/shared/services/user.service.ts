import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AppConstants } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private API_ENDPOINT = AppConstants.API_URL;
  private objUserData$ = new BehaviorSubject<any>({}); // behavior subject to hold the current user data

  constructor(
    private objHttpClient: HttpClient,
  ) { }

  public createUser(objParams: any): Observable<any> {
    // send a POST request to the create user endpoint with the create user form data
    return this.objHttpClient.post(`${this.API_ENDPOINT}user`, objParams)
  }

  public getCurrentUser(): Observable<any> {
    // send a GET request to get the logged in user data
    return this.objHttpClient.get(`${this.API_ENDPOINT}login`).pipe(
      map((objResponse: any) => {
        // update the behavior subject with the retrieved user data
        this.objUserData$.next(objResponse);
        return objResponse;
      })
    );
  }

  // getter function for the user data observable
  get userData() {
    return this.objUserData$.asObservable()
  }

}
