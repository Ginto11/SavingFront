import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalstorageService } from './localstorage.service';
import { EgresoDto } from '../interfaces/egreso-dto.interface';
import { TiposEgresosTotales } from '../interfaces/tipos-egresos-totales-dto.interface';
import { CrearEgresoDto } from '../interfaces/crear-egreso-dto.interface';
import { environment } from '../../environments/environment';
import { ServerResponse } from '../interfaces/server-response.interface';

@Injectable({
  providedIn: 'root'
})
export class EgresoService {

  private http = inject(HttpClient);
  private localstorage = inject(LocalstorageService);
  private totales = new BehaviorSubject<TiposEgresosTotales>({ totalApp: 0, totalEfectivo: 0, totalNequi: 0, totalBanco: 0 });
  private listaEgresos = new BehaviorSubject<EgresoDto[] | null>(null);

  totalesObservable = this.totales.asObservable();
  listaEgresosObservable = this.listaEgresos.asObservable();


  constructor() { }

  agregar = (egreso: CrearEgresoDto): Observable<any> => {

    const usuario = this.localstorage.getItem('usuario-saving');

    egreso.usuarioId = usuario.id;

    return this.http.post(`${environment.URL_SERVER}/api/egresos`, egreso);
  }


  actualizarInformacion = () => {

    const usuario = this.localstorage.getItem('usuario-saving');

    this.http.get<ServerResponse>(`${environment.URL_SERVER}/api/egresos/totales/usuario/${usuario.id}`).subscribe(res => this.totales.next(res.data));
    this.http.get<ServerResponse>(`${environment.URL_SERVER}/api/egresos/usuario/${usuario.id}`).subscribe(res => this.listaEgresos.next(res.data));
  }


}
