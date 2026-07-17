import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalstorageService } from './localstorage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IngresoDto } from '../interfaces/ingreso-dto.interface';
import { environment } from '../../environments/environment';
import { TiposIngresosTotales } from '../interfaces/tipos-ingresos-totales-dto.interface';
import { ServerResponse } from '../interfaces/server-response.interface';
import { CrearIngresoDto } from '../interfaces/crear-ingreso-dto.interface';
import { UsuarioService } from './usuario.service';
@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  private http = inject(HttpClient);
  private usuarioService = inject(UsuarioService);
  private localstorage = inject(LocalstorageService);



  constructor() { }

  agregar = (ingreso: CrearIngresoDto): Observable<any> => {

    const usuario = this.localstorage.getItem('usuario-saving');

    ingreso.usuarioId = usuario.id;

    return this.http.post(`${environment.URL_SERVER_VERSION_1}/ingresos`, ingreso);
  }

  eliminarIngreso(id: number, tipo: string, usuarioId: number):Observable<ServerResponse> {
    return this.http.delete<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/ingresos/${id}`, {
      params: {
        tipo,
        usuarioId
      }   
    })
  }

  actualizarInformacion = () => {
    const usuario = this.localstorage.getItem('usuario-saving');
    this.usuarioService.obtenerTotalesIngresos(usuario.id);
    this.usuarioService.listarIngresos(usuario.id);
  }
}
