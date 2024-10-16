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
    this.isLoggedInSubject.next(this.token !== null);
  }

  login(): boolean {
    this.token = 'tokenSimulado';
    localStorage.setItem('authToken', this.token);
    this.isLoggedInSubject.next(true);
    return true;
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
    return this.token !== null;
  }
}
