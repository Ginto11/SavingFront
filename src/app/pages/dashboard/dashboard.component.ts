import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CrearMetaDTO } from '../../interfaces/crear-meta-dto.interface';
import { FormsModule } from '@angular/forms';
import { MetaAhorroService } from '../../services/meta-ahorro.service';
import { CrearNuevoAhorroDto } from '../../interfaces/crear-nuevo-ahorro-dto.interface';
import { CommonModule } from '@angular/common';
import { AhorroService } from '../../services/ahorro.service';
import { CantidadesTotales } from '../../interfaces/cantidades-totales.interface';
import { UltimoMovimiento } from '../../interfaces/ultimo-movimiento.interface';
import { CumplimientoMetaAhorro } from '../../interfaces/cumplimiento-meta-ahorro.interface';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import 'sweetalert2/themes/bootstrap-5.css'
import { ModalesService } from '../../services/modales.service';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styles: ``,
})
export default class DashboardComponent implements AfterViewInit, OnDestroy {
  private modalesService = inject(ModalesService);
  private authService = inject(AuthService);
  private ahorroService = inject(AhorroService);
  private metaAhorroService = inject(MetaAhorroService);
  private onDestroy: Subject<boolean> = new Subject();

  metasConCumplimiento: CumplimientoMetaAhorro[] = [];
  cantidadMetasActivas!: number;
  nombreUsuarioLogueado!: string;
  metas: any | null = null;
  totalAhorrado!: number;
  ahorroMes!: number;
  
  

  cantidadesTotales: CantidadesTotales = {
    totalAhorrado: 0,
    ahorroMes: 0,
  };

