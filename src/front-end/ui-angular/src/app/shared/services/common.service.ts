import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private objToastr: ToastrService) { }

  private objSpinnerStatus$ = new BehaviorSubject<any>(false);

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

  //get and set functions for common spinner status obeservable
  get getSpinnerStatus(){
    return this.objSpinnerStatus$.asObservable()
  }
  setSpinnerStatus(blnStatus : boolean){
    this.objSpinnerStatus$.next(blnStatus);
  }
}
