import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);

  const usuario = authService.obtenerUsuario();

  const reqNueva = req.clone({
    setHeaders: {
      'Authorization': `Bearer ${usuario?.token}`,
    }
  })

  return next(reqNueva);
};
