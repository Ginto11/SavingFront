import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ServerResponse } from '../interfaces/server-response.interface';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { CrearUsuarioDto } from '../interfaces/crear-usuario-dto.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);

  constructor() {}

  agregar = async (usuario: CrearUsuarioDto) :Promise<any> => {
    try{

      return await lastValueFrom(
        this.http.post(`${environment.URL_SERVER}/api/usuarios`, usuario)
      )

    }catch(error){
      throw error;
    }
  }
  

}
