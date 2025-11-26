import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ServerResponse } from '../interfaces/server-response.interface';
import { BehaviorSubject, lastValueFrom, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { CrearNuevoAhorroDto } from '../interfaces/crear-nuevo-ahorro-dto.interface';
import { LocalstorageService } from './localstorage.service';
import { UltimoMovimiento } from '../interfaces/ultimo-movimiento.interface';
import { AuthService } from './auth.service';
import { CantidadesTotales } from '../interfaces/cantidades-totales.interface';

@Injectable({
  providedIn: 'root'
})
export class AhorroService {

  private http = inject(HttpClient);
  private localstorageService = inject(LocalstorageService);
  private authService = inject(AuthService);
  private movimientos = new BehaviorSubject<UltimoMovimiento[] | null>(null);
  private cantidadesTotales = new BehaviorSubject<CantidadesTotales>({ ahorroMes: 0, totalAhorrado: 0 });

  movimientosObservable = this.movimientos.asObservable();
  cantidadesTotalesObservable = this.cantidadesTotales.asObservable();

  constructor() { }

  agregarO = (ahorro: CrearNuevoAhorroDto):Observable<any> => {

    const token = this.localstorageService.getItem('usuario-saving').token;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

      return this.http.post(`${environment.URL_SERVER}/api/ahorros`, ahorro, { headers })
  }

  obtenerTotalesPorUsuarioIdO(id: number):Observable<ServerResponse> {
    return this.http.get<ServerResponse>(`${environment.URL_SERVER}/api/ahorros/usuario/cantidades/${id}`)
  }


  obtenerUltimosMovimientosPorUsuarioIdO(id: number): Observable<ServerResponse> {
      return this.http.get<ServerResponse>(`${environment.URL_SERVER}/api/ahorros/usuario/ultimos-movimientos/${id}`)
  }

  refrescarInformacion(id: number){
    this.obtenerTotalesPorUsuarioIdO(id).subscribe(res => this.cantidadesTotales.next(res.data));
    this.obtenerUltimosMovimientosPorUsuarioIdO(id).subscribe(res => this.movimientos.next(res.data));
  }
}
