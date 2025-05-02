import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

import { AuthenticationService as AuthService } from '../../services/user-auth/authentication.service';
import { ToastService } from '../../../../shared/service/toast/toast.service';
import { LoginFormData } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule, RouterLink, RouterOutlet
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService // Inject ToastService
  ) { }

  ngOnInit(): void { }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      this.authService.login(this.loginForm.value as LoginFormData).subscribe({
        next: (res) => {
          this.isLoading = false;
          // Success toast notification using ToastService
          this.toastService.showSuccess(res.message || 'Login successful!');
          // Redirect to dashboard or home page
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          // Error toast notification using ToastService
          this.toastService.showError(err.error?.message || 'Login failed. Please try again.');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
