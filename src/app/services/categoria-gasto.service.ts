import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ServerResponse } from '../interfaces/server-response.interface';
import { environment } from '../../environments/environment';
import { CategoriaGasto } from '../interfaces/categoria-gasto-dto.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriaGastoService {

  private categorias = new BehaviorSubject<CategoriaGasto[]>([]);

  categoriasObservable = this.categorias.asObservable();

  private http = inject(HttpClient);


  obtenerCategoriasGastos() {
    this.http.get<ServerResponse>(`${environment.URL_SERVER_VERSION_1}/categoria-gasto`)
      .subscribe(res => this.categorias.next(res.data));
  }

}
