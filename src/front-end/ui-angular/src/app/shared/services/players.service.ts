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

  public getAllPlayers(intPage: number, objPayload : any): Observable<any> {
    return this.objHttpClient.get(`${this.API_ENDPOINT}players?limit=${AppConstants.PAGINATION_PAGE_SIZE}&page=${intPage}&name=${objPayload?.name}&team=${objPayload?.team}`)
  }
}
