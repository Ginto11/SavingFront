import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ServerResponse } from '../interfaces/server-response.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CrearNuevoAhorroDto } from '../interfaces/crear-nuevo-ahorro-dto.interface';
import { LocalstorageService } from './localstorage.service';
import { UltimoMovimiento } from '../interfaces/ultimo-movimiento.interface';
import { AuthService } from './auth.service';
import { CantidadesTotales } from '../interfaces/cantidades-totales.interface';
import { AhorroDto, ResultadoPaginaAhorros } from '../interfaces/resultado-pagina-ahorro.interface';

@Injectable({
  providedIn: 'root'
})
export class AhorroService {

  private http = inject(HttpClient);
  private localstorageService = inject(LocalstorageService);
  private movimientos = new BehaviorSubject<UltimoMovimiento[] | null>(null);
  private cantidadesTotales = new BehaviorSubject<CantidadesTotales>({ ahorroMes: 0, totalAhorrado: 0 });
  private listaAhorros = new BehaviorSubject<AhorroDto[] | null>(null);
  private resultadoPaginaAhorro = new BehaviorSubject<ResultadoPaginaAhorros | null>(null);

  movimientosObservable = this.movimientos.asObservable();
  listaAhorrosObservable = this.listaAhorros.asObservable();
  resultadoPaginaAhorros = this.resultadoPaginaAhorro.asObservable();
  cantidadesTotalesObservable = this.cantidadesTotales.asObservable();

  constructor() { }

  agregarO = (ahorro: CrearNuevoAhorroDto):Observable<any> => {

    const usuario = this.localstorageService.getItem('usuario-saving');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${usuario.token}`
    })

      return this.http.post(`${environment.URL_SERVER_VERSION_1}/ahorros`, ahorro, { headers })
  }

  eliminarAhorro(id: number):Observable<any> {
    return this.http.delete(`${environment.URL_SERVER_VERSION_1}/ahorros/${id}`)
  }

  obtenerTotalesPorUsuarioIdO(id: number):Observable<ServerResponse> {
    return this.http.get<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/ahorros/usuario/cantidades/${id}`)
  }

  obtenerPaginaAhorros(id: number, paginaActual: number, tamanoPagina: number) {
    this.http.get<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/ahorros/usuario/${id}`, {
      params: {
        paginaActual,
        tamanoPagina
      }
    }).subscribe(res => this.resultadoPaginaAhorro.next(res.data))
  }


  obtenerUltimosMovimientosPorUsuarioIdO(id: number): Observable<ServerResponse> {
      return this.http.get<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/ahorros/usuario/ultimos-movimientos/${id}`)
  }

  refrescarInformacion(id: number){
    this.obtenerTotalesPorUsuarioIdO(id).subscribe(res => this.cantidadesTotales.next(res.data));
    this.obtenerUltimosMovimientosPorUsuarioIdO(id).subscribe(res => {this.movimientos.next(res.data); console.log(res)});
  }
}
