import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { AppConstants } from 'src/app/app.constants';
import { ImageCropperComponent } from 'src/app/shared/components/image-cropper/image-cropper.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { TeamsService } from 'src/app/shared/services/teams.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy {

  fileCroppedLogo: any = null;
  filePreview !: any;
  blnShowSpinner: boolean = false;
  objTeamDetails: any;

  private objDestroyed$ = new Subject();

  @Input() intTeamId !: number;

  objTeamUpdateForm = this.objFormBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(AppConstants.NAME_REGEX)]],
    manager: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(AppConstants.NAME_REGEX)]],
    image: ['']
  });



  constructor(
    private objCommonService: CommonService,
    private objFormBuilder: FormBuilder,
    private objTeamsService: TeamsService,
    private objChRef: ChangeDetectorRef,
    private objModalService: NgbModal,
    private objActiveModal: NgbActiveModal
    ) { }

    ngOnInit(): void {
    this.getTeamDetails();
  }

  ngOnDestroy() {
    this.objDestroyed$.next(void 0);
    this.objDestroyed$.complete();
  }

  getTeamDetails() {
    this.objTeamsService.getTeamById(this.intTeamId).pipe(takeUntil(this.objDestroyed$)).subscribe({
      next: (objResponse) => {
        this.objTeamDetails = objResponse
        this.objTeamUpdateForm.patchValue(objResponse)
        this.filePreview = objResponse.image_url
        this.objChRef.markForCheck();
      }
    })
  }

  updateTeam() {
    if (this.objTeamUpdateForm.valid) {
      this.blnShowSpinner = true;
      let objPayload = new FormData()
      objPayload.append('name', this.objTeamUpdateForm?.value?.name || '');
      objPayload.append('manager', this.objTeamUpdateForm.value.manager || '');
      objPayload.append('image', this.fileCroppedLogo);
      this.objTeamsService.updateTeam(this.intTeamId, objPayload).pipe(takeUntil(this.objDestroyed$)).subscribe({
        next: () => {
          this.blnShowSpinner = false;
          this.objCommonService.showSuccess("Team updated")
          this.openCloseModal(1)
        },
        error: () => {
          this.blnShowSpinner = false;
          this.objCommonService.showError("Something went wrong")
        }
      })
    }
  }

  handleImageSelect(objEvent: any) {
    this.objTeamUpdateForm.controls['image'].clearValidators();
    this.objTeamUpdateForm.controls['image'].setValidators([Validators.required]);
    this.objTeamUpdateForm.controls['image'].updateValueAndValidity();
    this.fileCroppedLogo = null;
    this.filePreview = null;
    this.objChRef.markForCheck()
    let selectedFile = objEvent.target.files[0]
    if (objEvent.target.files.length != 1) {
      return
    }
    else if (!['png', 'jpg', 'jpeg'].includes(selectedFile.name.substr(selectedFile.name.lastIndexOf('.') + 1).toLocaleLowerCase()) || selectedFile.name.length > 225) {
      this.objTeamUpdateForm.controls['image'].setErrors({ 'invalidFile': true });
      this.objChRef.markForCheck();
    }
    else {
      this.openFileCropModal(objEvent)
    }
  }

  openFileCropModal(fileEvent: any) {
    const modalRef = this.objModalService.open(ImageCropperComponent, { size: 'xl', centered: true });
    modalRef.componentInstance.fileCropperLogo = fileEvent;
    modalRef.result.then((result) => {
      this.fileCroppedLogo = result
      let objFileReader = new FileReader();
      objFileReader.readAsDataURL(result);
      objFileReader.onload = (event) => {
        this.filePreview = objFileReader.result as string;
        this.objChRef.markForCheck();
      }
    }, (reason) => {
      this.fileCroppedLogo = null;
      this.filePreview = null;
      this.objTeamUpdateForm.controls['image'].setValue('')
      this.objChRef.markForCheck();
    });
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

}
