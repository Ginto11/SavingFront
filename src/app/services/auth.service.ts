import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { UsuarioLogin } from '../interfaces/usuario-login.interface';
import { ServerResponse } from '../interfaces/server-response.interface';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  constructor() { }

  login = async (usuario: UsuarioLogin) :Promise<ServerResponse> => {
    try{
      return await lastValueFrom(
        this.http.post<ServerResponse>(`${environment.URL_SERVER}/api/auth`, usuario)
      );
    }catch(error){
      throw error;
    }
  }
}
