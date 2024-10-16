import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

class MockAuthService {
  getToken() {
    return null; // Cambia a un valor no nulo para simular un usuario autenticado
  }
}

class MockRouter {
  navigate() {}
}

class MockAlertController {
  create() {
    return {
      present: () => Promise.resolve(),
    };
  }
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;
  let alertController: AlertController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
        { provide: AlertController, useClass: MockAlertController },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    alertController = TestBed.inject(AlertController);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when authenticated', async () => {
    // Simula que el usuario está autenticado
    spyOn(authService, 'getToken').and.returnValue('mockToken'); // Token simulado

    // Crea instancias simuladas de ActivatedRouteSnapshot y RouterStateSnapshot
    const activatedRouteSnapshot = new ActivatedRouteSnapshot();
    const routerStateSnapshot: RouterStateSnapshot = {} as any;

    const result = await guard.canActivate(activatedRouteSnapshot, routerStateSnapshot);
    expect(result).toBeTrue(); // Debe permitir el acceso
  });

  it('should deny access and navigate to login when not authenticated', async () => {
    // Simula que el usuario no está autenticado
    spyOn(authService, 'getToken').and.returnValue(null);

    const navigateSpy = spyOn(router, 'navigate');
    const alertSpy = spyOn(alertController, 'create').and.callThrough(); // Llama a la implementación real

    // Crea instancias simuladas de ActivatedRouteSnapshot y RouterStateSnapshot
    const activatedRouteSnapshot = new ActivatedRouteSnapshot();
    const routerStateSnapshot: RouterStateSnapshot = {} as any;

    const result = await guard.canActivate(activatedRouteSnapshot, routerStateSnapshot);
    expect(result).toBeFalse(); // No debe permitir el acceso
    expect(navigateSpy).toHaveBeenCalledWith(['/login']); // Debe navegar a la página de login
    expect(alertSpy).toHaveBeenCalled(); // Debe crear el alert
  });
});
