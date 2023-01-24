import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { base64ToFile } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent {

  @Input() fileCropperLogo !: any;
  fileCroppedLogo !: any;

  constructor(
    private objActiveModal: NgbActiveModal
    ) { }

  imageCropped(objEvent: any) {
    this.fileCroppedLogo = base64ToFile(objEvent.base64)
  }
  openCloseModal(intStatus: number) {
    // Check if intStatus is 1
    if (intStatus == 1) {
      // Close the modal and pass a value 2
      this.objActiveModal.close(this.fileCroppedLogo);
    } else {
      // Dismiss the modal
      this.objActiveModal.dismiss("Cancelled");
    }
  }

}
