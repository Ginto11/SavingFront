import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ServerResponse } from '../interfaces/server-response.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CrearNuevoAhorroDto } from '../interfaces/crear-nuevo-ahorro-dto.interface';
import { LocalstorageService } from './localstorage.service';
import { UltimoMovimiento } from '../interfaces/ultimo-movimiento.interface';
import { CantidadesTotales } from '../interfaces/cantidades-totales.interface';
import { AhorroDto } from '../interfaces/resultado-paginado.interface';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AhorroService {

  private http = inject(HttpClient);
  private usuarioService = inject(UsuarioService);
  private localstorageService = inject(LocalstorageService);
  
  private listaAhorros = new BehaviorSubject<AhorroDto[] | null>(null);

  listaAhorrosObservable = this.listaAhorros.asObservable();
  
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

  refrescarInformacion(id: number){
    this.usuarioService.obtenerTotalesPorUsuario(id);
    this.usuarioService.obtenerUltimosMovimientos(id);
  }
}
