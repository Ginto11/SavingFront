import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalNormalComponent } from '../../shared/modal-normal/modal-normal.component';
import { IngresoService } from '../../services/ingreso.service';
import { IngresoDto } from '../../interfaces/ingreso-dto.interface';
import { FormsModule } from '@angular/forms';
import { TiposIngresosTotales } from '../../interfaces/tipos-ingresos-totales-dto.interface';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import 'sweetalert2/themes/bootstrap-5.css'
import { CrearIngresoDto } from '../../interfaces/crear-ingreso-dto.interface';

@Component({
  selector: 'app-trabajo-aplicaciones',
  imports: [ModalNormalComponent, FormsModule, CommonModule],
  templateUrl: './trabajo-aplicaciones.component.html',
  styles: ``
})
export default class TrabajoAplicacionesComponent implements OnInit, OnDestroy {
  
  private ingresoService = inject(IngresoService);
  private authService = inject(AuthService);
  private onDestroy: Subject<boolean> = new Subject();
  
  @ViewChild('modalIngreso') modalIngreso!: ModalNormalComponent;
  @ViewChild('modalEgreso') modalEgreso!: ModalNormalComponent;
  
  ingreso: CrearIngresoDto = {
    monto: 0,
    tipo: '',
    usuarioId: 0,
  }
  
  totales: TiposIngresosTotales = {
    totalEfectivo: 0,
    totalNequi: 0,
    totalApp: 0
  }

  listaIngresos: IngresoDto[] | null = null;
  
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.authService.validarToken()
      .pipe(takeUntil(this.onDestroy))
      .subscribe({
        next: (res) => {
          this.ingresoService.actualizarInformacion();
          
          this.ingresoService.totalesObservable
          .pipe(takeUntil(this.onDestroy))
          .subscribe(res => {
            this.totales.totalEfectivo = res.totalEfectivo,
            this.totales.totalNequi = res.totalNequi,
            this.totales.totalApp = res.totalApp
          })

          this.ingresoService.listaIngresosObservable
          .pipe(takeUntil(this.onDestroy))
          .subscribe(res => {
            this.listaIngresos = res;
          })
        },
      })
  }
  
  ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }

  mostrarModal = () => {
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
            <select id="tipo" class="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700">
              <option value="">Seleccionar</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Nequi">Nequi</option>
              <option value="App">App</option>
            </select>
          </div>

          <div class="text-left">
            <label>Monto (Sin puntos)</label>
            <input id="monto" name="monto" type="number"
              class="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Ej: 3000000">
          </div>
        </form>
      `,
      preConfirm: () => {
        const popup = Swal.getPopup();

        const tipo = (popup?.querySelector('#tipo') as HTMLSelectElement)?.value;
        const monto = (popup?.querySelector('#monto') as HTMLInputElement)?.value;

        if (!tipo || !monto) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return;
        }

        if(Number(monto) <= 0){
          Swal.showValidationMessage('El monto debe ser mayor a 0.');
          return;
        }

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
      next: () => {
        this.ingresoService.actualizarInformacion();
        Swal.fire({
          icon: 'success',
          text: 'Registro exitoso.',
          confirmButtonText: 'Ok'
        })

      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          text: 'Ha ocurrido un error.',
          confirmButtonText: 'Ok'
        })
      }
    })
  }

  registrarEgreso = () => {
    alert("Hola Egreso")
  }

}

