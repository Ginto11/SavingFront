import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CrearMetaDTO } from '../interfaces/crear-meta-dto.interface';
import { ServerResponse } from '../interfaces/server-response.interface';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetaAhorroService {

  private http = inject(HttpClient);

  constructor() { }

  crearMeta = async(meta: CrearMetaDTO): Promise<any> => {
    try{
      return await lastValueFrom(
        this.http.post(`${environment.URL_SERVER}/api/metas`, meta)
      )
    }catch(error){
      throw error;
    }
  } 

  buscarMetasPorUsuarioId = async (id: number) :Promise<ServerResponse> => {
    try{
      return await lastValueFrom(
        this.http.get<ServerResponse>(`${environment.URL_SERVER}/api/metas/usuario/${id}`)
      )
    }catch(error){
      throw error;
    }
  }

  obtenerMetasConCumplimiento = async (id: number):Promise<ServerResponse> => {
    try {
      return await lastValueFrom(
        this.http.get<ServerResponse>(`${environment.URL_SERVER}/api/metas/cumplimiento/usuario/${id}`)
      );
    } catch (error) {
      throw error;
    }
  }
}
