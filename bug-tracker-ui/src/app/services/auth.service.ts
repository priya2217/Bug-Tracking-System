import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, RegisterRequest } from '../models/user.model';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5245/api/auth';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.username);

        // Extract userId from JWT token if not in response
        if (res.userId) {
          localStorage.setItem('userId', res.userId);
        } else {
          const userId = this.extractUserIdFromToken(res.token);
          if (userId) {
            localStorage.setItem('userId', userId);
          }
        }
      }),
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  private extractUserIdFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // JWT claim for user ID is typically in nameidentifier
      return (
        payload[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ] || null
      );
    } catch {
      return null;
    }
  }

  getUserId(): number {
    const userId = localStorage.getItem('userId');
    return userId ? Number(userId) : 0;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token') && this.getUserId() > 0;
  }

  logout() {
    localStorage.clear();
  }
}
