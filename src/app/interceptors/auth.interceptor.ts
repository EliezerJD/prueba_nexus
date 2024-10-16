import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

// Define el interceptor que agrega el token de autorización a las solicitudes HTTP
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = new AuthService(); // Crea una instancia de AuthService para acceder al token

  const token = authService.getToken(); // Obtiene el token de autenticación del servicio

  if (token) {
    // Si hay un token presente, clona la solicitud original y agrega el encabezado de autorización
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`) // Agrega el token en el encabezado de la solicitud
    });

    return next(clonedRequest); // Envía la solicitud clonada con el token
  } else {
    // Si no hay token, continúa con la solicitud original sin modificarla
    return next(req);
  }
};
