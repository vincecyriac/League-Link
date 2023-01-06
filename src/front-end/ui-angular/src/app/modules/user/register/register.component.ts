import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constants';
import { passwordMatchValidator } from 'src/app/shared/functions/common.validators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  blnShowSpinner : boolean = false;
  blnEmailExist : boolean = false;

  constructor(
    private objFormBuilder: FormBuilder,
    private objUserService: UserService,
    private objCommonService : CommonService,
    private objRouter : Router
  ) { }

  // create a FormGroup with email and password form controls,
  // each with their own set of validators
  objRegisterForm = this.objFormBuilder.group({
    email     : [ '', [Validators.required, Validators.pattern(AppConstants.EMAIL_REGEX)] ],
    name      : [ '', [Validators.required, Validators.pattern(AppConstants.NAME_REGEX), Validators.minLength(3), Validators.maxLength(50)] ],
    password  : [ '', [Validators.required, Validators.pattern(AppConstants.PASSWORD_REGEX), Validators.minLength(8), Validators.maxLength(16)]],
    cPassword : [ '', [Validators.required]]
  }, { validator: passwordMatchValidator });

  // send a POST request to the register endpoint with the form data
  // if the form is valid
  registerUser() {
    this.blnEmailExist = false;
    if (this.objRegisterForm.valid) {
      this.blnShowSpinner = true;
      const payload = {
        email     : this.objRegisterForm.value.email,
        name      : this.objRegisterForm.value.name,
        password  : this.objRegisterForm.value.password
      }
      this.objUserService.createUser(payload).subscribe({
        next: () => {
          this.blnShowSpinner = false;
          this.objCommonService.showSuccess('Registration Success')
          this.objRouter.navigate(['/login'])
        },
        error: () => {
          this.blnShowSpinner = false;
          this.blnEmailExist = true;
          this.objCommonService.showError('Registration failed')
          this.objRegisterForm.controls['email'].markAsPristine()
        }
      });
    }
  }

}
