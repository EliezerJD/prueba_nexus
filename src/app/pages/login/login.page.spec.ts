import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    // Crear mocks para AuthService y Router
    authServiceMock = jasmine.createSpyObj('AuthService', ['login', 'logout']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login and navigate to /app on successful login', () => {
    // Configurar el mock para que devuelva true al llamar a login
    authServiceMock.login.and.returnValue(true);

    component.simulateLogin();

    expect(authServiceMock.login).toHaveBeenCalled(); // Verifica que login haya sido llamado
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app']); // Verifica que navegue a /app
  });

  it('should call authService.logout', () => {
    component.simulateLogout();

    expect(authServiceMock.logout).toHaveBeenCalled(); // Verifica que logout haya sido llamado
  });

  it('should navigate to /app when goToApp is called', () => {
    component.goToApp();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/app']); // Verifica que navegue a /app
  });
});
