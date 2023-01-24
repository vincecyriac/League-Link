import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  private objDestroyed$ = new Subject();

  blnShowSpinner: boolean = false;

  constructor(
    private objCommonService: CommonService,
    private objChRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subscribeToSpinnerStatus();
  }

  ngOnDestroy() {
    this.objDestroyed$.next(void 0);
    this.objDestroyed$.complete();
  }

  subscribeToSpinnerStatus() {
    this.objCommonService.getSpinnerStatus.pipe(takeUntil(this.objDestroyed$)).subscribe({
      next: (objResponse) => {
        this.blnShowSpinner = objResponse;
        this,this.objChRef.detectChanges()
        this.objChRef.markForCheck()
      }
    })
  }
}
