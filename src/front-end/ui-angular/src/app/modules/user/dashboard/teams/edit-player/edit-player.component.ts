import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { PlayersService } from 'src/app/shared/services/players.service';
import { TeamsService } from 'src/app/shared/services/teams.service';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditPlayerComponent implements OnInit, OnDestroy {

  @Input() intTeamId !: number;

  arrFilteredPlayers: any = []
  arrTotalList: any = []
  arrCurrentList: any = []
  blnShowSpinner: boolean = true;

  private objDestroyed$ = new Subject();

  constructor(
    public objActiveModal: NgbActiveModal,
    private objChRef: ChangeDetectorRef,
    private objPlayersService: PlayersService,
    private objTeamsService: TeamsService,
    private objCommonService: CommonService
  ) { }

  ngOnInit(): void {
    this.getTeamAndPlayers();
  }

  ngOnDestroy() {
    this.objDestroyed$.next(void 0);
    this.objDestroyed$.complete();
  }

  getTeamAndPlayers() {
    combineLatest([this.objPlayersService.getPlayersMiniList(), this.objTeamsService.getTeamById(this.intTeamId)]).pipe(takeUntil(this.objDestroyed$)).subscribe({
      next: ([objPlayers, objteamData]) => {
        this.blnShowSpinner = false;
        this.arrCurrentList = objteamData.players;
        this.arrTotalList = objPlayers.rows;
        this.objChRef.markForCheck()
      }
    })
  }

  clearPlayer(intPlayerId: any) {
    console.log(intPlayerId)
    let index = this.arrCurrentList.findIndex((player: any) => player.id === intPlayerId);
    this.arrCurrentList.splice(index, 1);
    this.objChRef.markForCheck()
  }

  addPlayer(objPlayer: any) {
    console.log("pl")
    let index = this.arrCurrentList.findIndex((player: any) => player.id === objPlayer.id);
    if (index == -1)
      this.arrCurrentList.push(objPlayer)
    else
      this.objCommonService.showWarning('Already added')
    this.objChRef.markForCheck()
  }

  filterPlayers(objEvent: any) {
    console.log(objEvent.target.value)
    if (objEvent.target.value != '')
      this.arrFilteredPlayers = this.arrTotalList.filter((player: any) => player.name.toLowerCase().includes(objEvent.target.value.toLowerCase()));
    else
      this.arrFilteredPlayers = []
    this.objChRef.markForCheck()
  }

  openCloseModal(intStatus: number) {
    // Check if intStatus is 1
    if (intStatus == 1) {
      // Close the modal and pass a value 2
      this.objActiveModal.close(3);
    } else {
      // Dismiss the modal
      this.objActiveModal.dismiss();
    }
  }

  updatePlayers(){
    this.blnShowSpinner = true;
    const objPayload = {
      team_id : this.intTeamId,
      players :  this.arrCurrentList.map((player : any) => player.id)
    }
    this.objPlayersService.updatePlayersTeam(objPayload).pipe(takeUntil(this.objDestroyed$)).subscribe({
      next : () => {
        this.objCommonService.showSuccess("Players updated")
        this.openCloseModal(2)
      },
      error : () => {
        this.blnShowSpinner = false;
        this.objCommonService.showError('Something went wrong')
      }
    })
  }

}
