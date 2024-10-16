import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorage.clear(); // Asegúrate de que localStorage esté limpio antes de cada prueba
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully and set token in localStorage', () => {
    const result = service.login(); // Llama al método login

    expect(result).toBe(true); // Verifica que el resultado sea true
    expect(localStorage.getItem('authToken')).toBe('tokenSimulado'); // Verifica que el token se haya establecido en localStorage

    // Verifica que isLoggedInSubject emita true
    service.isLoggedIn$.subscribe(isLoggedIn => {
      expect(isLoggedIn).toBe(true); // Verifica que isLoggedInSubject haya emitido true
    });
  });

  it('should logout successfully and remove token from localStorage', () => {
    service.login(); // Llama al login para establecer el token
    service.logout(); // Llama al método logout

    expect(service['token']).toBeNull(); // Verifica que el token sea null
    expect(localStorage.getItem('authToken')).toBeNull(); // Verifica que el token se haya eliminado de localStorage

    // Verifica que isLoggedInSubject emita false
    service.isLoggedIn$.subscribe(isLoggedIn => {
      expect(isLoggedIn).toBe(false); // Verifica que isLoggedInSubject haya emitido false
    });
  });

  it('should return null when no token is set', () => {
    const token = service.getToken(); // Llama al método getToken
    expect(token).toBeNull(); // Verifica que el token sea null
  });

  it('should return the token when it is set', () => {
    service.login(); // Llama al método login para establecer el token
    const token = service.getToken(); // Llama al método getToken
    expect(token).toBe('tokenSimulado'); // Verifica que el token sea 'tokenSimulado'
  });

  it('should return false after logout', () => {
    service.login(); // Establece el token
    service.logout(); // Llama al método logout para eliminar el token
    const isLoggedIn = service.isLoggedIn(); // Llama al método isLoggedIn
    expect(isLoggedIn).toBeFalse(); // Verifica que el valor devuelto sea false
  });
});
