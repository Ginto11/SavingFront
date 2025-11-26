import { Component, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioLogin } from '../../interfaces/usuario-login.interface';
import { FormsModule } from '@angular/forms';
import { ServerResponse } from '../../interfaces/server-response.interface';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RespuestaService } from '../../services/respuesta.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { ModalNormalComponent } from '../../shared/modal-normal/modal-normal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ingresar',
  imports: [RouterLink, FormsModule, ModalNormalComponent, CommonModule],
  templateUrl: './ingresar.component.html',
  styles: ``
})
export default class IngresarComponent {

  private authService = inject(AuthService);
  private respuestaService = inject(RespuestaService);
  @ViewChild('modal') modal!: ModalNormalComponent;

  mensajeErrorModal = '';
  isIngresando = false;

  usuario: UsuarioLogin = {
    usuario: '',
    contrasena: ''
  }

  ingresar(): void {
    this.isIngresando = true;
    this.authService.login(this.usuario).subscribe({
      next: () => this.isIngresando = true,
      error: (err) => {
        this.isIngresando = false;
        this.mensajeErrorModal = this.respuestaService.manejoRespuesta(err);
        this.modal.abrir();
      }
    })
  }
}
