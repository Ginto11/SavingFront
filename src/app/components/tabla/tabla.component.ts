import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { ResultadoPaginado } from '../../interfaces/resultado-paginado.interface';
import { ExportarExcelButtonComponent } from '../../shared/exportar-excel-button/exportar-excel-button.component';  
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tabla',
  imports: [CommonModule, ExportarExcelButtonComponent, FormsModule],
  templateUrl: './tabla.component.html',
  styles: ``
})
export class TablaComponent<T> implements OnDestroy {

  @Input() camposHeader!: string[];
  @Input() datos$!: Observable<ResultadoPaginado<T> | null>;
  @Input() nombreReporte!: string;
  @Input() eliminarElemento!: (id: number) => void;
  @Output() buscarAhorrosPorNombre = new EventEmitter<string>();
  @Output() cambiarPagina = new EventEmitter<number>();

  private onDestroy: Subject<boolean> = new Subject();


  descripcion: string = '';
  paginaActual: number = 1;

  siguiente():void {
    this.paginaActual += 1;
    this.cambiarPagina.emit(this.paginaActual);
  }

  anterior():void {
    this.paginaActual -= 1;
    this.cambiarPagina.emit(this.paginaActual)
  }


  ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }

  enviarDescripcion(): void {
    this.buscarAhorrosPorNombre.next(this.descripcion);
  }

}
