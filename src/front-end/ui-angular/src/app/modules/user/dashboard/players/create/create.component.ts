import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { AppConstants } from 'src/app/app.constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { PlayersService } from 'src/app/shared/services/players.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent implements OnDestroy {

  private objDestroyed$ = new Subject();

  @Input() arrTeamsList!: Array<any>;

  blnShowSpinner: boolean = false;

  objUserCreateForm = this.objFormBuilder.group({
    players: this.objFormBuilder.array([this.getNewPlayerForm()])
  });

  constructor(
    private objFormBuilder: FormBuilder,
    public objActiveModal: NgbActiveModal,
    private objChRef: ChangeDetectorRef,
    private objPlayersService: PlayersService,
    private objCommonService: CommonService
  ) { }

  ngOnDestroy() {
    this.objDestroyed$.next(void 0);
    this.objDestroyed$.complete();
  }

  openCloseModal(intStatus: number) {
    // Check if intStatus is 1
    if (intStatus == 1) {
      // Close the modal and pass a value 2
      this.objActiveModal.close(2);
    } else {
      // Dismiss the modal
      this.objActiveModal.dismiss();
    }
  }

  getNewPlayerForm() {
    //returns a form group for players form array
    return this.objFormBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(AppConstants.NAME_REGEX)]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(13), Validators.pattern(AppConstants.NUMBER_REGEX)]],
      team_id: [null, []]
    });
  }

  addPlayer() {
    // Get the 'players' FormArray from the 'objUserCreateForm' FormGroup
    let arrPlayers = this.objUserCreateForm.get('players') as FormArray
    // Add a new player FormGroup to the 'players' FormArray
    arrPlayers.push(this.getNewPlayerForm());
    // Tell Angular to check and update the component and its children
    this.objChRef.markForCheck();
  }

  deletePlayer(intIndex: any) {
    // Get the 'players' FormArray from the 'objUserCreateForm' FormGroup
    let arrPlayers = this.objUserCreateForm.get('players') as FormArray
    // Remove the player form element at the specified index
    arrPlayers.removeAt(intIndex)
    // Tell Angular to check and update the component and its children
    this.objChRef.markForCheck();
  }

  createUsers() {
    console.log(this.objUserCreateForm.value)
    // Check if the form is valid
    if (this.objUserCreateForm.valid) {
      // Show spinner to indicate to the user that the operation is in progress
      this.blnShowSpinner = true;
      // Call the service method to create new players
      this.objPlayersService.createPlayers(this.objUserCreateForm.value.players).pipe(takeUntil(this.objDestroyed$)).subscribe({
        next: () => {
          // Show success message and close the modal
          this.objCommonService.showSuccess("Players added successfully");
          this.blnShowSpinner = false;
          this.objChRef.markForCheck();
          this.openCloseModal(1)
        },
        error: () => {
          // Show error message and hide the spinner
          this.objCommonService.showError("Operation failed")
          this.blnShowSpinner = false;
          this.objChRef.markForCheck();
        }
      });
    }
  }
}
