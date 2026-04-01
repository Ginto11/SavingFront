import { Component, inject, Input, ViewChild } from '@angular/core';
import { Meta } from '../../interfaces/meta.interface';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MetaAhorroService } from '../../services/meta-ahorro.service';
import { FormsModule } from '@angular/forms';
import { ActualizarMetaDto } from '../../interfaces/actualizar-meta-dto.interface';
import Swal from 'sweetalert2';
import 'sweetalert2/themes/bootstrap-5.css';
import { ModalesService } from '../../services/modales.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-card-meta',
  imports: [CommonModule, FormsModule],
  templateUrl: './card-meta.component.html',
  styles: ``,
})
export class CardMetaComponent {
  private authService = inject(AuthService);
  private modalesService = inject(ModalesService);
  private metaAhorroService = inject(MetaAhorroService);
  private onDestroy: Subject<Boolean> = new Subject();

  @Input() meta!: Meta;

  metaPorActualizar: ActualizarMetaDto = {
    nombre: '',
    montoObjetivo: 0,
  };

  abrirModalCancelarMeta(id: number): void {
    Swal.fire({
      icon: 'question',
      text: '¿Seguro que desea cancelar la meta?',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      confirmButtonText: 'Ok',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancelarMeta(id);
      }
    });
  }

  cancelarMeta(id: number): void {
    this.authService
      .validarToken()
      .pipe(takeUntil(this.onDestroy))
      .subscribe({
        next: () => {
          this.metaAhorroService.cancelarMetaPorId(id).subscribe({
            next: (res) => {
              Swal.fire({
                icon: 'success',
                text: res.data,
                confirmButtonText: 'Ok',
              }).finally(() => window.location.reload());
            },
            error: (err) => this.modalesService.modalError(err)
          })
        }
      });
  };

  abrirModalActualizacion(meta: Meta):void{
    this.metaPorActualizar = {
      nombre: meta.nombre,
      montoObjetivo: meta.montoObjetivo
    }

    Swal.fire({
      icon: 'question',
      text: '¿Seguro que desea actualizar la meta?',
      html: `
        <form class="flex flex-col gap-4">
            <div class="text-left">
                <label>Nombre de la meta</label>
                <input id="nombre-meta-actualizacion" name="nombre" type="text"
                class="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700"
                placeholder="Ej: Ahorro para moto" value="${meta.nombre}">
            </div>
            <div class="text-left">
                <label>Monto objetivo</label>
                <input id="monto-meta-actualizacion" name="montoObjetivo" type="number"
                class="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700"
                placeholder="Ej: 3000000" value="${meta.montoObjetivo}">
            </div>
        </form>
      `,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Guardar',
      preConfirm: () => {
        const popup = Swal.getPopup();

        const nombre = (popup?.querySelector('#nombre-meta-actualizacion') as HTMLInputElement)?.value;
        const monto = (popup?.querySelector('#monto-meta-actualizacion') as HTMLInputElement)?.value;

        this.metaPorActualizar.nombre = nombre;
        this.metaPorActualizar.montoObjetivo = Number(monto);

      }
    }).then(result => {
      if(result.isConfirmed){
        Swal.fire({
          icon: 'question',
          text: '¿Seguro que desea actualizar la meta?',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Ok'
        }).then(result => {
          if(result.isConfirmed){
            this.actualizarMeta(meta);
          }          
        })
      }
    })
  }

  actualizarMeta = (meta: Meta):void => {
    this.authService
      .validarToken()
      .pipe(takeUntil(this.onDestroy))  
      .subscribe(res => {

      this.metaAhorroService.actualizarMeta(meta.id, this.metaPorActualizar).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            text: res.data,
            confirmButtonText: 'Ok'
          }).then(result => {
            if(result.isConfirmed){
              window.location.reload();
            }
          })
        },
        error: (err) => this.modalesService.modalError(err)
      })
    })
  }

  /*


  }*/
}
