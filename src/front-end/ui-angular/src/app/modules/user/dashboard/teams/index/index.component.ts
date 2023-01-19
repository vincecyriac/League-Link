import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { AppConstants } from 'src/app/app.constants';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { TeamsService } from 'src/app/shared/services/teams.service';
import { CreateComponent } from '../create/create.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent implements OnInit, OnDestroy {

  private objDestroyed$ = new Subject();

  blnShowSpinner: boolean = false;
  objPaginationData: any = {
    pageSize: AppConstants.PAGINATION_PAGE_SIZE,
    maxSize: AppConstants.PAGINATION_MAX_SIZE,
    directionLinks: AppConstants.PAGINATION_DIRECTION_LINKS,
    size: AppConstants.PAGINATION_SIZE,
    currentPage: 1
  }
  objTeamsData : any;
  objModalList: any = {
    1: ConfirmModalComponent,
    2: CreateComponent
  }
  intSelectedTeamId !: number | null | undefined;

  objSearchForm = this.objFormBuilder.group({
    name: ['', []]
  });

  constructor(
    private objCommonService: CommonService,
    private objFormBuilder: FormBuilder,
    private objTeamsService: TeamsService,
    private objChRef: ChangeDetectorRef,
    private objModalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getTeamList()
  }

  ngOnDestroy() {
    this.objDestroyed$.next(void 0);
    this.objDestroyed$.complete();
  }

  searchTeam() {
    // Reset current page to 1
    this.objPaginationData.currentPage = 1;
    // Call the getTeamList function
    this.getTeamList();
  }

  getTeamList(){
    this.blnShowSpinner = true;
    this.objTeamsService.getAllTeams(this.objPaginationData.currentPage, this.objSearchForm.value).pipe(takeUntil(this.objDestroyed$)).subscribe({
      next : (objResponse : any) => {
        this.blnShowSpinner = false;
        this.objTeamsData = objResponse;
        this.objChRef.markForCheck()
      },
      error : () => {
        this.blnShowSpinner = false;
        this.objCommonService.showError("Something went wrong");
        this.objChRef.markForCheck()
      }
    })
  }

  openModal(intModalId: number, intTeamId? : number, strModalSize ?: string) {
    this.intSelectedTeamId = intTeamId;
    // Open the modal with specified id, with size 'lg' and centered
    const modalRef = this.objModalService.open(this.objModalList[intModalId], { size: strModalSize || 'lg', centered: true });
    // If the modal is of type 1, set the player id on the modal instance
    if (intModalId === 1) {
      modalRef.componentInstance.strMessage = "Are you sure you want to delete the team?";
      modalRef.componentInstance.strClass = 'btn-soft-danger';
    } else if(intModalId === 3) {
      modalRef.componentInstance.intTeamId   = intTeamId;
    }
    modalRef.result.then((result) => {
      // On modal close, check the returned result
      // if result is 1, call detele Team function
      // otherwise, call getPlayersList function
      if (result === 1) {
        this.deleteTeam(this.intSelectedTeamId);
      } else {
        this.objPaginationData.currentPage = 1;
        this.getTeamList();
      }
    }, (reason) => { });
  }

  handlePageChange(intPage: number) {
    // Scroll to top of the page on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Update current page in pagination data
    this.objPaginationData.currentPage = intPage;
    // call getTeamList function to load the new page
    this.getTeamList()
  }

  deleteTeam(intTeamId : any){
    this.blnShowSpinner = true;
    this.objTeamsService.deleteTeamById(intTeamId).pipe(takeUntil(this.objDestroyed$)).subscribe({
      next : () => {
        this.objCommonService.showSuccess("Team deleted")
        this.objPaginationData.currentPage = 1;
        this.getTeamList();
      },
      error : () => {
        this.objCommonService.showError("Something went wrong")
        this.blnShowSpinner = false;
      }
    })
  }

}
