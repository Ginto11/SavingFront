import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ModalNormalComponent } from '../../shared/modal-normal/modal-normal.component';
import { CrearMetaDTO } from '../../interfaces/crear-meta-dto.interface';
import { FormsModule } from '@angular/forms';
import { MetaAhorroService } from '../../services/meta-ahorro.service';
import { CrearNuevoAhorroDto } from '../../interfaces/crear-nuevo-ahorro-dto.interface';
import { CommonModule } from '@angular/common';
import { AhorroService } from '../../services/ahorro.service';
import { RespuestaService } from '../../services/respuesta.service';
import { CantidadesTotales } from '../../interfaces/cantidades-totales.interface';
import { UltimoMovimiento } from '../../interfaces/ultimo-movimiento.interface';
import { CumplimientoMetaAhorro } from '../../interfaces/cumplimiento-meta-ahorro.interface';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [ModalNormalComponent, FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export default class DashboardComponent implements OnInit {

  private router = inject(Router);
  private authService = inject(AuthService);
  private ahorroService = inject(AhorroService);
  private respuestasService = inject(RespuestaService);
  private metaAhorroService = inject(MetaAhorroService);

  //MODALES
  @ViewChild('modalCrearMeta') modalCrearMeta!: ModalNormalComponent;
  @ViewChild('modalCrearAhorro') modalCrearAhorro!: ModalNormalComponent;
  @ViewChild('modalRegistroMetaExitoso') modalRegistroMetaExitoso!: ModalNormalComponent;
  @ViewChild('modalError') modalError!: ModalNormalComponent;


  metasConCumplimiento: CumplimientoMetaAhorro[] = [];
  cantidadMetasActivas!: number;
  nombreUsuarioLogueado!: string;
  mensajeRegistroExitoso = '';
  mensajeError = '';
  multiplesErrores: string[] = [];
  metas: any | null = null;
  totalAhorrado!: number;
  ahorroMes!: number;

  nuevoAhorro: CrearNuevoAhorroDto = {
    usuarioId: 0,
    monto: null,
    descripcion: null,
    metaAhorroId: ''
  }

  model: CrearMetaDTO = {
    usuarioId: null,
    nombre: "",
    montoObjetivo: null
  };

  cantidadesTotales: CantidadesTotales = {
    totalAhorrado: 0,
    ahorroMes: 0
  };

  ultimosMovimientos: UltimoMovimiento[] | null = []
  ngOnInit(): void {

    window.scrollTo(0, 0);

    this.obtenerTotales();
    this.obtenerUltimosMovimientos();
    this.authService.usuarioLogueado.subscribe(usuario => {
      if (usuario == null) {
        this.usuarioNoLogueado();
        return;
      }
      this.nombreUsuarioLogueado = usuario.primerNombre;
    })
    this.obtenerMetasConCumplimiento();
    this.obtenerCantidadMetasActivasPorUsuario();
  }

  cerrarModalCrearMeta() {
    this.modalRegistroMetaExitoso.cerrar();
  }

  validarMeta = (meta: CrearMetaDTO): string[] => {
    const errores: string[] = [];

    if (!meta.nombre || meta.nombre.trim().length === 0) {
      errores.push("El nombre es obligatorio.");
    }

    if (meta.montoObjetivo == null) {
      errores.push('El monto objetivo es obligatorio.');
    }

    if (meta.montoObjetivo !== null) {
      if (meta.montoObjetivo <= 0) {
        errores.push("El monto objetivo debe ser mayor a 0.");
      }
    }
    return errores;
  }

  guardarMeta = (): void => {
    const errores = this.validarMeta(this.model);

    if (errores.length > 0) {
      this.multiplesErrores = errores;
      this.modalError.abrir();
      return;
    }

    this.authService.usuarioLogueado.subscribe(usuario => {
      if (usuario == null) {
        this.usuarioNoLogueado();
        return;
      }

      this.model.usuarioId = usuario.id
      this.metaAhorroService.refrescarInformacion(usuario.id);
      this.metaAhorroService.crearMeta(this.model).subscribe({
        next: (res) => {
          this.metaAhorroService.refrescarInformacion(usuario.id);
          this.mensajeRegistroExitoso = res.mensaje;
          this.modalCrearMeta.cerrar();
          this.modalRegistroMetaExitoso.abrir();

        },
        error: (err) => {
          this.mensajeError = this.respuestasService.manejoRespuesta(err);
          this.modalError.abrir();
        }
      })
    })

  }

  obtenerCantidadMetasActivasPorUsuario(): void {
    this.authService.usuarioLogueado.subscribe({
      next: (usuario) => {
        if (usuario == null) {
          this.usuarioNoLogueado();
          return;
        }
        this.metaAhorroService.cantidadMetasObservable.subscribe(res => {
          this.cantidadMetasActivas = res;
        })
        this.metaAhorroService.metasActivasObservable.subscribe(res => {
          this.metas = res;
        })
      },
      error: (err) => {
        this.mensajeError = this.respuestasService.manejoRespuesta(err);
        this.modalError.abrir();
      }
    })
  }

  validarNuevoAhorro = (): string[] => {

    const errores = [];

    if (!this.nuevoAhorro.monto || this.nuevoAhorro.monto <= 0) {
      errores.push('El monto debe ser mayor a 0.');
    }

    if (!this.nuevoAhorro.descripcion || this.nuevoAhorro.descripcion.trim().length < 3) {
      errores.push('La descripción es obligatoria y debe tener al menos 3 caracteres.');
    }

    if (!this.nuevoAhorro.metaAhorroId || this.nuevoAhorro.metaAhorroId == '') {
      errores.push('Debe seleccionar una meta de ahorro.');
    }

    return errores;
  }

  guardarAhorro = ():void => {

    const errores = this.validarNuevoAhorro();

    if (errores.length > 0) {
      this.multiplesErrores = errores;
      this.modalError.abrir();
      return;
    }

    this.authService.usuarioLogueado.subscribe(usuario => {
      if (usuario == null) {

        this.usuarioNoLogueado();
        return;
      }
      this.nuevoAhorro.metaAhorroId = Number(this.nuevoAhorro.metaAhorroId);
      this.nuevoAhorro.usuarioId = usuario.id;

      this.ahorroService.agregarO(this.nuevoAhorro).subscribe({
        next: (res) => {
          this.ahorroService.refrescarInformacion(usuario.id);
          this.metaAhorroService.refrescarInformacion(usuario.id);
          this.mensajeRegistroExitoso = res.mensaje;

          this.modalCrearAhorro.cerrar();
          this.modalRegistroMetaExitoso.abrir();
        },
        error: (err) => {
          this.mensajeError = this.respuestasService.manejoRespuesta(err);
          this.modalError.abrir();
        }
      });
    })

  }

  limpiarModelo = (): void => {
    this.model = {
      usuarioId: null,
      nombre: "",
      montoObjetivo: 0
    };

    this.nuevoAhorro = {
      usuarioId: 0,
      monto: null,
      descripcion: null,
      metaAhorroId: null
    }
  }

  obtenerTotales() {
    this.ahorroService.cantidadesTotalesObservable.subscribe({
      next: (res) => {
        this.cantidadesTotales = res;
      },
      error: (err) => {
        this.mensajeError = this.respuestasService.manejoRespuesta(err);
        this.modalError.abrir();
      }
    })

  }

  obtenerUltimosMovimientos() {

    this.authService.usuarioLogueado.subscribe(usuario => {
      if (usuario == null) {
        this.usuarioNoLogueado();
        return;
      }
      this.ahorroService.refrescarInformacion(usuario.id);
      this.ahorroService.movimientosObservable.subscribe({
        next: (res) => {
          this.ultimosMovimientos = res;
        },
        error: (err) => {
          this.mensajeError = this.respuestasService.manejoRespuesta(err);
          this.modalError.abrir();
        }
      });
    })

  }

  obtenerMetasConCumplimiento():void{
    this.authService.usuarioLogueado.subscribe(usuario => {
      if (usuario == null) {
        this.usuarioNoLogueado();
        return;
      }

      this.metaAhorroService.refrescarInformacion(usuario.id);
      this.metaAhorroService.metaCumplimientoObservable.subscribe({
        next: (res) => {
          this.metasConCumplimiento = res;
        },
        error: (err) => {
          this.mensajeError = this.respuestasService.manejoRespuesta(err);
          this.modalError.abrir();
        }
      })
    })
  }

  usuarioNoLogueado(): void {
    this.mensajeError = 'Usuario no logueado.';
    this.modalError.abrir();
  }


  cerrarModalYLimpiarVariables():void {
    this.modalError.cerrar();
    this.mensajeError = '';
    this.multiplesErrores = [];
  }
}


