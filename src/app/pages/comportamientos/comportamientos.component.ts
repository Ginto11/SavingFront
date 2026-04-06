import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { GraficaService } from '../../services/grafica.service';
import { AuthService } from '../../services/auth.service';
import { GraficaLineChartComponent } from '../../components/grafica-line-chart/grafica-line-chart.component';
import { GraficaTwoLineChartComponent } from '../../components/grafica-two-line-chart/grafica-two-line-chart.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-comportamientos',
  imports: [GraficaLineChartComponent, GraficaTwoLineChartComponent],
  templateUrl: './comportamientos.component.html',
  styles: ``,
})
export default class ComportamientosComponent implements OnInit, OnDestroy {
  private onDestroy: Subject<boolean> = new Subject();
  private graficaService = inject(GraficaService);
  private authService = inject(AuthService);

  public chart!: Chart;
  labelsAhorro: number[] = [];
  dataAhorro: number[] = [];

  labelsIngreso: number[] = [];
  dataIngreso: number[] = [];

  labelsEgreso: number[] = [];
  dataEgreso: number[] = [];


  ngOnInit(): void {
    this.authService.usuarioLogueado.
    subscribe((usuario) => {
      this.graficaService.obtenerDataGrafica(usuario!.id).subscribe((resp) => {

        this.labelsAhorro = resp.data.listaAhorroPorDias.map((x: any) => x.dia);
        this.dataAhorro = resp.data.listaAhorroPorDias.map((x: any) => x.total);

        
        this.labelsIngreso = resp.data.listaIngresoPorDias.map((x: any) => x.dia);
        this.dataIngreso = resp.data.listaIngresoPorDias.map((x: any) => x.total);
        
        this.labelsEgreso = resp.data.listaEgresoPorDias.map((x: any) => x.dia);
        this.dataEgreso = resp.data.listaEgresoPorDias.map((x: any) => x.total);

      })
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }
}