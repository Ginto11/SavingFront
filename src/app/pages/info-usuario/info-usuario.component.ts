import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioDto } from '../../interfaces/usuario-dto.interface';
import { UsuarioService } from '../../services/usuario.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { ModalesService } from '../../services/modales.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-info-usuario',
  imports: [CommonModule, FormsModule],
  templateUrl: './info-usuario.component.html',
  styles: ``
})
export default class InfoUsuarioCompPonent implements AfterViewInit{

  private authService = inject(AuthService);
  private modalesService = inject(ModalesService);
  private usuarioService = inject(UsuarioService);
  private onDestroy: Subject<boolean> = new Subject();
  private localstorageService = inject(LocalstorageService);
  
  private URL = environment.URL_SERVER_FOTOS;

  urlFoto: string = '/Uploads/Fotos/default.png';
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

  ngAfterViewInit(): void {
    this.obtenerInformacionUsuario();
  }

  obtenerInformacionUsuario(){
    this.authService.validarToken()
    .pipe(takeUntil(this.onDestroy))
    .subscribe({
      next: () => {
        this.authService.usuarioLogueado.subscribe(usuario => {
            this.usuarioService.refrescarInformacion(usuario!.id);
            this.usuarioService.usuarioObservable.subscribe({ 
              next: (res) => {
                this.usuario = res;
                this.urlFoto = `${this.URL}/${this.usuario.fotoPerfil}`;
                this.nombre = `${this.usuario.primerNombre} ${this.usuario.primerApellido}`
                this.correo = this.usuario.correo;
              },
              error: (err) => this.modalesService.modalError(err)
            })
          }
        )
      },
      error: (err) => {
        this.modalesService.modalError(err);
      }
    })
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
    Swal.fire({
      icon: 'question',
      text: '¿Segur@ que desea actualizar?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, continuar'
    }).then(result => {
      if(result.isConfirmed){
        this.actualizarInformacion();
        Swal.fire({
          icon:'success',
          text: 'Registro actualizado exitosamente.',
          confirmButtonText: 'Ok'
        })
      }
    })
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

  }


}
