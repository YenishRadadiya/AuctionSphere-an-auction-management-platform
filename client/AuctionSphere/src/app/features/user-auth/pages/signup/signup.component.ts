import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToastService } from '../../../../shared/service/toast/toast.service';

import { AuthenticationService as AuthService } from '../../services/user-auth/authentication.service';
import { PasswordValidatorService } from '../../services/password-service/password-validator.service';
import { SignupFormData } from '../../models/auth.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    DividerModule,
    ToastModule,
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private toastService: ToastService
  ) { }

  signupForm = new FormGroup({
    username: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]+$/),
      ],
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        PasswordValidatorService.strongPassword()
      ]
    }),
    confirmPassword: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  }, [PasswordValidatorService.matchPasswords('password', 'confirmPassword')]);

  isLoading = false;

  ngOnInit(): void { }

  onSubmit() {
    delete this.signupForm.value.confirmPassword;
    if (this.signupForm.valid) {
      this.isLoading = true;

      this.authService.register(this.signupForm.value as SignupFormData).subscribe({
        next: (res) => {
          this.isLoading = false;
          // Success toast notification using ToastService
          this.toastService.showSuccess(res.message || 'Signup successful! You can now log in.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          // Error toast notification using ToastService
          this.toastService.showError(err.error?.message || 'Signup failed. Please try again.');
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

}
