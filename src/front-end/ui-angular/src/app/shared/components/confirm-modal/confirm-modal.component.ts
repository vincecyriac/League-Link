import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {

  @Input() strMessage!: string;
  @Input() strClass!: string;

  constructor(
    public objActiveModal: NgbActiveModal,
  ) { }

  openCloseModal(intStatus: number) {
    if (intStatus == 1)
      this.objActiveModal.close(1)
    else
      this.objActiveModal.dismiss()
  }

}
