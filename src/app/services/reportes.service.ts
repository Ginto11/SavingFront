import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private http = inject(HttpClient);

  exportarExcel(id: number){
    return this.http.get(`${environment.URL_SERVER}/api/reportes/exportar-excel/${id}`, {
      'responseType': 'blob'
    })
  }
}
