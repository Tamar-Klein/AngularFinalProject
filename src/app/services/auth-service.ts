import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.models';
import { AuthResponse } from '../models/authResponse.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = "http://localhost:3000/api/auth";
  private http = inject(HttpClient);

  private _currentUser = signal<User | null>(
    JSON.parse(sessionStorage.getItem('user') || 'null')
  );

  currentUser= this._currentUser.asReadonly();

  register(userData: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('user', JSON.stringify(response.user));

        this._currentUser.set(response.user);
      })
    );
  }
  login(credentials: { email: string, password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('user', JSON.stringify(response.user));

        this._currentUser.set(response.user);
      })
    );
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
   this._currentUser.set(null);
   
  }

readonly isLoggedIn = computed(() => !!this._currentUser());

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
}
