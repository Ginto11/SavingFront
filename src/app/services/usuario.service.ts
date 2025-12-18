import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CrearUsuarioDto } from '../interfaces/crear-usuario-dto.interface';
import { ServerResponse } from '../interfaces/server-response.interface';
import { UsuarioDto } from '../interfaces/usuario-dto.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);
  private usuario = new BehaviorSubject<UsuarioDto>({
    id: 0,
    primerNombre: '',
    primerApellido: '',
    cedula: 0,
    correo: '',
    fechaNacimiento: null,
    manejaGastos: false,
    fotoPerfil: '',
    nuevaFoto: null
  });

  usuarioObservable = this.usuario.asObservable();

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

  actualizar(id: number, formData: FormData):Observable<ServerResponse> {
    return this.http.put<ServerResponse>(`${environment.URL_SERVER}/api/usuarios/${id}`, formData)
  }

  obtenerUsuarioPorId(id: number):Observable<ServerResponse> {
    return this.http.get<ServerResponse>(`${environment.URL_SERVER}/api/usuarios/${id}`)
  }

  refrescarInformacion(id: number){
    this.obtenerUsuarioPorId(id).subscribe(res => this.usuario.next(res.data));
  }
  

}
