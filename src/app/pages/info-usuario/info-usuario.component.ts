import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioDto } from '../../interfaces/usuario-dto.interface';
import { UsuarioService } from '../../services/usuario.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { environment } from '../../../environments/environment';
import { ModalNormalComponent } from '../../shared/modal-normal/modal-normal.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-info-usuario',
  imports: [CommonModule, FormsModule, ModalNormalComponent],
  templateUrl: './info-usuario.component.html',
  styles: ``
})
export default class InfoUsuarioComponent implements OnInit{

  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private localstorageService = inject(LocalstorageService);
  
  @ViewChild('ModalActualizar') ModalActualizar!: ModalNormalComponent;
  urlFoto!: string;
  nombre!: string;
  correo!: string;
  usuario: UsuarioDto = {
    id: 0,
    primerNombre: '',
    primerApellido: '',
    cedula: 0,
    correo: '',
    fechaNacimiento: null,
    manejaGastos: false,
    fotoPerfil: '',
    nuevaFoto: null
  };

  fotoNueva!: File;
  edicioModo = false;

  ngOnInit(): void {
    this.obtenerInformacionUsuario();
  }

  obtenerInformacionUsuario(){
    this.authService.usuarioLogueado.subscribe(usuario => {
        if(usuario == null){
          console.log("Error")
          return;
        }

        this.usuarioService.refrescarInformacion(usuario.id);
        this.usuarioService.usuarioObservable.subscribe({ 
          next: (res) => {
            this.usuario = res;
            this.urlFoto = `${environment.URL_SERVER_FOTOS}/${this.usuario.fotoPerfil}`;
            this.nombre = `${this.usuario.primerNombre} ${this.usuario.primerApellido}`
            this.correo = this.usuario.correo;
          },
          error: (err) => console.log(err)  
        })
      }
    )
  }

  seleccionarArchivo(evento: Event){
    const input = evento.target as HTMLInputElement;

    if(input.files && input.files.length > 0){
      this.fotoNueva = input.files[0];
    }
  }

  iniciarEdicion() {
    this.edicioModo = true;
  }

  cancelarEdicion() {
    this.edicioModo = false;
  }

  confirmacion() {
    this.ModalActualizar.abrir();
  }

  actualizarInformacion = () => {

    const id = this.localstorageService.getItem('usuario-saving').id;

    const formData = new FormData();

    formData.append('id', this.usuario.id.toString());
    formData.append('primerNombre', this.usuario.primerNombre);
    formData.append('primerApellido', this.usuario.primerApellido);
    formData.append('cedula', this.usuario.cedula.toString());
    formData.append('correo', this.usuario.correo);
    formData.append('manejaGastos', this.usuario.manejaGastos.toString());

    if (this.usuario.fechaNacimiento) {
      formData.append(
        'fechaNacimiento',
        new Date(this.usuario.fechaNacimiento).toISOString()
    )}

    if (this.fotoNueva) {
      formData.append('nuevaFoto', this.fotoNueva);
    }

    this.usuarioService.actualizar(id, formData).subscribe(res => {
      console.log(res)
      this.usuarioService.refrescarInformacion(id);
    });
    this.edicioModo = false;
    this.ModalActualizar.cerrar();

  }


}
