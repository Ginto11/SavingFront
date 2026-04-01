import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerResponse } from '../interfaces/server-response.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaGastoService {


  private http = inject(HttpClient);


  obtenerCategoriasGastos():Observable<ServerResponse> {
    return this.http.get<ServerResponse>(`${environment.URL_SERVER}/api/categoria-gasto`);
  }

}
