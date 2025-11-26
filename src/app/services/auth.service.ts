import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { UsuarioLogin } from '../interfaces/usuario-login.interface';
import { ServerResponse } from '../interfaces/server-response.interface';
import { BehaviorSubject, lastValueFrom, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { UsuarioLogueado } from '../interfaces/usuario-logueado.interface';
import { LocalstorageService } from './localstorage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private router = inject(Router);
  private http = inject(HttpClient);
  private localstorageService = inject(LocalstorageService);

  private _usuarioLogueado = new BehaviorSubject<UsuarioLogueado | null>(this.obtenerUsuario());

  usuarioLogueado = this._usuarioLogueado.asObservable();

  constructor() { }

  login(usuario: UsuarioLogin):Observable<ServerResponse> {
      return this.http.post<ServerResponse>(`${environment.URL_SERVER}/api/auth`, usuario).pipe(
        tap(res => {
        if(res.codigo == 200){
          this.localstorageService.setItem<UsuarioLogueado>(res.data);
          this._usuarioLogueado.next(res.data);
          this.router.navigate(['dashboard'])
        }})
      )
  }

  cerrarSesion = ():void => {
    this.localstorageService.removerItem();
    this.router.navigate(['inicio']);
  }

  obtenerUsuario(): UsuarioLogueado | null {
    return this.localstorageService.getItem('usuario-saving');
  }


}