  ultimosMovimientos: UltimoMovimiento[] | null = [];
  ngAfterViewInit(): void {
    window.scrollTo(0, 0);

    this.authService.validarToken()
    .pipe(takeUntil(this.onDestroy))
    .subscribe({
      next: () => {
        this.authService.usuarioLogueado
        .pipe(takeUntil(this.onDestroy))
        .subscribe({
          next: (usuario) => {
            this.obtenerTotales();
            this.obtenerUltimosMovimientos();
            this.obtenerMetasConCumplimiento();
            this.obtenerCantidadMetasActivasPorUsuario();
            this.nombreUsuarioLogueado = usuario!.primerNombre;
          }
        });
      },
      error: (err) => this.modalesService.modalTokenExpiradoOError(err)
    });
  }
  
  ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }
  
  mostrarModalCrearMeta = () => {
    Swal.fire({
      title: 'Crear una meta',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      theme: 'bootstrap-5-light',
      confirmButtonText: 'Guardar',
      html: `
        <form class="flex flex-col gap-4">

          <div class="text-left"> 
            <label>Nombre de la meta</label>
            <input id="nombre-meta" name="nombre" type="text"
              class="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700"
              placeholder="Ej: Ahorro para moto">
          </div>

          <div class="text-left">
            <label>Monto objetivo</label>
            <input id="monto-objetivo" name="montoObjetivo" type="number"
              class="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Ej: 3000000">
          </div>

        </form>
      `,
      preConfirm: () => {

        const modal = Swal.getPopup();

        const nombreMeta = (modal!.querySelector('#nombre-meta') as HTMLInputElement)?.value;
        const montoObjetivo = (modal!.querySelector('#monto-objetivo') as HTMLInputElement)?.value;

        return {
          nombreMeta, 
          monto: Number(montoObjetivo)
        }
      }
    }).then(result => {
      if(result.isConfirmed){
        const meta: CrearMetaDTO = {
          nombre: result.value.nombreMeta,
          montoObjetivo: result.value.monto,
          usuarioId: 0
        }
        console.log(meta.montoObjetivo)
        this.guardarMeta(meta);
      }
    })
  }

  mostrarModalCrearAhorro = () => {
    Swal.fire({
      title: 'Crear una meta',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      theme: 'bootstrap-5-light',
      confirmButtonText: 'Guardar',
      html: `
        <form class="flex flex-col gap-4">

          <div>
            <label>Monto (Sin puntos)</label>
            <input [(ngModel)]="nuevoAhorro.monto" name="monto" type="number"
              class="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Ej: 150000">
          </div>

          <div>
            <label>Descripción</label>
            <input [(ngModel)]="nuevoAhorro.descripcion" name="descripcion" type="text"
              class="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Ej: Ahorro semanal">
          </div>

          <div>
            <label>Meta de ahorro</label>
            <select [(ngModel)]="nuevoAhorro.metaAhorroId" name="metaAhorroId"
              class="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700">
              <option selected value="">Seleccionar</option>
              @for (meta of metas; track meta.id) {
              <option [value]="meta.id">{{ meta.nombre }}</option>
              }

            </select>
          </div>

          <input type="hidden" [(ngModel)]="nuevoAhorro.usuarioId" name="usuarioId">
        </form>
      `
    })
  }

  guardarMeta = (modelo: CrearMetaDTO): void => {
    this.authService.validarToken()
    .pipe(takeUntil(this.onDestroy))
    .subscribe({
      next: () => {
        this.authService.usuarioLogueado.subscribe((usuario) => {
          modelo.usuarioId = usuario!.id;
          this.metaAhorroService.crearMeta(modelo).subscribe({
            next: (res) => {
              this.metaAhorroService.refrescarInformacion(usuario!.id);
              this.modalesService.modalExitoso(res.mensaje);
            },
            error: (err) => this.modalesService.modalMultiplesErrores(err)
          });
        });
      },
      error: (err) => this.modalesService.modalTokenExpiradoOError(err)
    })

  };

  obtenerCantidadMetasActivasPorUsuario(): void {
    this.authService.validarToken()
    .pipe(takeUntil(this.onDestroy))
    .subscribe({
      next: () => {
        this.metaAhorroService.cantidadMetasObservable.subscribe((res) => {
          this.cantidadMetasActivas = res;
        });
        this.metaAhorroService.metasActivasObservable.subscribe((res) => {
          this.metas = res;
        });
      },
      error: (err) => this.modalesService.modalTokenExpiradoOError(err)
    });
  }


  guardarAhorro = (ahorro: CrearNuevoAhorroDto): void => {
    this.authService.validarToken().subscribe({
      next: (res)  => {
        this.authService.usuarioLogueado.subscribe((usuario) => {
          ahorro.metaAhorroId = Number(ahorro.metaAhorroId);
          ahorro.usuarioId = usuario!.id;
          this.ahorroService.agregarO(ahorro).subscribe({
            next: (res) => {
              this.ahorroService.refrescarInformacion(usuario!.id);
              this.metaAhorroService.refrescarInformacion(usuario!.id);
              this.modalesService.modalExitoso(res.mensaje);
            },
            error: (err) => this.modalesService.modalMultiplesErrores(err),
          });
        });
      },
      error: (err) => this.modalesService.modalTokenExpiradoOError(err)
    })

  };

  obtenerTotales() {
    this.authService.validarToken()
    .pipe(takeUntil(this.onDestroy))
    .subscribe({
      next: () => {
        this.authService.usuarioLogueado.subscribe((usuario) => {
          this.metaAhorroService.refrescarInformacion(usuario!.id);
          this.ahorroService.cantidadesTotalesObservable.subscribe({
            next: (res) => this.cantidadesTotales = res,
            error: (err) => this.modalesService.modalTokenExpiradoOError(err)
          });
        });
      }, 
      error: (err) => this.modalesService.modalTokenExpiradoOError(err)
    })
  }

  obtenerUltimosMovimientos() {
    this.authService.validarToken()
    .pipe(takeUntil(this.onDestroy))
    .subscribe({
      next: () => {
        this.authService.usuarioLogueado.subscribe((usuario) => {
          this.ahorroService.refrescarInformacion(usuario!.id);
          this.ahorroService.movimientosObservable.subscribe({
            next: (res) => this.ultimosMovimientos = res,
            error: (err) => this.modalesService.modalTokenExpiradoOError(err),
          });
        });
      }, 
      error: (err) => this.modalesService.modalTokenExpiradoOError(err)
    })
  }

  obtenerMetasConCumplimiento(): void {
    this.authService.validarToken()
    .pipe(takeUntil(this.onDestroy))
    .subscribe({
      next: () => {
        this.authService.usuarioLogueado.subscribe((usuario) => {
          this.metaAhorroService.refrescarInformacion(usuario!.id);
          this.metaAhorroService.metaCumplimientoObservable.subscribe({
            next: (res) => this.metasConCumplimiento = res,
            error: (err) => this.modalesService.modalTokenExpiradoOError(err),
          });
        });
      },
      error: (err) => this.modalesService.modalTokenExpiradoOError(err)
    })
  }

}
