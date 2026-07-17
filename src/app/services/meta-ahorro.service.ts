import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CrearMetaDTO } from '../interfaces/crear-meta-dto.interface';
import { ServerResponse } from '../interfaces/server-response.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CumplimientoMetaAhorro } from '../interfaces/cumplimiento-meta-ahorro.interface';
import { Meta } from '../interfaces/meta.interface';
import { ActualizarMetaDto } from '../interfaces/actualizar-meta-dto.interface';
import { ModalesService } from './modales.service';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class MetaAhorroService {

  private http = inject(HttpClient);
  private usuarioService = inject(UsuarioService);

  crearMeta(meta: CrearMetaDTO) :Observable<any> {
      return this.http.post<any>(`${environment.URL_SERVER_VERSION_1}/metas`, meta);
  } 

  cancelarMetaPorId(id: number): Observable<ServerResponse> {
    return this.http.delete<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/metas/cancelar/${id}`);
  }

  actualizarMeta(id: number, actualizarMetaDto: ActualizarMetaDto): Observable<ServerResponse> {
    return this.http.put<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/metas/${id}`,  actualizarMetaDto);
  }

  refrescarInformacion(id: number):void{
    this.usuarioService.obtenerMetasActivasConProgresoPorUsuarioId(id);
    this.usuarioService.buscarMetaPorNombreYEstado(id, '', '');
  }
}
