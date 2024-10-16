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
    private alertController: AlertController // Inyectar AlertController
  ) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const isLoggedIn = this.authService.getToken() !== null;

    if (!isLoggedIn) {
      await this.showAlert();
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Acceso Restringido',
      subHeader: 'Autenticación Requerida',
      message: 'Debes iniciar sesión para acceder a esta página.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
