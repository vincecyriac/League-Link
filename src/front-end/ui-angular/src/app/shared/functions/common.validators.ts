import { AbstractControl } from '@angular/forms';

export function passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password');
  const confirmPassword = control.get('cPassword');
  if (!password || !confirmPassword) {
    return null;
  }
  if (password.value !== confirmPassword.value) {
    return { 'passwordMismatch'  : true };
  }

  return null;
}
