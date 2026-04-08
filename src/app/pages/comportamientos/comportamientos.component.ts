import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { GraficaService } from '../../services/grafica.service';
import { AuthService } from '../../services/auth.service';
import { GraficaLineChartComponent } from '../../components/grafica-line-chart/grafica-line-chart.component';
import { GraficaTwoLineChartComponent } from '../../components/grafica-two-line-chart/grafica-two-line-chart.component';
import { Subject, takeUntil } from 'rxjs';
import { GraficaRadarChartComponent } from '../../components/grafica-radar-chart/grafica-radar-chart.component';
import { GraficaBarrasChartComponent } from '../../components/grafica-barras-chart/grafica-barras-chart.component';

@Component({
  selector: 'app-comportamientos',
  imports: [GraficaBarrasChartComponent, GraficaLineChartComponent, GraficaTwoLineChartComponent, GraficaRadarChartComponent],
  templateUrl: './comportamientos.component.html',
  styles: ``,
})
export default class ComportamientosComponent implements OnInit, OnDestroy {
  private onDestroy: Subject<boolean> = new Subject();
  private graficaService = inject(GraficaService);
  private authService = inject(AuthService);

  public chart!: Chart;
  labelsAhorro: string[] = [];
  dataAhorro: number[] = [];

  labelsIngreso: string[] = [];
  dataIngreso: number[] = [];

  labelsEgreso: string[] = [];
  dataEgreso: number[] = [];

  labelsEgresoPorCategoria: string[] = [];
  dataEgresoPorCategoria: number[] = [];

  labelsMetaCumplientoGrafica: string[] = [];
  dataMetaCumplimientoGraficaMontosActuales: number[] = [];
  dataMetaCumplimientoGraficaMontosObjetivos: number[] = [];

  labelsRentabilidad: string[] = [];
  dataRentabilidad: number[] = [];


  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.authService.usuarioLogueado
    .pipe(takeUntil(this.onDestroy))
    .subscribe((usuario) => {
      this.graficaService.obtenerDataGrafica(usuario!.id)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((resp) => {

        this.labelsAhorro = resp.data.listaAhorroPorDias.map((x: any) => x.dia.toString());
        this.dataAhorro = resp.data.listaAhorroPorDias.map((x: any) => x.total);
        
        this.labelsIngreso = resp.data.listaIngresoPorDias.map((x: any) => x.dia.toString());
        this.dataIngreso = resp.data.listaIngresoPorDias.map((x: any) => x.total);
        
        this.labelsEgreso = resp.data.listaEgresoPorDias.map((x: any) => x.dia.toString());
        this.dataEgreso = resp.data.listaEgresoPorDias.map((x: any) => x.total);

        this.labelsEgresoPorCategoria = resp.data.listaEgresoPorCategoria.map((x: any) => x.nombreCategoria);
        this.dataEgresoPorCategoria = resp.data.listaEgresoPorCategoria.map((x: any) => x.total);

        this.labelsMetaCumplientoGrafica = resp.data.listaMetaCumplimiento.map((x: any) => x.nombreMeta);
        this.dataMetaCumplimientoGraficaMontosActuales = resp.data.listaMetaCumplimiento.map((x: any) => x.montoActual);
        this.dataMetaCumplimientoGraficaMontosObjetivos = resp.data.listaMetaCumplimiento.map((x: any) => x.montoObjetivo);

        this.labelsRentabilidad = resp.data.listaRentabilidad.map((x: any) => x.dia.toString());
        this.dataRentabilidad = resp.data.listaRentabilidad.map((x: any) => x.diferencia);

        console.log(resp)

      })
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }
}