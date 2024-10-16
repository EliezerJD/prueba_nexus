import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  // Método para determinar si una ruta puede ser activada
  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const token = this.authService.getToken(); // Obtiene el token del servicio
    const isLoggedIn = token !== null && !this.authService.isTokenExpired(token); // Verifica si el usuario está autenticado y si el token no ha expirado

    if (!isLoggedIn) {
      // Si el usuario no está autenticado o el token ha expirado, muestra alerta y redirige a la página de login
      await this.showAlert();
      this.router.navigate(['/login']); // Redirección a la página de login
      return false; // Bloquea el acceso a la ruta
    }
    return true; // Permite el acceso si el usuario está autenticado y el token es válido
  }

  // Método para mostrar una alerta informando que la autenticación es requerida
  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Acceso Restringido',
      subHeader: 'Autenticación Requerida',
      message: 'Debes iniciar sesión para acceder a esta página.',
      buttons: ['OK']
    });

    await alert.present(); // Presenta la alerta en pantalla
  }
}