import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalstorageService } from './localstorage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IngresoDto } from '../interfaces/ingreso-dto.interface';
import { environment } from '../../environments/environment';
import { TiposIngresosTotales } from '../interfaces/tipos-ingresos-totales-dto.interface';
import { ServerResponse } from '../interfaces/server-response.interface';
import { CrearIngresoDto } from '../interfaces/crear-ingreso-dto.interface';
@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  private http = inject(HttpClient);
  private localstorage = inject(LocalstorageService);
  private totales = new BehaviorSubject<TiposIngresosTotales>({ totalApp: 0, totalEfectivo: 0, totalNequi: 0, totalBanco: 0 });
  private listaIngresos = new BehaviorSubject<IngresoDto[] | null>(null);

  totalesObservable = this.totales.asObservable();
  listaIngresosObservable = this.listaIngresos.asObservable();


  constructor() { }

  agregar = (ingreso: CrearIngresoDto): Observable<any> => {

    const usuario = this.localstorage.getItem('usuario-saving');

    ingreso.usuarioId = usuario.id;

    return this.http.post(`${environment.URL_SERVER_VERSION_1}/api/ingresos`, ingreso);
  }


  actualizarInformacion = () => {

    const usuario = this.localstorage.getItem('usuario-saving');

    this.http.get<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/ingresos/totales/usuario/${usuario.id}`).subscribe(res => this.totales.next(res.data));
    this.http.get<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/ingresos/usuario/${usuario.id}`).subscribe(res => this.listaIngresos.next(res.data));
  }

}
