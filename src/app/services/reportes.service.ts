import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private http = inject(HttpClient);

  exportarExcel(id: number){
    return this.http.get(`${environment.URL_SERVER_VERSION_1}/reportes/exportar-excel/${id}`, {
      'responseType': 'blob'
    })
  }
}
