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

  //fetch api for teams that return name and is only
  public getAllTeamsMiniList(): Observable<any> {
    return this.objHttpClient.get(`${this.API_ENDPOINT}teams/mini`)
  }

  //fetch api for list all teams
  public getAllTeams(intPage : number, objPayload : any): Observable<any> {
    return this.objHttpClient.get(`${this.API_ENDPOINT}teams?limit=${AppConstants.PAGINATION_PAGE_SIZE}&page=${intPage}&name=${objPayload?.name}`)
  }

  //delete api for deleting a particular team
  public deleteTeamById(intTeamId : number): Observable<any> {
    return this.objHttpClient.delete(`${this.API_ENDPOINT}teams/${intTeamId}`)
  }
  //delete api for deleting a particular team
  public createTeam(objPayload : any): Observable<any> {
    return this.objHttpClient.post(`${this.API_ENDPOINT}teams`,objPayload)
  }
  //get api for deleting a particular team
  public getTeamById(intTeamId : any): Observable<any> {
    return this.objHttpClient.get(`${this.API_ENDPOINT}teams/${intTeamId}`)
  }
  //delete api for deleting a particular team
  public updateTeam(intTeamId:number, objPayload : any): Observable<any> {
    return this.objHttpClient.put(`${this.API_ENDPOINT}teams/${intTeamId}`,objPayload)
  }
}
