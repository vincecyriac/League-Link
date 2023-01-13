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

  blnShowSpinner : boolean = false;

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
    this.blnShowSpinner = true;
    // calling the getPlayerById method from the PlayersService to get the details of the player
    // passing the player id as an argument
    this.objPlayersService.getPlayerById(this.intPlayerId).pipe(takeUntil(this.objDestroyed$)).subscribe({
      // if the details are successfully retrieved, set the response to objPlayerDetails and update the form
      next : (objResponse) => {
        this.objPlayerDetails = objResponse;
        this.objPlayerUpdateForm.patchValue(objResponse)
        this.blnShowSpinner = false;
        // triggering change detection manually
        this.objChRef.markForCheck()
      },
      // if there is an error, show error message and close the modal
      error : () => {
        this.objCommonService.showError("Something went wrong");
        this.blnShowSpinner = false;
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
    if(this.objPlayerUpdateForm.valid){
      this.blnShowSpinner = true;
      // calling the updateIndividualPlayer method from the PlayersService to update the individual player
      // passing the player id and the updated form values as arguments
      this.objPlayersService.updateIndividualPlayer(this.intPlayerId, this.objPlayerUpdateForm.value).pipe(takeUntil(this.objDestroyed$)).subscribe({
        // if the update is successful, show success message and close the modal
        next : () => {
          this.objCommonService.showSuccess("User updated success");
          this.blnShowSpinner = false;
          // triggering change detection manually
          this.objChRef.markForCheck();
          this.openCloseModal(1);
        },
        // if there is an error, show error message
        error : () => {
          this.blnShowSpinner = false;
          this.objCommonService.showError("Something went wrong");
          // triggering change detection manually
          this.objChRef.markForCheck();
        }
      })
    }
  }

}
