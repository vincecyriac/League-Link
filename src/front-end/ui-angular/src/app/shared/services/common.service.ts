import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private objUserData$ = new BehaviorSubject<any>({});

  constructor(private objToastr: ToastrService) { }

  // show a success toast with the given message
  showSuccess(message: string) {
    this.objToastr.success(message);
  }

  // show an error toast with the given message
  showError(message: string) {
    this.objToastr.error(message);
  }

  // show a warning toast with the given message
  showWarning(message: string) {
    this.objToastr.warning(message);
  }

  // clear all toasters
  clearToastrs() {
    this.objToastr.clear();
  }

}
