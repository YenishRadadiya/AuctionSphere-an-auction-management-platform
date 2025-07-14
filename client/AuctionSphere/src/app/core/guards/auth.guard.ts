// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../features/user-auth/services/user-auth/authentication.service';
import { map, take } from 'rxjs/operators';

export const authGuard = () => {
    const router = inject(Router);
    const authService = inject(AuthenticationService);

    return authService.isAuthenticated$.pipe(
        take(1),
        map(isAuthenticated => {
            if (isAuthenticated) {
                return true;
            } else {
                router.navigate(['/user/login']);
                return false;
            }
        })
    );
};

export const guestGuard = () => {
    const router = inject(Router);
    const authService = inject(AuthenticationService);

    return authService.isAuthenticated$.pipe(
        take(1),
        map(isAuthenticated => {
            if (!isAuthenticated) {
                return true;
            } else {
                router.navigate(['/dashboard']);
                return false;
            }
        })
    );
};