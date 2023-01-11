import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppConstants } from 'src/app/app.constants';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {

  private objDestroyed$ = new Subject();

  blnShowSpinner: boolean = false;

  constructor(
    private objFormBuilder: FormBuilder,
    private objAuthService: AuthService,
    private objCommonService: CommonService,
    private objRouter: Router
  ) { }

  ngOnDestroy() {
    this.objDestroyed$.next(void 0);
    this.objDestroyed$.complete();
  }

  // Create a FormGroup with email and password form controls,
  // each with their own set of validators.
  objLoginForm = this.objFormBuilder.group({
    email: ['', [Validators.required, Validators.pattern(AppConstants.EMAIL_REGEX)]],
    password: ['', [Validators.required]]
  });

  // Method to send a POST request to the login endpoint with the form data
  // if the form is valid.
  loginUser() {
    // Check if the form is valid.
    if (this.objLoginForm.valid) {
      // Show the spinner while the request is being processed.
      this.blnShowSpinner = true;

      // Send the login request to the server.
      this.objAuthService.loginUser(this.objLoginForm.value).pipe(takeUntil(this.objDestroyed$)).subscribe({
        // On success, hide the spinner, show a success message, and redirect to the home page.
        next: () => {
          this.blnShowSpinner = false;
          this.objCommonService.showSuccess('Login Success');
          this.objRouter.navigate(['/']);
        },
        // On error, hide the spinner and show an error message.
        error: () => {
          this.blnShowSpinner = false;
          this.objCommonService.showError('Invalid Credentials');
        }
      });
    }
  }



}
