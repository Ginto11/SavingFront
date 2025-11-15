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

  private router = inject(Router);
  private authService = inject(AuthService);
  private localstorage = inject(LocalstorageService);
  private respuestaService = inject(RespuestaService);
  @ViewChild('modal') modal!: ModalNormalComponent;

  mensajeErrorModal = '';
  isIngresando = false;

  usuario: UsuarioLogin = {
    usuario: '',
    contrasena: ''
  }

  ingresar = async ():Promise<void> => {
    try{

      this.isIngresando = true;
      const res = await this.authService.login(this.usuario);

      console.log(res);

      if(res.codigo == 200){

        this.isIngresando = false;
        this.localstorage.setItem('usuario-saving', res.data);

        this.router.navigate(['dashboard']);
      }

    }catch(error){
      this.isIngresando = false;
      console.log(error)
      this.mensajeErrorModal = this.respuestaService.manejoRespuesta(error);
      console.log(this.mensajeErrorModal)
      this.modal.abrir();
    }
  } 
}
