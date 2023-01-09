import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private objToastr: ToastrService) { }

  // Show a success toast with the given message.
  showSuccess(message: string) {
    this.objToastr.success(message);
  }

  // Show an error toast with the given message.
  showError(message: string) {
    this.objToastr.error(message);
  }

  // Show a warning toast with the given message.
  showWarning(message: string) {
    this.objToastr.warning(message);
  }

  // Clear all toasters.
  clearToastrs() {
    this.objToastr.clear();
  }


}
