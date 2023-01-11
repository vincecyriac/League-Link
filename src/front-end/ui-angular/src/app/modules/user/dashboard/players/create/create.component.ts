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
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CreateComponent implements OnDestroy {

  private objDestroyed$ = new Subject();

  @Input() arrTeamsList!: Array<any>;

  blnShowSpinner : boolean = false;

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
    if (intStatus == 1)
      this.objActiveModal.close(2)
    else
      this.objActiveModal.dismiss()
  }

  getNewPlayerForm() {
    return this.objFormBuilder.group({
      name     : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(AppConstants.NAME_REGEX)]],
      phone    : ['', [Validators.required, Validators.minLength(10), Validators.maxLength(13), Validators.pattern(AppConstants.NUMBER_REGEX)]],
      team_id  : [null, []]
    });
  }

  addPlayer(){
    let arrPlayers =  this.objUserCreateForm.get('players') as FormArray
    arrPlayers.push(this.getNewPlayerForm());
    this.objChRef.markForCheck();
  }

  deletePlayer(intIndex : any){
    let arrPlayers =  this.objUserCreateForm.get('players') as FormArray
    arrPlayers.removeAt(intIndex)
    this.objChRef.markForCheck();
  }

  createUsers(){
    this.blnShowSpinner = true;
    if(this.objUserCreateForm.valid){
      this.objPlayersService.createPlayers(this.objUserCreateForm.value.players).pipe(takeUntil(this.objDestroyed$)).subscribe({
        next : () => {
          this.objCommonService.showSuccess("Players added successfully");
          this.blnShowSpinner = false;
          this.openCloseModal(1)
        },
        error : () => {
          this.objCommonService.showError("Operation failed")
          this.blnShowSpinner = false;
        }
      })
    }
  }

}
