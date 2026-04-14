import { Component, inject, Input } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ReportesService } from '../../services/reportes.service';

@Component({
  selector: 'app-exportar-excel-button',
  imports: [],
  templateUrl: './exportar-excel-button.component.html',
  styles: ``
})
export class ExportarExcelButtonComponent {

  private authService = inject(AuthService);
  private reportesService = inject(ReportesService);
  private onDestroy: Subject<boolean> = new Subject();

  exportando: boolean = false;

  exportarExcel():void{
      this.authService.usuarioLogueado
      .pipe(takeUntil(this.onDestroy))
      .subscribe(usuario => {
        this.exportando = true;
        this.reportesService.exportarExcel(usuario!.id)
        .pipe(takeUntil(this.onDestroy))
        .subscribe({
          next: res => {
            let url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Reporte.xlsx`;
            a.click();
          },
          complete: () => this.exportando = false
        })
      })
    }

}
