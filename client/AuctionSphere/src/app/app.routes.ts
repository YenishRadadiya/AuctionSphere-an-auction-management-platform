import { Routes } from '@angular/router';
import { LoginComponent } from './features/user-auth/pages/login/login.component';
import { SignupComponent } from './features/user-auth/pages/signup/signup.component';
import { ForgotPasswordComponent } from './features/user-auth/pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/user-auth/pages/reset-password/reset-password.component';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'user', children: [
            { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
            { path: 'signup', component: SignupComponent, canActivate: [guestGuard] },
            { path: 'forgot', component: ForgotPasswordComponent, canActivate: [guestGuard] },
            // No guard for reset-password so it's always accessible with a token
            { path: 'reset-password', component: ResetPasswordComponent },
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ],
    },
    { path: '', redirectTo: 'user/login', pathMatch: 'full' },
    { path: '**', redirectTo: 'user/login' }
];