import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppConstants } from 'src/app/app.constants';
import { passwordMatchValidator } from 'src/app/shared/functions/common.validators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class RegisterComponent  implements OnDestroy {

  private objDestroyed$ = new Subject();

  blnShowSpinner: boolean = false;
  blnEmailExist: boolean = false;

  constructor(
    private objFormBuilder: FormBuilder,
    private objUserService: UserService,
    private objCommonService: CommonService,
    private objRouter: Router,
    private objChRef : ChangeDetectorRef
  ) { }

  ngOnDestroy() {
    this.objDestroyed$.next(void 0);
    this.objDestroyed$.complete();
  }

  // Create a FormGroup with email, name, password, and cPassword (confirm password) form controls,
  // each with their own set of validators. The form group also has a validator to check if the password and confirm password fields match.
  objRegisterForm = this.objFormBuilder.group({
    email: ['', [Validators.required, Validators.pattern(AppConstants.EMAIL_REGEX)]],
    name: ['', [Validators.required, Validators.pattern(AppConstants.NAME_REGEX), Validators.minLength(3), Validators.maxLength(50)]],
    password: ['', [Validators.required, Validators.pattern(AppConstants.PASSWORD_REGEX), Validators.minLength(8), Validators.maxLength(16)]],
    cPassword: ['', [Validators.required]]
  }, { validator: passwordMatchValidator });


  registerUser() {
    // Set the emailExist flag to false.
    this.blnEmailExist = false;

    // Check if the form is valid.
    if (this.objRegisterForm.valid) {
      // Show the spinner while the request is being processed.
      this.blnShowSpinner = true;

      // Create the payload to send to the server.
      const payload = {
        email: this.objRegisterForm.value.email,
        name: this.objRegisterForm.value.name,
        password: this.objRegisterForm.value.password
      }

      // Send the register request to the server.
      this.objUserService.createUser(payload).pipe(takeUntil(this.objDestroyed$)).subscribe({
        // On success, hide the spinner, show a success message, and redirect to the login page.
        next: () => {
          this.blnShowSpinner = false;
          this.objCommonService.showSuccess('Registration Success');
          this.objRouter.navigate(['/login']);
        },
        // On error, hide the spinner, set the emailExist flag to true, show an error message, and mark the email form control as pristine.
        error: () => {
          this.blnShowSpinner = false;
          this.blnEmailExist = true;
          this.objCommonService.showError('Registration failed');
          this.objRegisterForm.controls['email'].markAsPristine();
          this.objChRef.markForCheck();
        }
      });
    }
  }
}
