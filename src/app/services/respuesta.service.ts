import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RespuestaService {

  constructor() { }

  manejoRespuesta = (error: unknown) :string => {
    const errorConvertido = (error as HttpErrorResponse);

    if(errorConvertido.status == 0){
      return 'No se pudo conectar con el servidor. Intente más tarde.';
    }

    if(errorConvertido.status == 400){
      return 'Complete todos los campos.';
    }

    if(errorConvertido.status >= 500){
      return 'Error interno del servidor. Comuníquese con soporte.';
    }

    return errorConvertido.error.mensaje;
  }
}
