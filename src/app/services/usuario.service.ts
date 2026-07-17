import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CrearUsuarioDto } from '../interfaces/crear-usuario-dto.interface';
import { ServerResponse } from '../interfaces/server-response.interface';
import { UsuarioDto } from '../interfaces/usuario-dto.interface';
import { AhorroDto, ResultadoPaginado } from '../interfaces/resultado-paginado.interface';
import { UltimoMovimiento } from '../interfaces/ultimo-movimiento.interface';
import { CantidadesTotales } from '../interfaces/cantidades-totales.interface';
import { TiposEgresosTotales } from '../interfaces/tipos-egresos-totales-dto.interface';
import { EgresoDto } from '../interfaces/egreso-dto.interface';
import { TiposIngresosTotales } from '../interfaces/tipos-ingresos-totales-dto.interface';
import { IngresoDto } from '../interfaces/ingreso-dto.interface';
import { CumplimientoMetaAhorro } from '../interfaces/cumplimiento-meta-ahorro.interface';
import { Meta } from '../interfaces/meta.interface';
import { DataGrafica } from '../interfaces/data-grafica.interface';
import { TransferenciaDto } from '../interfaces/transferencia-dto.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);
  
  cantidadActivasMetas = new BehaviorSubject<number>(0);
  private metas = new BehaviorSubject<Meta[]>([]);
  private listaEgresos = new BehaviorSubject<EgresoDto[] | null>(null);
  private listaIngresos = new BehaviorSubject<IngresoDto[] | null>(null);
  private movimientos = new BehaviorSubject<UltimoMovimiento[] | null>(null);
  private metaCumplimiento = new BehaviorSubject<CumplimientoMetaAhorro[]>([]);
  private resultadoPaginaAhorro = new BehaviorSubject<ResultadoPaginado<AhorroDto> | null>(null);
  private cantidadesTotales = new BehaviorSubject<CantidadesTotales>({ ahorroMes: 0, totalAhorrado: 0 });
  private totalesEgresos = new BehaviorSubject<TiposEgresosTotales>({ totalApp: 0, totalEfectivo: 0, totalNequi: 0, totalBanco: 0 });
  private totalesIngresos = new BehaviorSubject<TiposIngresosTotales>({ totalApp: 0, totalEfectivo: 0, totalNequi: 0, totalBanco: 0 });
  
  

  private usuario = new BehaviorSubject<UsuarioDto>({
    id: 0,
    primerNombre: '',
    primerApellido: '',
    cedula: 0,
    correo: '',
    fechaNacimiento: null,
    manejaGastos: false,
    fotoPerfil: '',
    nuevaFoto: null
  });

  metasObservable = this.metas.asObservable();
  usuarioObservable = this.usuario.asObservable();
  movimientosObservable = this.movimientos.asObservable();
  totalesObservable = this.totalesIngresos.asObservable();
  listaEgresosObservable = this.listaEgresos.asObservable();
  listaIngresosObservable = this.listaIngresos.asObservable();
  totalesEgresosObservable = this.totalesEgresos.asObservable();
  metaCumplimientoObservable = this.metaCumplimiento.asObservable();
  resultadoPaginaAhorros = this.resultadoPaginaAhorro.asObservable();
  cantidadMetasActivasObservable = this.cantidadActivasMetas.asObservable();
  cantidadesTotalesObservable = this.cantidadesTotales.asObservable();



  constructor() {}

  //#region METODOS BASICOS
  agregar = (usuario: CrearUsuarioDto) :Observable<any> => {
    return this.http.post(`${environment.URL_SERVER_VERSION_1}/usuarios`, usuario);
  }

  actualizar(id: number, formData: FormData):Observable<ServerResponse> {
    return this.http.put<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/usuarios/${id}`, formData)
  }

  obtenerUsuarioPorId(id: number):Observable<ServerResponse> {
    return this.http.get<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/usuarios/${id}`)
  }
  //#endregion
  
  //#region METODOS AHORROS
  obtenerAhorrosPorUsuario(id: number, paginaActual: number, tamanoPagina: number, descripcion: string):void{
    this.http.get<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/usuarios/${id}/ahorros`, {
      params: {
        paginaActual,
        tamanoPagina,
        descripcion
      }
    }).subscribe(res => {this.resultadoPaginaAhorro.next(res.data); })
  }
  
  obtenerTotalesPorUsuario(id: number): void {
    this.http.get<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/usuarios/${id}/ahorros/totales`)
      .subscribe(res =>  this.cantidadesTotales.next(res.data));
  }

  obtenerUltimosMovimientos(id: number): void {
      this.http.get<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/usuarios/${id}/ahorros/recientes`)
        .subscribe(res => this.movimientos.next(res.data));
  }

  exportarExcel(id: number){
    return this.http.get(`${environment.URL_SERVER_VERSION_1}/usuarios/${id}/reportes/ahorros/excel`, {
      'responseType': 'blob'
    })
  }
  //#endregion METODOS AHORROS

  //#region METODOS EGRESOS
  obtenerTotalesEgresos(id: number): void {
    this.http.get<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/usuarios/${id}/egresos/totales`)
      .subscribe(res => this.totalesEgresos.next(res.data));
  }

  listarEgresos(id: number):void {
    this.http.get<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/usuarios/${id}/egresos`)
      .subscribe(res => this.listaEgresos.next(res.data));
  }
  //#endregion METODOS EGRESOS

  //#region METODOS INGRESOS
  obtenerTotalesIngresos(id: number):void {
    this.http.get<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/usuarios/${id}/ingresos/totales`)
      .subscribe(res => this.totalesIngresos.next(res.data));
  }

  listarIngresos(id: number): void {
    this.http.get<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/usuarios/${id}/ingresos`)
      .subscribe(res => this.listaIngresos.next(res.data));
  }
  //#endregion METODOS INGRESOS

  //#region METODOS META AHORROS
  obtenerMetasActivasConProgresoPorUsuarioId(id: number):Observable<ServerResponse> {
    return this.http.get<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/usuarios/${id}/metas/progreso`)
  }

  buscarMetaPorNombreYEstado(id: number, nombre: string, estado: string): Observable<ServerResponse> {
    return this.http.get<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/usuarios/${id}/metas`, { params: { nombre, estado } })
  }
  //#endregion METODOS META AHORROS

  //#region METODO ESTADISTICO
  obtenerDataGrafica(id: number):Observable<DataGrafica>{
    return this.http.get<DataGrafica>(`${environment.URL_SERVER_VERSION_1}/usuarios/${id}/estadisticas`);
  }
  //#endregion

  //#region METODO TRANSFERENCIA
  transferirDinero(transferencia: TransferenciaDto): Observable<ServerResponse>{
    return this.http.post<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/usuarios/transferencia`, transferencia) 
  }
  //#endregion

  /*
  * CARGA LA INFORMACION DEL DASHBOARD
  */
  refrescarInformacion(id: number){
    this.obtenerTotalesPorUsuario(id);
    this.obtenerUltimosMovimientos(id);
    this.buscarMetaPorNombreYEstado(id, '', '').subscribe(res => {
      this.metas.next(res.data);
    })
    this.buscarMetaPorNombreYEstado(id, '', 'Activa').subscribe(res => {
      this.cantidadActivasMetas.next(res.data.length);
    })
    this.obtenerMetasActivasConProgresoPorUsuarioId(id).subscribe(res => {
      this.metaCumplimiento.next(res.data)
    })
    this.obtenerUsuarioPorId(id).subscribe(res => this.usuario.next(res.data));
  }
}