import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { UsuarioLogueado } from '../../interfaces/usuario-logueado.interface';
import { LocalstorageService } from '../../services/localstorage.service';
import { Router } from '@angular/router';
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

@Component({
  selector: 'app-dashboard',
  imports: [ModalNormalComponent, FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export default class DashboardComponent implements OnInit {

  private router = inject(Router);
  private ahorroService = inject(AhorroService);
  private respuestasService = inject(RespuestaService);
  private localstorageService = inject(LocalstorageService);
  private metaAhorroService = inject(MetaAhorroService);

  //MODALES
  @ViewChild('modalRef') modalCerrarSesion!: ModalNormalComponent;
  @ViewChild('modalCrearMeta') modalCrearMeta!: ModalNormalComponent;
  @ViewChild('modalCrearAhorro') modalCrearAhorro!: ModalNormalComponent;
  @ViewChild('modalRegistroMetaExitoso') modalRegistroMetaExitoso!: ModalNormalComponent;
  @ViewChild('modalError') modalError!: ModalNormalComponent;


  metasConCumplimiento: CumplimientoMetaAhorro[] = []; 
  usuarioLogueado!: UsuarioLogueado;
  cantidadMetasActivas!: number;
  mensajeRegistroExitoso = '';
  mensajeErrorTryCatch = '';
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

  ultimosMovimientos: UltimoMovimiento[] = []
  ngOnInit(): void {
    this.obtenerTotales();
    this.obtenerUltimosMovimientos();
    this.obtenerMetasConCumplimiento();
    this.obtenerCantidadMetasPorUsuario();
    this.usuarioLogueado = this.localstorageService.getItem('usuario-saving');
  }

  cerrarSesion = (): void => {
    this.localstorageService.removerItem('usuario-saving');
    this.router.navigate(['inicio']);
  }

  cerrarModalCrearMeta() {
    this.modalRegistroMetaExitoso.cerrar();
    window.location.reload();
  }

  validarMeta(meta: CrearMetaDTO): string[] {
    const errores: string[] = [];

    if (!meta.nombre || meta.nombre.trim().length === 0) {
      errores.push("El nombre es obligatorio.");
    }

    if(meta.montoObjetivo == null){
      errores.push('El monto objetivo es obligatorio.');
    }

    if (meta.montoObjetivo !== null) {
      if (meta.montoObjetivo <= 0) {
        errores.push("El monto objetivo debe ser mayor a 0.");
      }
    }
    return errores;
  }

  guardarMeta = async (): Promise<void> => {

    try {

      const errores = this.validarMeta(this.model);

      if (errores.length > 0) {
        this.multiplesErrores = errores;
        this.modalError.abrir();
        return;
      }

      this.model.usuarioId = this.usuarioLogueado.id;
      const res = await this.metaAhorroService.crearMeta(this.model);
      this.mensajeRegistroExitoso = res.mensaje;
      this.modalCrearMeta.cerrar();
      this.modalRegistroMetaExitoso.abrir();

    } catch (error) {
      console.log(error);
    }
  }

  obtenerCantidadMetasPorUsuario = async (): Promise<void> => {
    try {

      const id = this.localstorageService.getItem('usuario-saving').id;

      const res = await this.metaAhorroService.buscarMetasPorUsuarioId(id);

      this.metas = res.data;

      this.cantidadMetasActivas = res.data.length;

    } catch (error) {
      console.log(error);
    }
  }

  validarNuevoAhorro(): string[] {

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

  guardarAhorro = async () :Promise<void> => {

    const errores = this.validarNuevoAhorro();

    if(errores.length > 0){
      this.multiplesErrores = errores;
      this.modalError.abrir();
      return;
    }

    try{

      this.nuevoAhorro.usuarioId = this.localstorageService.getItem('usuario-saving').id;

      this.nuevoAhorro.metaAhorroId = Number(this.nuevoAhorro.metaAhorroId);

      console.log(this.nuevoAhorro)
      
      const res = await this.ahorroService.agregar(this.nuevoAhorro);
      this.mensajeRegistroExitoso = res.mensaje;
      this.modalCrearAhorro.cerrar();
      this.modalRegistroMetaExitoso.abrir();

    }catch(error){
      this.mensajeErrorTryCatch = this.respuestasService.manejoRespuesta(error);
      this.modalError.abrir();
    }
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

  obtenerTotales = async () :Promise<void> => {
    try{

      const id = this.localstorageService.getItem('usuario-saving').id;

      const res = await this.ahorroService.obtenerTotalesPorUsuarioId(id);

      this.cantidadesTotales = res.data;

    }catch(error){
      console.log(error);
    }
  }

  obtenerUltimosMovimientos = async () :Promise<void> => {
    try{

      const id = this.localstorageService.getItem('usuario-saving').id;

      const res = await this.ahorroService.obtenerUltimosMovimientosPorUsuarioId(id);
      
      this.ultimosMovimientos = res.data;

    }catch(error){
      console.log(error);
    }
  }

  obtenerMetasConCumplimiento = async () :Promise<void> => {
    try {
      const id = this.localstorageService.getItem('usuario-saving').id;
      
      const res = await this.metaAhorroService.obtenerMetasConCumplimiento(id);

      this.metasConCumplimiento = res.data;

      console.log(this.metasConCumplimiento)

    } catch (error) {
      console.log(error);
    }
  }

}
