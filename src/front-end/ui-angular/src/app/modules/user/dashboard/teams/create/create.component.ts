import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';
import { Subject, takeUntil } from 'rxjs';
import { AppConstants } from 'src/app/app.constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { TeamsService } from 'src/app/shared/services/teams.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent implements OnDestroy {

  private objDestroyed$ = new Subject();

  fileCropperLogo !: any;
  fileCroppedLogo !: any;
  blnShowSpinner: boolean = false;

  objTeamCreateForm = this.objFormBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(AppConstants.NAME_REGEX)]],
    manager: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(AppConstants.NAME_REGEX)]],
    image: ['', [Validators.required]]
  });

  constructor(
    private objCommonService: CommonService,
    private objFormBuilder: FormBuilder,
    private objTeamsService: TeamsService,
    private objChRef: ChangeDetectorRef,
    private objModalService: NgbModal,
    private objActiveModal: NgbActiveModal
  ) { }

  ngOnDestroy() {
    this.objDestroyed$.next(void 0);
    this.objDestroyed$.complete();
  }

  createTeam() {
    if(this.objTeamCreateForm.valid){
      this.blnShowSpinner = true;
      let objPayload = new FormData()
      objPayload.append('name', this.objTeamCreateForm?.value?.name || '');
      objPayload.append('manager', this.objTeamCreateForm.value.manager || '');
      objPayload.append('image', this.fileCroppedLogo);
      this.objTeamsService.createTeam(objPayload).pipe(takeUntil(this.objDestroyed$)).subscribe({
        next : () => {
          this.blnShowSpinner = false;
          this.objCommonService.showSuccess("Team created")
          this.openCloseModal(1)
        },
        error : () => {
          this.blnShowSpinner = false;
          this.objCommonService.showError("Something went wrong")
        }
      })
    }
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

  handleImageSelect(objEvent: any) {
    let selectedFile = objEvent.target.files[0]
    if (objEvent.target.files.length != 1) {
      this.fileCroppedLogo = null;
      this.fileCropperLogo = null;
      return
    }
    else if (!['png', 'jpg', 'jpeg'].includes(selectedFile.name.substr(selectedFile.name.lastIndexOf('.') + 1).toLocaleLowerCase()) || selectedFile.name.length > 225) {
      this.objTeamCreateForm.controls['image'].setErrors({ 'invalidFile': true });
      this.objChRef.markForCheck();
      this.fileCroppedLogo = null;
      this.fileCropperLogo = null;
    }
    else {
      this.fileCropperLogo = objEvent;
    }
  }

  imageCropped(objEvent: any) {
    this.fileCroppedLogo = base64ToFile(objEvent.base64)
  }
}
