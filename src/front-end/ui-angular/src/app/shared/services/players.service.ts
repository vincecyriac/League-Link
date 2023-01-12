import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  private API_ENDPOINT = AppConstants.API_URL;

  constructor(
    private objHttpClient: HttpClient
  ) { }

  //function to fetch api for players list
  public getAllPlayers(intPage: number, objPayload : any): Observable<any> {
    return this.objHttpClient.get(`${this.API_ENDPOINT}players?limit=${AppConstants.PAGINATION_PAGE_SIZE}&page=${intPage}&name=${objPayload?.name}&team=${objPayload?.team}`)
  }

  //function to delete players
  public deletPlayers(objPayload : any): Observable<any> {
    return this.objHttpClient.put(`${this.API_ENDPOINT}players/delete`,objPayload)
  }

  //function to create players
  public createPlayers(objPayload : any): Observable<any> {
    return this.objHttpClient.post(`${this.API_ENDPOINT}players`,objPayload)
  }

  //function to get individual player details
  public getPlayerById(intPlayerId : number): Observable<any> {
    return this.objHttpClient.get(`${this.API_ENDPOINT}players/${intPlayerId}`)
  }

  //function to update individual player details
  public updateIndividualPlayer(intPlayerId : number, objPayload : any): Observable<any> {
    return this.objHttpClient.put(`${this.API_ENDPOINT}players/${intPlayerId}`, objPayload)
  }
}
