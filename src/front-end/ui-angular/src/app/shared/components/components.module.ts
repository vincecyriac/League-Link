import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from './spinner/spinner.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';



@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    SpinnerComponent,
    ConfirmModalComponent,
    ImageCropperComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    ImageCropperModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    SpinnerComponent
  ]
})
export class ComponentsModule { }
