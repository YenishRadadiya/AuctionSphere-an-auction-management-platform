import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';




@Injectable({
  providedIn: 'root'
})
export class PasswordValidatorService {

  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      return pattern.test(value) ? null : {
        weakPassword: 'Password must contain uppercase, lowercase, number, special character and be at least 8 characters long.'
      };
    };
  }

  static matchPasswords(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const form = group as FormGroup;
      const password = form.get(passwordKey)?.value;
      const confirmPassword = form.get(confirmPasswordKey)?.value;

      return password === confirmPassword ? null : { notMatching: true };
    };
  }


}