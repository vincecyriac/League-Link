import { AbstractControl } from '@angular/forms';

// Custom validator function to check if the password and confirm password fields in a form match.
export function passwordMatchValidator(control: AbstractControl) {
  // Get the password and confirm password form controls.
  const password = control.get('password');
  const confirmPassword = control.get('cPassword');

  // If either of the form controls is missing, return null.
  if (!password || !confirmPassword) {
    return null;
  }

  // If the password and confirm password values do not match, return an error object.
  if (password.value !== confirmPassword.value) {
    return { 'passwordMismatch': true };
  }

  // If the password and confirm password values match, return null.
  return null;
}
