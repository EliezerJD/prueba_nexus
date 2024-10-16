import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
    this.isLoggedInSubject.next(this.token !== null && !this.isTokenExpired(this.token));
  }

  login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Simulación de llamada a API
      setTimeout(() => {
        // Simulando respuesta del backend
        const response = {
          token: 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkFkbWluIiwiZXhwIjoxNzgxNjMxOTE3LCJpYXQiOjE3MjkxMDA3MTd9.p8rsmwDCRVmopa2pCmFeDqLsgzyaUiyQVBhskM-hLh8',
        };

        if (response.token) {
          this.token = response.token;
          localStorage.setItem('authToken', this.token);
          this.isLoggedInSubject.next(true);
          resolve(true);
        } else {
          reject('Error en la autenticación');
        }
      }, 1000);
    });
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    this.isLoggedInSubject.next(false);
  }

  getToken(): string | null {
    return this.token;
  }

  isLoggedIn(): boolean {
    return this.token !== null && !this.isTokenExpired(this.token);
  }

  isTokenExpired(token: string): boolean {
    const payload = this.getPayload(token);
    if (!payload) return true; // Si no hay payload, consideramos que ha expirado
    const expiry = payload.exp;
    return (Math.floor((new Date()).getTime() / 1000)) >= expiry;
  }

  private getPayload(token: string): any | null {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null; // El token no es válido
    }
    const payload = parts[1];
    const decoded = atob(payload); // Decodifica la parte del payload
    return JSON.parse(decoded); // Devuelve el payload como objeto
  }
}
