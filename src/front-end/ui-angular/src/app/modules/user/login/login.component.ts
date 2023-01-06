import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constants';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  blnShowSpinner : boolean = false;

  constructor(
    private objFormBuilder: FormBuilder,
    private objAuthService: AuthService,
    private objCommonService : CommonService,
    private objRouter : Router
  ) { }

  // create a FormGroup with email and password form controls,
  // each with their own set of validators
  objLoginForm = this.objFormBuilder.group({
    email     : [ '', [Validators.required, Validators.pattern(AppConstants.EMAIL_REGEX)] ],
    password  : ['', [Validators.required]]
  });

  // send a POST request to the login endpoint with the form data
  // if the form is valid
  loginUser() {
    if (this.objLoginForm.valid) {
      this.blnShowSpinner = true;
      this.objAuthService.loginUser(this.objLoginForm.value).subscribe({
        next: () => {
          this.blnShowSpinner = false;
          this.objCommonService.showSuccess('Login Success')
          this.objRouter.navigate(['/'])
        },
        error: () => {
          this.blnShowSpinner = false;
          this.objCommonService.showError('Invalid Credentials')
        }
      });
    }
  }


}
