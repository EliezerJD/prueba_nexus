import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  // Variables para almacenar el nombre de usuario y la contraseña
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {}

  async simulateLogin(): Promise<void> {
    try {
      // Llama al método de inicio de sesión en AuthService y espera el resultado
      const success = await this.authService.login(this.username, this.password);
      if (success) {
        // Si el inicio de sesión es exitoso, redirige a la página principal
        this.router.navigate(['/app']);
      }
    } catch (error) {
      // Manejo de errores en caso de que falle el inicio de sesión
      console.log('Login failed:', error);
    }
  }

  simulateLogout(): void {
    // Llama al método de cierre de sesión en AuthService
    this.authService.logout();
  }

  goToApp(): void {
    // Redirige a la página principal (app) directamente
    this.router.navigate(['/app']); 
  }
}