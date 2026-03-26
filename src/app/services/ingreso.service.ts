import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalstorageService } from './localstorage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IngresoDto } from '../interfaces/ingreso-dto.interface';
import { environment } from '../../environments/environment';
import { TiposIngresosTotales } from '../interfaces/tipos-ingresos-totales-dto.interface';
import { ServerResponse } from '../interfaces/server-response.interface';
@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  private http = inject(HttpClient);
  private localstorage = inject(LocalstorageService);
  private totales = new BehaviorSubject<TiposIngresosTotales>({ totalApp: 0, totalEfectivo: 0, totalNequi: 0 });

  totalesObservable = this.totales.asObservable();


  constructor() { }

  agregar = (ingreso: IngresoDto): Observable<any> => {

    const usuario = this.localstorage.getItem('usuario-saving');

    ingreso.usuarioId = usuario.usuarioId;

    return this.http.post(`${environment.URL_SERVER}/api/ingresos`, ingreso);
  }


  actualizarInformacion = () => {

    const usuario = this.localstorage.getItem('usuario-saving');

    this.http.get<ServerResponse>(`${environment.URL_SERVER}/api/ingresos/${usuario.id}`).subscribe(res => this.totales.next(res.data));
  }

}
