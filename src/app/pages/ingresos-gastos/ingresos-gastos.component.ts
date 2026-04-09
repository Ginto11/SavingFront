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
import { combineLatest, shareReplay, Subject, switchMap, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { CategoriaGastoService } from '../../services/categoria-gasto.service';
import { CategoriaGasto } from '../../interfaces/categoria-gasto-dto.interface';

@Component({
  selector: 'app-ingresos-gastos',
  imports: [FormsModule, CommonModule],
  templateUrl: './ingresos-gastos.component.html',
  styles: ``
})
export default class TrabajoAplicacionesComponent implements OnInit, OnDestroy {
  
  private ingresoService = inject(IngresoService);
  private categoriaGastoService = inject(CategoriaGastoService);
  private egresoService = inject(EgresoService);
  private onDestroy: Subject<boolean> = new Subject();
  private modalesService = inject(ModalesService);
  
  categorias$ = this.categoriaGastoService.categoriasObservable;
  totalesIngresos$ = this.ingresoService.totalesObservable;
  listaIngresos$ = this.ingresoService.listaIngresosObservable;
  listaEgresos$ = this.egresoService.listaEgresosObservable

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.ingresoService.actualizarInformacion();
    this.egresoService.actualizarInformacion();
    this.categoriaGastoService.obtenerCategoriasGastos();
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
              <option value="Banco">Banco</option>
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
      }
    })
  }

  mostrarModalEgreso = () => {

    let opciones = `<option value="" selected>Seleccionar</option>`;

    this.categorias$
      .pipe(take(1))
      .subscribe((categorias: CategoriaGasto[])=> {
        categorias.forEach((categoria: any) => {
          opciones += `<option value="${categoria.id}">${categoria.nombre}</option>`
        })
      })

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
              <option value="Banco">Banco</option>
            </select>
          </div>

          <div class="text-left"> 
            <label>Categoria</label>
            <select id="categoria-egreso" class="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700">
            ${opciones}
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
        const categoria = (popup?.querySelector('#categoria-egreso') as HTMLSelectElement)?.value;

        return {
          tipo,
          monto: Number(monto),
          categoria: Number(categoria)
        };
      }
    }).then(result => {
      if(result.isConfirmed){
        const egreso = {
          tipo: result.value.tipo,
          monto: result.value.monto,
          categoriaGastoId: result.value.categoria,
          usuarioId: 0
        };

      this.registrarEgreso(egreso);
      }
    })
  }

  registrarEgreso = (egreso: CrearEgresoDto) => {
    this.egresoService.agregar(egreso)
    .pipe(takeUntil(this.onDestroy))
    .subscribe({
      next: (res) => {
        this.ingresoService.actualizarInformacion();
        this.egresoService.actualizarInformacion();
        this.modalesService.modalExitoso(res.mensaje);

      }
    })
  }

}

