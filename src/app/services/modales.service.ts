import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import 'sweetalert2/themes/bootstrap-5.css'
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ModalesService {

  constructor() { }

  private router = inject(Router)
  private authService = inject(AuthService);

  modalError(err: any){
    const error: string[] = Object.values(err.error.errors).flat() as string[];

    const mensajes: string[] = [];

    (error.toString().includes('The token is expired'))
      ? mensajes.push('Token expirado o inexistente, inicie sesión nuevamente')
      : mensajes.push(...error);

    Swal.fire({
      icon: 'error',
      html: `
        <ul style="list-style: none;">
          ${mensajes.map((e: string) => `<li>${e}</li>`).join('')}
        </ul>
      `,
      confirmButtonText: 'Ok'
    }).then(result => {
      if(result.isConfirmed){
        if(mensajes.toString().includes('Token expirado')){
          this.authService.limpiarLocalstorage();
          this.router.navigate(['/ingresar']);
        }
      }
    })
  }

  modalExitoso(mensaje: string){
    Swal.fire({
      icon: 'success',
      text: mensaje,
      confirmButtonText: 'Ok'
    })
  }

  modalCerrarSesion(){
    Swal.fire({
      icon: 'question',
      text: '¿Seguro que desea cerrar la sesión?',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if(result.isConfirmed){
        Swal.fire({
          icon: 'success',
          text: 'Sesión cerrada exitosamente.',
          confirmButtonText: 'OK'
        }).then(result => {
          if(result.isConfirmed){
            this.authService.limpiarLocalstorage();
            this.router.navigate(['/ingresar']);
          }
        }).finally(() => setTimeout(() => { window.location.reload() }, 100))
      }
    })
  }
}
