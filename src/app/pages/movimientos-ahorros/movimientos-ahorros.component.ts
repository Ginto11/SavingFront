import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AhorroService } from '../../services/ahorro.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ModalesService } from '../../services/modales.service';
import { TablaComponent } from '../../components/tabla/tabla.component';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-movimientos-ahorros',
  imports: [CommonModule, TablaComponent],
  templateUrl: './movimientos-ahorros.component.html',
  styles: ``
})
export default class MovimientosAhorrosComponent implements OnInit, OnDestroy {

  private authService = inject(AuthService);
  private ahorroService = inject(AhorroService);
  private usuarioService = inject(UsuarioService);
  private modalesService = inject(ModalesService);
  private onDestroy: Subject<boolean> = new Subject<boolean>();
  resultadoPaginaAhorros$ = this.usuarioService.resultadoPaginaAhorros;

  paginaActual = 1;
  listaCampos = ['Código', 'Monto', 'Fecha', 'Descripción', 'Nombre Meta', 'Tipo Ahorro', 'Estado Meta', 'Acción']


  ngOnInit(): void {
    this.authService.usuarioLogueado
    .pipe(takeUntil(this.onDestroy))
    .subscribe(usuario => {
      this.usuarioService.obtenerAhorrosPorUsuario(usuario!.id, this.paginaActual, 10, '');
    })
  } 

  obtenerInformacionTabla(paginaActual: number):void {
    this.paginaActual = paginaActual;
    this.authService.usuarioLogueado
    .pipe(takeUntil(this.onDestroy))
    .subscribe(usuario => {
      this.usuarioService.obtenerAhorrosPorUsuario(usuario!.id, paginaActual, 10, '');
    })
  }

  buscarAhorro(descripcion: string):void {
    this.authService.usuarioLogueado
    .pipe(takeUntil(this.onDestroy))
    .subscribe(usuario => {
      this.usuarioService.obtenerAhorrosPorUsuario(usuario!.id, this.paginaActual, 10, descripcion);
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
    this.authService.usuarioLogueado
    .pipe(takeUntil(this.onDestroy))
    .subscribe(usuario => {
      this.ahorroService.eliminarAhorro(id)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(res => {
        this.usuarioService.obtenerAhorrosPorUsuario(usuario!.id, this.paginaActual, 10, '');
        this.modalesService.modalExitoso('Registro eliminado exitosamente.');
      })
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }

}
