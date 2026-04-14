import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AhorroService } from '../../services/ahorro.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ModalesService } from '../../services/modales.service';
import { TablaComponent } from '../../components/tabla/tabla.component';

@Component({
  selector: 'app-movimientos-ahorros',
  imports: [CommonModule, TablaComponent],
  templateUrl: './movimientos-ahorros.component.html',
  styles: ``
})
export default class MovimientosAhorrosComponent implements OnInit, OnDestroy {

  ahorroService = inject(AhorroService);
  private authService = inject(AuthService);
  private modalesService = inject(ModalesService);
  private onDestroy: Subject<boolean> = new Subject<boolean>();
  resultadoPaginaAhorros$ = this.ahorroService.resultadoPaginaAhorros;

  paginaActual = 1;
  listaCampos = ['Código', 'Monto', 'Fecha', 'Descripción', 'Nombre Meta', 'Tipo Ahorro', 'Estado Meta', 'Acción']


  ngOnInit(): void {
    this.authService.usuarioLogueado
    .pipe(takeUntil(this.onDestroy))
    .subscribe(usuario => {
      this.ahorroService.obtenerPaginaAhorros(usuario!.id, this.paginaActual, 10);
    })
  } 

  obtenerInformacionTabla(paginaActual: number):void {
    this.paginaActual = paginaActual;
    this.authService.usuarioLogueado
    .pipe(takeUntil(this.onDestroy))
    .subscribe(usuario => {
      this.ahorroService.obtenerPaginaAhorros(usuario!.id, paginaActual, 10);
    })
  }

  buscarAhorro(descripcion: string):void {
    this.authService.usuarioLogueado
    .pipe(takeUntil(this.onDestroy))
    .subscribe(usuario => {
      this.ahorroService.obtenerPaginaAhorrosPorDescripcion(usuario!.id, this.paginaActual, 10, descripcion);
    })
  }

  mostrarModalEliminarElemento(id: number){
      Swal.fire({
        icon: 'question',
        showCancelButton: true,
        text: '¿Seguro que desea eliminar este registro?',
        confirmButtonText: 'Si, continuar'
      }).then(result => {
        if(result.isConfirmed){
          this.eliminarAhorro(id);
        }
      })
    }

  eliminarAhorro = (id: number):void => {
    console.log(id);
    this.authService.usuarioLogueado.subscribe(usuario => {
      this.ahorroService.eliminarAhorro(id).subscribe(res => {
        this.ahorroService.obtenerPaginaAhorros(usuario!.id, this.paginaActual, 10);
        this.modalesService.modalExitoso('Registro eliminado exitosamente.');
      })
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }

}
