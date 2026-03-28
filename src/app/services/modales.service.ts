import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import 'sweetalert2/themes/bootstrap-5.css'

@Injectable({
  providedIn: 'root'
})
export class ModalesService {

  constructor() { }

  private router = inject(Router)
  private mostrarModal = new BehaviorSubject<boolean>(false);
  private mostrarModalObservable = this.mostrarModal.asObservable();

  modalTokenExpiradoOError(err: any){
    let error = '';
        (err.message.includes('validar_token')) 
          ? error = 'Token expirado o inexistente. Inicie sesion nuevamente.'
          : error = err.message 
    
    Swal.fire({
      icon: 'warning',
      text: error
    }).then(result => {
      if(result.isConfirmed){
        this.router.navigate(['/ingresar']);
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

  modalMultiplesErrores(err: any){
    const errores = Object.values(err.error.errors).flat();
    Swal.fire({
      icon: 'error',
      html: `
        <ul style="list-style: none;">
          ${errores.map((e: any) => `<li>${e}</li>`).join('')}
        </ul>
      `,
      confirmButtonText: 'Ok'
    })
  }

  modalCerrarSesion(){
    Swal.fire({
      icon: 'question',
      text: '¿Seguro que desea cerrar la sesión?',
      denyButtonText: 'No',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if(result.isConfirmed){
        Swal.fire({
          icon: 'success',
          text: 'Sesión cerrada exitosamente.',
          confirmButtonText: 'OK'
        })
        this.router.navigate(['/ingresar']);
      }
    })
  }

}
