import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../../../environment';
import { SignupFormData, LoginFormData, ForgotPasswordFormData, ResetPasswordFormData } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = environment.apiBaseUrl;
  private tokenKey = 'auth_token';
  private userSubject = new BehaviorSubject<any>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public user$ = this.userSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    // this.checkInitialAuth();
  }

  // private checkInitialAuth(): void {
  //   const token = localStorage.getItem(this.tokenKey);
  //   if (token) {
  //     this.validateToken().subscribe(
  //       valid => {
  //         if (valid) {
  //           this.isAuthenticatedSubject.next(true);
  //         } else {
  //           this.logout();
  //         }
  //       },
  //       () => this.logout()
  //     );
  //   }
  // }

  // validateToken(): Observable<boolean> {
  //   const token = localStorage.getItem(this.tokenKey);
  //   if (!token) return of(false);

  //   return this.http.get<any>(`${this.apiUrl}/auth/validate-token`, {
  //     headers: { Authorization: `Bearer ${token}` }
  //   }).pipe(
  //     map(response => {
  //       if (response.user) {
  //         this.userSubject.next(response.user);
  //         return true;
  //       }
  //       return false;
  //     }),
  //     catchError(() => of(false))
  //   );
  // }

  login(credentials: LoginFormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        const token = response.data?.token;
        if (token) {
          localStorage.setItem(this.tokenKey, token);
          this.userSubject.next(response.data?.user); // if user is also in data
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }


  register(userData: SignupFormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, userData);
  }

  forgotPassword(data: ForgotPasswordFormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/forgot-password`, data);
  }

  resetPassword(data: ResetPasswordFormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/reset-password`, data);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  get currentUser(): any {
    return this.userSubject.value;
  }

  get isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
