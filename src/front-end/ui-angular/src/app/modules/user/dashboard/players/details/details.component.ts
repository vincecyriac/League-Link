import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { AppConstants } from 'src/app/app.constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { PlayersService } from 'src/app/shared/services/players.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsComponent implements OnInit {

  private objDestroyed$ = new Subject();

  @Input() intPlayerId!: number;
  @Input() arrTeamsList!: Array<any>;

  objPlayerUpdateForm = this.objFormBuilder.group({
    name    : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(AppConstants.NAME_REGEX)]],
    phone   : ['', [Validators.required, Validators.minLength(10), Validators.maxLength(13), Validators.pattern(AppConstants.NUMBER_REGEX)]],
    team_id : [null, []]
  });
  objPlayerDetails : any;

  constructor(
    private objFormBuilder: FormBuilder,
    public objActiveModal: NgbActiveModal,
    private objChRef: ChangeDetectorRef,
    private objPlayersService: PlayersService,
    private objCommonService: CommonService
    ) { }

  ngOnInit(): void {
    this.getPlayerDetails();
  }

  ngOnDestroy() {
    this.objDestroyed$.next(void 0);
    this.objDestroyed$.complete();
  }

  getPlayerDetails(){
    this.objPlayersService.getPlayerById(this.intPlayerId).pipe(takeUntil(this.objDestroyed$)).subscribe({
      next : (objResponse) => {
        this.objPlayerDetails = objResponse;
        this.objPlayerUpdateForm.patchValue(objResponse.player)
        this.objChRef.markForCheck()
      },
      error : () => {
        this.objCommonService.showError("Something went wrong");
        this.openCloseModal(2)
      }
    })
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

  updateUser(){
    console.log(this.objPlayerUpdateForm.value)
    if(this.objPlayerUpdateForm.valid){
      this.objPlayersService.updateIndividualPlayer(this.intPlayerId, this.objPlayerUpdateForm.value).pipe(takeUntil(this.objDestroyed$)).subscribe({
        next : () => {
          this.objCommonService.showSuccess("User updated success");
          this.objChRef.markForCheck();
          this.openCloseModal(1);
        },
        error : () => {
          this.objCommonService.showError("Something went wrong");
          this.objChRef.markForCheck();
        }
      })
    }
  }
}
