import { Component } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

import { AuthenticationService as AuthService } from '../../services/user-auth/authentication.service';
import { ToastService } from '../../../../shared/service/toast/toast.service';
import { NgIf, NgStyle } from '@angular/common';
import { ForgotPasswordFormData } from '../../models/auth.model';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    RouterOutlet,
    NgIf,
    NgStyle
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  isLoading = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) { }

  onSubmit() {
    if (this.forgotForm.valid) {
      this.isLoading = true;

      // Call the forgotPassword API
      this.authService.forgotPassword(this.forgotForm.value as ForgotPasswordFormData).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.toastService.showSuccess('Password reset link has been sent to your email!');
          this.router.navigate(['/login'])
        },
        error: (err) => {
          this.isLoading = false;
          // Show error message
          this.toastService.showError(err.error?.message || 'Something went wrong. Please try again.');
        }
      });
    } else {
      this.forgotForm.markAllAsTouched();
    }
  }
}
