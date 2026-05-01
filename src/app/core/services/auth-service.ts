import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models';
import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user'
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private _currentUser = signal<User | null>(null);

  currentUser = this._currentUser.asReadonly();

  isAuthenticated = computed(() => !!this._currentUser());

  constructor() {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);

    if (token && userStr) {
      try {
        this._currentUser.set(JSON.parse(userStr));
      } catch {
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest) {
    return of({
      token: 'mock-token-' + Date.now(),
      user: {
        id: 1,
        email: credentials.email,
        name: credentials.email.split('@')[0]
      }
    }).pipe(
      delay(1000),
      map((res: AuthResponse) => {
        this.setAuth(res);
        return res;
      })
    );
  }

  register(data: RegisterRequest) {
    return of({
      token: 'mock-token-' + Date.now(),
      user: {
        id: Date.now(),
        email: data.email,
        name: data.name
      }
    }).pipe(
      delay(1000),
      map((res: AuthResponse) => {
        this.setAuth(res);
        return res;
      })
    );
  }

  private setAuth(response: AuthResponse): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
    this._currentUser.set(response.user);
  }

  logout(): void {
    localStorage.clear();
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }
}
