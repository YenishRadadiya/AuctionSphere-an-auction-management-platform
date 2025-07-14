import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, ActivatedRoute, Router } from '@angular/router';

import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { AuthenticationService } from '../../services/user-auth/authentication.service';
import { ResetPasswordFormData } from '../../models/auth.model';
import { ToastService } from '../../../../shared/service/toast/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    ButtonModule,
    RouterOutlet,
    DividerModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isSubmitting = false;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private toast: ToastService
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // console.log('Reset Password Component Initialized');

    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      // console.log('Encoded token received:', this.token);
    });
  }

  handleInvalidToken(message: string): void {
    // Optionally navigate away after a delay
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 5000);
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      return;
    }
    console.log('Submit clicked')
    this.isSubmitting = true;

    const newPassword = this.resetForm.get('password')?.value;

    // Send the encodedData directly with the new password
    this.authService.resetPassword({ token: this.token, newPassword } as ResetPasswordFormData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.toast.showSuccess('Password reset successful');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.isSubmitting = false;
        const errorMsg = error?.error?.message || 'An unexpected error occurred';
        this.toast.showError(errorMsg);
      }
    });

  }
}