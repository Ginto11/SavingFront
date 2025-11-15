import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ServerResponse } from '../interfaces/server-response.interface';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { CrearNuevoAhorroDto } from '../interfaces/crear-nuevo-ahorro-dto.interface';

@Injectable({
  providedIn: 'root'
})
export class AhorroService {

  private http = inject(HttpClient);

  constructor() { }

  agregar = async (ahorro: CrearNuevoAhorroDto):Promise<any> => {
    try {
      return await lastValueFrom(
        this.http.post(`${environment.URL_SERVER}/api/ahorros`, ahorro)
      );
    } catch (error) {
      throw error;
    }
  }

  obtenerTotalesPorUsuarioId = async(id: number): Promise<ServerResponse> => {
    try{
      return await lastValueFrom(
        this.http.get<ServerResponse>(`${environment.URL_SERVER}/api/ahorros/usuario/cantidades/${id}`)
      )
    }catch(error){
      throw error;
    }
  }

  obtenerUltimosMovimientosPorUsuarioId = async(id: number): Promise<ServerResponse> => {
    try{
      return await lastValueFrom(
        this.http.get<ServerResponse>(`${environment.URL_SERVER}/api/ahorros/usuario/ultimos-movimientos/${id}`)
      )
    }catch(error){
      throw error;
    }
  }
}
