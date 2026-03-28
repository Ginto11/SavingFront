import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { CrearUsuarioDto } from '../../interfaces/crear-usuario-dto.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModalesService } from '../../services/modales.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import 'sweetalert2/themes/bootstrap-5.css'

@Component({
  selector: 'app-registrarse',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './registrarse.component.html',
  styles: ``
})
export default class RegistrarseComponent {
  
  private router = inject(Router);
  private modalesService = inject(ModalesService);
  private usuarioService = inject(UsuarioService);
  private onDestroy: Subject<boolean> = new Subject();

  isRegistrando = false;


  usuario: CrearUsuarioDto = {
    primerNombre: null,
    primerApellido: null,
    cedula: null,
    nombreUsuario: null,
    correo: null,
    fechaNacimiento: null,
    contrasena: null,
    aceptaTerminos: false 
  }

  crear = () => {
    if(this.usuario.cedula == null || this.usuario.fechaNacimiento == null){
      this.usuario.cedula = 0;
      this.usuario.fechaNacimiento = new Date().toISOString().split('T')[0];
    }

    this.isRegistrando = true;
    this.usuarioService.agregar(this.usuario)
      .pipe(takeUntil(this.onDestroy))
      .subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            text: res.mensaje,
            confirmButtonText: 'Ok'
          }).then(result => {
            if(result.isConfirmed){
              Swal.fire({
                icon: 'question',
                text: '¿Desea iniciar sesión?',
                confirmButtonText: 'Si',
                cancelButtonText: 'Cancelar'
              }).then(result => {
                if(result.isConfirmed){
                  this.limpiarModelo();
                  this.isRegistrando = false;
                  if(result.isConfirmed){ this.router.navigate(['/ingresar'])} 
                } 
              })
            }
          })
        },
        error: (err) => {
          this.isRegistrando = false;
          this.limpiarModelo();
          this.modalesService.modalError(err);
        }
      })
  }

  limpiarModelo() {
    this.usuario = {
      primerNombre: null,
      primerApellido: null,
      cedula: null,
      nombreUsuario: null,
      correo: null,
      fechaNacimiento: null,
      contrasena: null,
      aceptaTerminos: false
    };
  }
}


  

