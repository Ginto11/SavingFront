import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DataGrafica } from '../interfaces/data-grafica.interface';

@Injectable({
  providedIn: 'root'
})
export class GraficaService {

  private http = inject(HttpClient);

  constructor() { }

  obtenerDataGrafica(id: number):Observable<DataGrafica>{
    return this.http.get<DataGrafica>(`${environment.URL_SERVER_VERSION_1}/grafica/${id}`);
  }
}
