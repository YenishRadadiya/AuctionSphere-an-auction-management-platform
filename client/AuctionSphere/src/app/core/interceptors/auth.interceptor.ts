import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('auth_token');

        const authReq = token
            ? req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            })
            : req;

        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // 🚫 REMOVE REDIRECTION LOGIC COMPLETELY
                    console.warn('401 error detected. Token may be expired.');
                    // localStorage.removeItem('auth_token');
                    // this.router.navigate(['/login']);
                }
                return throwError(() => error);
            })
        );
    }
}
