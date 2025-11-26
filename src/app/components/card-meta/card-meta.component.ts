import { Component, inject, Input, ViewChild } from '@angular/core';
import { Meta } from '../../interfaces/meta.interface';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MetaAhorroService } from '../../services/meta-ahorro.service';
import { ModalNormalComponent } from '../../shared/modal-normal/modal-normal.component';
import { FormsModule } from '@angular/forms';
import { ActualizarMetaDto } from '../../interfaces/actualizar-meta-dto.interface';

@Component({
  selector: 'app-card-meta',
  imports: [CommonModule, ModalNormalComponent, FormsModule],
  templateUrl: './card-meta.component.html',
  styles: ``
})
export class CardMetaComponent {

  private auhService = inject(AuthService);
  private metaAhorroService = inject(MetaAhorroService);

  @ViewChild('modalConfirmCancelar') modalConfirmCancelar = new ModalNormalComponent(); 
  @ViewChild('modalActualizacion') modalActualizacion = new ModalNormalComponent();
  @ViewChild('modalMensaje') modalMensaje = new ModalNormalComponent();
  @ViewChild('modalError') modalError = new ModalNormalComponent();

  @Input() meta!: Meta;

  metaPorActualizar: ActualizarMetaDto = {
    nombre: '',
    montoObjetivo: 0
  };

  mensajeError = '';
  mensajeModal = '';
  metaIdSeleccionado = 0;
  multiplesErrores = [];


  abrirConfirmModal(id: number):void{
    this.metaIdSeleccionado = id;
    this.mensajeModal = '¿Seguro que deseas cancelar la meta?'
    this.modalConfirmCancelar.abrir();
  }

  cerrarConfirmModal():void {
    this.metaIdSeleccionado = 0;
    this.modalConfirmCancelar.cerrar();
  }

  abrirModalActualizacion(meta: Meta):void{
    this.metaIdSeleccionado = meta.id;
    this.metaPorActualizar = {
      nombre: meta.nombre,
      montoObjetivo: meta.montoObjetivo
    }
    this.modalActualizacion.abrir();
  }

  actualizar = ():void => {
    this.auhService.usuarioLogueado.subscribe(usuario => {
      if(usuario == null){
        this.mensajeError = 'Usuario no logueado';
        this.modalError.abrir();
        return;
      }

      this.metaAhorroService.actualizarMeta(this.metaIdSeleccionado, this.metaPorActualizar).subscribe({
        next: (res) => {
          this.metaAhorroService.refrescarInformacion(usuario.id);
          this.mensajeModal = res.data;
          this.modalActualizacion.cerrar();
          this.mensajeModal = res.data;
          this.modalMensaje.abrir();
        },
        error: (err) => {
          console.log(err);
        }
      })
    })
  }


  cancelarMeta = ():void => {
    this.auhService.usuarioLogueado.subscribe(usuario => {
      if(usuario == null){
        this.mensajeError = 'Usuario no logueado';
        this.modalError.abrir();
        return;
      }

      this.metaAhorroService.cancelarMetaPorId(this.metaIdSeleccionado).subscribe({
        next: (res) => {
          this.metaAhorroService.refrescarInformacion(usuario.id);
          this.mensajeModal = res.data;
          this.cerrarConfirmModal();
          this.modalMensaje.abrir();
        },
        error: (err) => {
          console.log(err);
        }
      })
    })
  }

  cerrarModalYLimpiarVariables():void {
    this.modalError.cerrar();
    this.mensajeError = '';
    this.multiplesErrores = [];
  }

}
