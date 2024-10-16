import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service'; // Ajusta la ruta si es necesario

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = new AuthService(); 
  
  const token = authService.getToken();

  if (token) {
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(clonedRequest);
  } else {
    return next(req);
  }
};
