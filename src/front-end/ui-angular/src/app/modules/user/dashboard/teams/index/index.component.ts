import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { AppConstants } from 'src/app/app.constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { TeamsService } from 'src/app/shared/services/teams.service';

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
        console.log(objResponse)
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

  handlePageChange(intPage: number) {
    // Scroll to top of the page on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Update current page in pagination data
    this.objPaginationData.currentPage = intPage;
    // call getTeamList function to load the new page
    this.getTeamList()
  }

}
