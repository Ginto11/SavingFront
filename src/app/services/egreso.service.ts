import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalstorageService } from './localstorage.service';
import { EgresoDto } from '../interfaces/egreso-dto.interface';
import { TiposEgresosTotales } from '../interfaces/tipos-egresos-totales-dto.interface';
import { CrearEgresoDto } from '../interfaces/crear-egreso-dto.interface';
import { environment } from '../../environments/environment';
import { ServerResponse } from '../interfaces/server-response.interface';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class EgresoService {

  private http = inject(HttpClient);
  private usuarioService = inject(UsuarioService);
  private localstorage = inject(LocalstorageService);



  constructor() { }

  agregar = (egreso: CrearEgresoDto): Observable<any> => {

    const usuario = this.localstorage.getItem('usuario-saving');

    egreso.usuarioId = usuario.id;

    return this.http.post(`${environment.URL_SERVER_VERSION_1}/egresos`, egreso);
  }

  eliminarEgreso(id: number, tipo: string, usuarioId: number):Observable<ServerResponse> {
    return this.http.delete<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/egresos/${id}`, {
      params: {
        tipo,
        usuarioId
      }
    });
  }

  actualizarInformacion = () => {

    const usuario = this.localstorage.getItem('usuario-saving');

    this.usuarioService.listarEgresos(usuario.id);
    this.usuarioService.obtenerTotalesEgresos(usuario.id);

  }


}
