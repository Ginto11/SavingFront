import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ModalesService } from '../services/modales.service';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const modalesService = inject(ModalesService);

  return next(req).pipe(catchError((err: any) => {

    if(err.status == 401){
      const errors = { 'Error:': ['Token expirado o inexistente, inicie sesión nuevamente'] }
      const error = { errors }
      err.error = error;
    }
    modalesService.modalError(err);

    return throwError(() => err)
  }))
};


