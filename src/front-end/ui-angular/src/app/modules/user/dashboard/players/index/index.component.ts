import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, Subject, take, takeUntil } from 'rxjs';
import { AppConstants } from 'src/app/app.constants';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { PlayersService } from 'src/app/shared/services/players.service';
import { TeamsService } from 'src/app/shared/services/teams.service';
import { CreateComponent } from '../create/create.component';
import { DetailsComponent } from '../details/details.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent implements OnInit, OnDestroy {

  private objDestroyed$ = new Subject();

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
    2: CreateComponent,
    3: DetailsComponent
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
    private objModalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getTeamsList();
    this.getPlayersList();
  }

  ngOnDestroy() {
    this.objDestroyed$.next(void 0);
    this.objDestroyed$.complete();
  }

  getPlayersList() {
    // Show the spinner to indicate loading
    this.blnShowSpinner = true;
    // Call the service to fetch all players data
    this.objPlayersService.getAllPlayers(this.objPaginationData.currentPage, this.objSearchForm.value).pipe(takeUntil(this.objDestroyed$)).subscribe({
      next: (objResponse) => {
        // On success, hide the spinner, assign the response to the players data property
        // and triggers change detection.
        this.objPlayersData = objResponse;
        this.blnShowSpinner = false;
        this.objChRef.markForCheck();
      },
      error: (error) => {
        // On error, hide the spinner and show an error message.
        this.blnShowSpinner = false;
        this.objCommonService.showError('Something went Wrong');
        this.objChRef.markForCheck();
      }
    });
  }


  getTeamsList() {
    // Call the service to fetch all teams data
    this.objTeamsService.getAllTeamsMiniList().pipe(takeUntil(this.objDestroyed$)).subscribe({
      next: (objResponse) => {
        // On success, assign the response rows to team list property
        // and triggers change detection
        this.arrTeamList = objResponse.rows;
        this.objChRef.markForCheck();
      },
      error: (error) => {
        // On error, show an error message and log the error in console for better debugging
        this.objCommonService.showError('Something went Wrong')
        this.objChRef.markForCheck();
      }
    });
  }

  searchPlayers() {
    // Reset current page to 1
    this.objPaginationData.currentPage = 1;
    // Call the getPlayersList function
    this.getPlayersList();
  }


  handlePageChange(intPage: number) {
    // Scroll to top of the page on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Update current page in pagination data
    this.objPaginationData.currentPage = intPage;
    // call getPlayersList function to load the new page
    this.getPlayersList();
    //reset select variables
    this.blnAllSelected = false;
    this.arrSelectedList = []
  }

  openModal(intModalId: number, intPlayerId? : number, strModalSize ?: string) {
    // Open the modal with specified id, with size 'lg' and centered
    const modalRef = this.objModalService.open(this.objModalList[intModalId], { size: strModalSize || 'lg', centered: true, scrollable : true });
    // If the modal is of type 1, set the player id on the modal instance
    if (intModalId === 1) {
      modalRef.componentInstance.strMessage = "Are you sure you want to delete the selected players?";
      modalRef.componentInstance.strClass = 'btn-soft-danger';
    } else if(intModalId === 2) {
      modalRef.componentInstance.arrTeamsList = this.arrTeamList;
    } else {
      modalRef.componentInstance.arrTeamsList = this.arrTeamList;
      modalRef.componentInstance.intPlayerId   = intPlayerId;
    }
    modalRef.result.then((result) => {
      // On modal close, check the returned result
      // if result is 1, call deletePlayers function
      // otherwise, call getPlayersList function
      if (result === 1) {
        this.deletePlayers();
      } else {
        this.objPaginationData.currentPage = 1;
        this.getPlayersList();
      }
    }, (reason) => { });
  }

  handleSelectAll(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    // If the select all checkbox is checked, assign all player ids to the selected list, otherwise empty it
    this.arrSelectedList = checkbox.checked ? this.objPlayersData.rows.map((player: any) => player.id) : [];
    // Set all checkboxes' checked property to the value of the select all checkbox
    this.elCheckBoxes.forEach(element => { element.nativeElement.checked = checkbox.checked });
    // Set the all selected flag to the value of the select all checkbox
    this.blnAllSelected = checkbox.checked;
    //Mark for check
    this.objChRef.markForCheck();
  }

  handleSingleSelection(event: Event, playerId: number) {
    const checkbox = event.target as HTMLInputElement;
    //If the checkbox is checked, push the player id to the selected list
    if (checkbox.checked) {
      this.arrSelectedList.push(playerId);
    } else {
      // If the checkbox is not checked, remove the player id from the selected list
      this.arrSelectedList.splice(this.arrSelectedList.indexOf(playerId), 1);
    }
    // Set the all selected flag to true if the number of selected players is equal to the total number of players
    this.blnAllSelected = this.objPlayersData.rows.length === this.arrSelectedList.length;
    //Mark for check
    this.objChRef.markForCheck();
  }

  deletePlayers() {
    // Show spinner to indicate to the user that the operation is in progress
    this.blnShowSpinner = true;

    // Check if any players are selected for deletion
    if (this.arrSelectedList.length > 0) {
      // Call the service method to delete the selected players
      this.objPlayersService.deletPlayers({ ids: this.arrSelectedList }).pipe(takeUntil(this.objDestroyed$)).subscribe({
        next: () => {
          // Show success message and refresh the players list
          this.objCommonService.showSuccess('Deleted succesfully');

          // Check if current page is not first and equals to total number of pages and all players are deleted
          if (this.objPaginationData.currentPage != 1 && this.objPaginationData.currentPage == Math.ceil(this.objPlayersData.count / this.objPaginationData.pageSize) && this.arrSelectedList.length == this.objPlayersData.rows.length) {
            this.objPaginationData.currentPage -= 1;
          }

          // Reset selection and refresh the players list
          this.blnAllSelected = false;
          this.arrSelectedList = [];
          this.getPlayersList();
          this.objChRef.markForCheck()
        },
        error: () => {
          // Hide spinner and show error message
          this.blnShowSpinner = false;
          this.objCommonService.showError('Delete operation failed');
        }
      });
    }
  }


}
