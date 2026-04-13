import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AhorroService } from '../../services/ahorro.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ModalesService } from '../../services/modales.service';
import { ResultadoPaginaAhorros } from '../../interfaces/resultado-pagina-ahorro.interface';

@Component({
  selector: 'app-movimientos-ahorros',
  imports: [CommonModule],
  templateUrl: './movimientos-ahorros.component.html',
  styles: ``
})
export default class MovimientosAhorrosComponent implements OnInit, OnDestroy {

  ahorroService = inject(AhorroService);
  private authService = inject(AuthService);
  private modalesService = inject(ModalesService);
  private onDestroy: Subject<boolean> = new Subject<boolean>();
  resultadoPaginaAhorros$ = this.ahorroService.resultadoPaginaAhorros;

  paginaActual: number = 1;
  tamanoPagina: number = 10;


  ngOnInit(): void {
    this.authService.usuarioLogueado
    .pipe(takeUntil(this.onDestroy))
    .subscribe(usuario => {
      this.ahorroService.obtenerPaginaAhorros(usuario!.id, this.paginaActual, this.tamanoPagina);
    })
  }

  paginaAnteriorAhorros():void {
    this.paginaActual -= 1;
    this.authService.usuarioLogueado
    .pipe(takeUntil(this.onDestroy))
    .subscribe(usuario => {
      this.ahorroService.obtenerPaginaAhorros(usuario!.id, this.paginaActual, this.tamanoPagina);
      this.resultadoPaginaAhorros$.subscribe(res => {
        this.paginaActual = res!.paginaActual;
      })
    })
  }

  paginaSiguienteAhorros():void{
    this.paginaActual += 1;
    this.authService.usuarioLogueado
    .pipe(takeUntil(this.onDestroy))
    .subscribe(usuario => {
      this.ahorroService.obtenerPaginaAhorros(usuario!.id, this.paginaActual, this.tamanoPagina);
      this.resultadoPaginaAhorros$.subscribe(res => {
        this.paginaActual = res!.paginaActual;
      })
    })
  }

  mostrarModalEliminarAhorro(id: number){
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

  eliminarAhorro(id: number){
    console.log(id);
    this.authService.usuarioLogueado.subscribe(usuario => {
      this.ahorroService.eliminarAhorro(id).subscribe(res => {
        this.ahorroService.obtenerPaginaAhorros(usuario!.id, this.paginaActual, this.tamanoPagina);
        this.modalesService.modalExitoso('Registro eliminado exitosamente.');
      })
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }

}
