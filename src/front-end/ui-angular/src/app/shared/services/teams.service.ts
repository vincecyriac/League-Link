import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  private API_ENDPOINT = AppConstants.API_URL;

  constructor(
    private objHttpClient: HttpClient
  ) { }

  //fetch api fot teams that return name and is only
  public getAllTeamsMiniList(): Observable<any> {
    return this.objHttpClient.get(`${this.API_ENDPOINT}teams/mini`)
  }

}
