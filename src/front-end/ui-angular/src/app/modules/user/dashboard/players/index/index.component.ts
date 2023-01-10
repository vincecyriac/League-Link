import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from 'src/app/app.constants';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { PlayersService } from 'src/app/shared/services/players.service';
import { TeamsService } from 'src/app/shared/services/teams.service';
import { CreateComponent } from '../create/create.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent implements OnInit {

  @ViewChildren("selectionCheckbox") elCheckBoxes!: QueryList<ElementRef>;

  blnShowSpinner: boolean = false;
  objPlayersData !: any;
  objPaginationData: any = {
    pageSize: AppConstants.PAGINATION_PAGE_SIZE,
    maxSize: AppConstants.PAGINATION_MAX_SIZE,
    directionLinks: AppConstants.PAGINATION_DIRECTION_LINKS,
    size: AppConstants.PAGINATION_SIZE,
    currentPage: 1
  }
  arrTeamList: Array<any> = [];
  arrSelectedList: Array<any> = []
  blnAllSelected: boolean = false;
  objModalList: any = {
    1: ConfirmModalComponent,
    2: CreateComponent
  }

  objSearchForm = this.objFormBuilder.group({
    name: ['', []],
    team: ['', []]
  });

  constructor(
    private objPlayersService: PlayersService,
    private objCommonService: CommonService,
    private objFormBuilder: FormBuilder,
    private objTeamsService: TeamsService,
    private objChRef: ChangeDetectorRef,
    private objModalService: NgbModal,
    private objRouter: Router
  ) { }

  ngOnInit(): void {
    this.getPlayersList();
    this.getTeamsList();
  }

  getPlayersList() {
    this.blnShowSpinner = true;
    this.objPlayersService.getAllPlayers(this.objPaginationData.currentPage, this.objSearchForm.value).subscribe({
      // On success, hide the spinner, show a success message, and redirect to the home page.
      next: (objResponse) => {
        this.objPlayersData = objResponse;
        this.blnShowSpinner = false;
        this.objChRef.markForCheck();
      },
      // On error, hide the spinner and show an error message.
      error: () => {
        this.blnShowSpinner = false;
        this.objCommonService.showError('Something went Wrong')
        this.objChRef.markForCheck();
      }
    });
  }

  getTeamsList() {
    this.objTeamsService.getAllPlayersMiniList().subscribe({
      next: (objResponse) => {
        this.arrTeamList = objResponse.rows;
        this.objChRef.markForCheck();
      }
    });
  }

  searchPlayers() {
    this.objPaginationData.currentPage = 1;
    this.getPlayersList()
  }

  handlePageChange(intPage: any) {
    window.scrollTo(0, 0)
    this.objPaginationData.currentPage = intPage;
    this.getPlayersList()
  }

  openModal(intModalId: number, intPlayerId?: number) {
    const modalRef = this.objModalService.open(this.objModalList[intModalId], { size: 'lg', centered: true });
    if (intModalId == 1)
      modalRef.componentInstance.intPlayerId = intPlayerId
    modalRef.result.then((result) => {
      if(result == 1 ){
        this.deletePlayers()
      } else {
        this.getPlayersList()
      }
    }, (reason) => {});
  }

  //handle select all events
  handleSelectAll(objEvent: any) {
    if (objEvent.target.checked) {
      this.arrSelectedList = this.objPlayersData.rows.map((objPlayer: any) => objPlayer.id);
      this.elCheckBoxes.forEach(element => { element.nativeElement.checked = true });
      this.blnAllSelected = true;
    }
    else {
      this.elCheckBoxes.forEach(element => { element.nativeElement.checked = false });
      this.blnAllSelected = false;
      this.arrSelectedList = [];
    }
    this.objChRef.markForCheck()
  }

  //handle single selection events
  handleSingleSelection(objEvent: any, playerId: any) {
    objEvent.target.checked ? this.arrSelectedList.push(playerId) : this.arrSelectedList.splice(this.arrSelectedList.indexOf(playerId), 1);
    this.objPlayersData.rows.length == this.arrSelectedList.length ? this.blnAllSelected = true : this.blnAllSelected = false;
    this.objChRef.markForCheck()
  }

  deletePlayers() {
    console.log(this.arrSelectedList)
  }

}
