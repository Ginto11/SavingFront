import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalNormalComponent } from '../../shared/modal-normal/modal-normal.component';
import { IngresoService } from '../../services/ingreso.service';
import { IngresoDto } from '../../interfaces/ingreso-dto.interface';
import { FormsModule } from '@angular/forms';
import { TiposIngresosTotales } from '../../interfaces/tipos-ingresos-totales-dto.interface';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-trabajo-aplicaciones',
  imports: [ModalNormalComponent, FormsModule, CommonModule],
  templateUrl: './trabajo-aplicaciones.component.html',
  styles: ``
})
export default class TrabajoAplicacionesComponent implements OnInit, OnDestroy {
  
  private ingresoService = inject(IngresoService);
  private onDestroy: Subject<boolean> = new Subject();
  
  @ViewChild('modalIngreso') modalIngreso!: ModalNormalComponent;
  @ViewChild('modalEgreso') modalEgreso!: ModalNormalComponent;
  
  ingreso: IngresoDto = {
    monto: 0,
    tipo: '',
    usuarioId: 0
  }
  
  totales: TiposIngresosTotales = {
    totalEfectivo: 0,
    totalNequi: 0,
    totalApp: 0
  }
  
  ngOnInit(): void {
    
    this.ingresoService.actualizarInformacion();
    
    this.ingresoService.totalesObservable
    .pipe(takeUntil(this.onDestroy))
    .subscribe(res => {
      this.totales.totalEfectivo = res.totalEfectivo,
      this.totales.totalNequi = res.totalNequi,
      this.totales.totalApp = res.totalApp
      
    })
  }
  
  ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }
  registrarAhorro = () => {
    this.ingresoService.agregar(this.ingreso).subscribe(res =>{
      console.log(res);
    })
  }

  registrarEgreso = () => {
    alert("Hola Egreso")
  }

}
