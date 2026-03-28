import { TiposIngresosTotales } from '../../interfaces/tipos-ingresos-totales-dto.interface';
import { CrearIngresoDto } from '../../interfaces/crear-ingreso-dto.interface';
import { CrearEgresoDto } from '../../interfaces/crear-egreso-dto.interface';
import { TiposEgresosTotales } from '../../interfaces/tipos-egresos-totales-dto.interface';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IngresoDto } from '../../interfaces/ingreso-dto.interface';
import { EgresoDto } from '../../interfaces/egreso-dto.interface';
import { ModalesService } from '../../services/modales.service';
import { IngresoService } from '../../services/ingreso.service';
import { EgresoService } from '../../services/egreso.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import 'sweetalert2/themes/bootstrap-5.css'
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-trabajo-aplicaciones',
  imports: [FormsModule, CommonModule],
  templateUrl: './trabajo-aplicaciones.component.html',
  styles: ``
})
export default class TrabajoAplicacionesComponent implements OnInit, OnDestroy {
  
  private ingresoService = inject(IngresoService);
  private authService = inject(AuthService);
  private egresoService = inject(EgresoService);
  private onDestroy: Subject<boolean> = new Subject();
  private modalesService = inject(ModalesService);
  
  totalesIngresos: TiposIngresosTotales = {
    totalEfectivo: 0,
    totalNequi: 0,
    totalApp: 0
  }

  totalesEgresos: TiposEgresosTotales = {
    totalEfectivo: 0,
    totalNequi: 0,
    totalApp: 0
  }


  listaIngresos: IngresoDto[] | null = null;
  listaEgresos: EgresoDto[] | null = null;
  
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.authService.validarToken()
      .pipe(takeUntil(this.onDestroy))
      .subscribe({
        next: (res) => {
          this.ingresoService.actualizarInformacion();
          this.egresoService.actualizarInformacion();
          
          this.ingresoService.totalesObservable
          .pipe(takeUntil(this.onDestroy))
          .subscribe(res => {
            this.totalesIngresos.totalEfectivo = res.totalEfectivo,
            this.totalesIngresos.totalNequi = res.totalNequi,
            this.totalesIngresos.totalApp = res.totalApp
          })

          this.ingresoService.listaIngresosObservable
          .pipe(takeUntil(this.onDestroy))
          .subscribe(res => {
            this.listaIngresos = res;
          })

          this.egresoService.listaEgresosObservable
          .pipe(takeUntil(this.onDestroy))
          .subscribe(res => {
            this.listaEgresos = res;
          })
        },
        error: (err) => this.modalesService.modalError(err)
      })
  }
  
  ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }

  mostrarModalIngreso = () => {
    Swal.fire({
      title: 'Registrar un ingreso',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      theme: 'bootstrap-5-light',
      confirmButtonText: 'Guardar',
      html: `
        <form class="flex flex-col gap-4">
          <div class="text-left"> 
            <label>Tipo</label>
            <select id="tipo-ingreso" class="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700">
              <option value="" selected>Seleccionar</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Nequi">Nequi</option>
              <option value="App">App</option>
            </select>
          </div>

          <div class="text-left">
            <label>Monto (Sin puntos)</label>
            <input id="monto-ingreso" name="monto" type="number"
              class="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Ej: 3000000">
          </div>
        </form>
      `,
      preConfirm: () => {
        const popup = Swal.getPopup();

        const tipo = (popup?.querySelector('#tipo-ingreso') as HTMLSelectElement)?.value;
        const monto = (popup?.querySelector('#monto-ingreso') as HTMLInputElement)?.value;

        return {
          tipo,
          monto: Number(monto)
        };
      }
    }).then(result => {
      if(result.isConfirmed){
        const ingreso = {
          tipo: result.value.tipo,
          monto: result.value.monto,
          usuarioId: 0
        };

      this.registrarAhorro(ingreso);
      }
    })
  }

  registrarAhorro = (ingreso: CrearIngresoDto) => {
    this.ingresoService.agregar(ingreso).subscribe({
      next: (res) => {
        this.ingresoService.actualizarInformacion();
        this.modalesService.modalExitoso(res.mensaje);        
      },
      error: (err) => this.modalesService.modalError(err)
    })
  }

  mostrarModalEgreso = () => {
    Swal.fire({
      title: 'Registrar un egreso',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      theme: 'bootstrap-5-light',
      confirmButtonText: 'Guardar',
      html: `
        <form class="flex flex-col gap-4">
          <div class="text-left"> 
            <label>Tipo</label>
            <select id="tipo-egreso" class="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700">
              <option value="">Seleccionar</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Nequi">Nequi</option>
              <option value="App">App</option>
            </select>
          </div>

          <div class="text-left">
            <label>Monto (Sin puntos)</label>
            <input id="monto-egreso" name="monto" type="number"
              class="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Ej: 3000000">
          </div>
        </form>
      `,
      preConfirm: () => {
        const popup = Swal.getPopup();

        const tipo = (popup?.querySelector('#tipo-egreso') as HTMLSelectElement)?.value;
        const monto = (popup?.querySelector('#monto-egreso') as HTMLInputElement)?.value;

        return {
          tipo,
          monto: Number(monto)
        };
      }
    }).then(result => {
      if(result.isConfirmed){
        const egreso = {
          tipo: result.value.tipo,
          monto: result.value.monto,
          usuarioId: 0
        };

      this.registrarEgreso(egreso);
      }
    })
  }

  registrarEgreso = (egreso: CrearEgresoDto) => {
    this.egresoService.agregar(egreso).subscribe({
      next: (res) => {
        this.ingresoService.actualizarInformacion();
        this.egresoService.actualizarInformacion();
        this.modalesService.modalExitoso(res.mensaje);

      },
      error: (err) => this.modalesService.modalError(err)
    })
  }

}

