import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_ENDPOINT = AppConstants.API_URL;

  constructor(
    private objHttpClient: HttpClient
  ) { }

  public createUser(objParams: any): Observable<any> {
    // send a POST request to the create user endpoint with the create user form data
    return this.objHttpClient.post(`${this.API_ENDPOINT}user`, objParams)
  }
}
