import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CrearMetaDTO } from '../interfaces/crear-meta-dto.interface';
import { ServerResponse } from '../interfaces/server-response.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CumplimientoMetaAhorro } from '../interfaces/cumplimiento-meta-ahorro.interface';
import { Meta } from '../interfaces/meta.interface';
import { ActualizarMetaDto } from '../interfaces/actualizar-meta-dto.interface';

@Injectable({
  providedIn: 'root'
})
export class MetaAhorroService {

  private http = inject(HttpClient);
  private metaCumplimiento = new BehaviorSubject<CumplimientoMetaAhorro[]>([]);
  private cantidadActivasMetas = new BehaviorSubject<number>(0);
  private metasActivas = new BehaviorSubject<Meta[]>([])
  private todasLasMetas = new BehaviorSubject<Meta[]>([]);

  metaCumplimientoObservable = this.metaCumplimiento.asObservable();
  cantidadMetasObservable = this.cantidadActivasMetas.asObservable();
  metasActivasObservable = this.metasActivas.asObservable();
  todasLasMetasObservable = this.todasLasMetas.asObservable();

  crearMeta(meta: CrearMetaDTO) :Observable<any> {
      return this.http.post<any>(`${environment.URL_SERVER}/api/metas`, meta);
  } 

  cancelarMetaPorId(id: number): Observable<ServerResponse> {
    return this.http.delete<ServerResponse>(`${environment.URL_SERVER}/api/metas/cancelar/${id}`);
  }

  actualizarMeta(id: number, actualizarMetaDto: ActualizarMetaDto): Observable<ServerResponse> {
    return this.http.put<ServerResponse>(`${environment.URL_SERVER}/api/metas/${id}`,  actualizarMetaDto);
  }

  obtenerCantidadMetasActivasPorUsuarioId(id: number) :Observable<ServerResponse> {
      return this.http.get<ServerResponse>(`${environment.URL_SERVER}/api/metas/usuario/${id}`);
  }

  obtenerProgresoDeMetasPorUsuarioId(id: number):Observable<ServerResponse> {
      return this.http.get<ServerResponse>(`${environment.URL_SERVER}/api/metas/progreso/usuario/${id}`);
  }

  obtenerTodasLasMetasPorUsuarioId(id: number):Observable<ServerResponse> {
    return this.http.get<ServerResponse>(`${environment.URL_SERVER}/api/metas/usuario/${id}/todas`);
  }

  refrescarInformacion(id: number){
    this.obtenerProgresoDeMetasPorUsuarioId(id).subscribe(res => this.metaCumplimiento.next(res.data));
    this.obtenerCantidadMetasActivasPorUsuarioId(id).subscribe(res => this.cantidadActivasMetas.next(res.data.length));
    this.obtenerCantidadMetasActivasPorUsuarioId(id).subscribe(res => this.metasActivas.next(res.data));
    this.obtenerTodasLasMetasPorUsuarioId(id).subscribe(res => this.todasLasMetas.next(res.data));
  }
}
