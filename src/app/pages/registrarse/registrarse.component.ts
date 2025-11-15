import { Component, inject, ViewChild, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { CrearUsuarioDto } from '../../interfaces/crear-usuario-dto.interface';
import { FormsModule } from '@angular/forms';
import { ModalNormalComponent } from '../../shared/modal-normal/modal-normal.component';
import { RespuestaService } from '../../services/respuesta.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrarse',
  imports: [RouterLink, FormsModule, ModalNormalComponent, CommonModule],
  templateUrl: './registrarse.component.html',
  styles: ``
})
export default class RegistrarseComponent {

  private router = inject(Router);
  private respuestasService = inject(RespuestaService);

  @ViewChild('modalError') modalError!: ModalNormalComponent;
  @ViewChild('modalRegistroExitoso') modalRegistroExitoso!: ModalNormalComponent;

  mensajeRegistroExitoso = '';
  mensajeErrorTryCatch = '';
  multiplesErrores: string[] = [];
  isRegistrando = false;


  usuario: CrearUsuarioDto = {
    primerNombre: null,
    primerApellido: null,
    cedula: null,
    nombreUsuario: null,
    correo: null,
    fechaNacimiento: null,
    contrasena: null,
    aceptaTerminos: null
  }

  private usuarioService = inject(UsuarioService);

  crear = async (): Promise<void> => {
    try {

      const errores = this.validarCrearUsuario(this.usuario);

      if (errores.length > 0) {
        this.multiplesErrores = errores;
        this.modalError.abrir();
        return;
      }

      this.isRegistrando = true;

      const res = await this.usuarioService.agregar(this.usuario);

      this.mensajeRegistroExitoso = res.mensaje;
      this.modalRegistroExitoso.abrir();

    } catch (error) {
      this.isRegistrando = false;
      this.mensajeErrorTryCatch = this.respuestasService.manejoRespuesta(error);
      this.modalError.abrir();
    }
  }

  cerrarModalYRedireccionar = () => {
    this.modalRegistroExitoso.cerrar();
    this.mensajeRegistroExitoso = '';
    this.isRegistrando = false;
    this.router.navigate(['/ingresar']);
  }

  validarCrearUsuario(model: CrearUsuarioDto): string[] {
    const errores: string[] = [];

    if (!model.primerNombre || model.primerNombre.trim() === '') {
      errores.push("El primer nombre es obligatorio.");
    }

    if (!model.primerApellido || model.primerApellido.trim() === '') {
      errores.push("El primer apellido es obligatorio.");
    }

    if (!model.cedula || model.cedula <= 0) {
      errores.push("La cédula debe ser un número válido.");
    }

    if (!model.nombreUsuario || model.nombreUsuario.trim() === '') {
      errores.push("El nombre de usuario es obligatorio.");
    }

    if (!model.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(model.correo)) {
      errores.push("El correo electrónico no es válido.");
    }

    if (!model.fechaNacimiento) {
      errores.push("La fecha de nacimiento es obligatoria.");
    }

    if (!model.contrasena || model.contrasena.length < 6) {
      errores.push("La contraseña debe tener al menos 6 caracteres.");
    }

    if (model.aceptaTerminos !== true) {
      errores.push("Debe aceptar los términos y condiciones.");
    }

    return errores;
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
      aceptaTerminos: null
    };
  }


}
