import { Component, ElementRef, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { EventosService } from '../../services/eventos.service';
import { Subject, takeUntil } from 'rxjs';
import { Chart, ChartType } from 'chart.js';

@Component({
  selector: 'app-grafica-radar-chart',
  imports: [],
  templateUrl: './grafica-radar-chart.component.html',
  styles: ``
})
export class GraficaRadarChartComponent implements OnInit, OnChanges, OnDestroy {
  
  private eventosService = inject(EventosService);
  private onDestroy: Subject<boolean> = new Subject();
  @ViewChild('canvasElements') canvas!: ElementRef;
  chart!: Chart;
  dark: boolean = false;

  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() colorFondo: string = '';
  @Input() tituloLabel: string = '';
  @Input() tituloGrafica: string = '';
  @Input() borderColor: string = '';
  @Input() colorFondoPuntos: string = '';

  ngOnInit(): void {
    this.eventosService.themeDarkObservable
    .pipe(takeUntil(this.onDestroy))
    .subscribe(res => {
      if(document.documentElement.classList.contains('dark')){
        this.dark = res;
        if(this.chart){
          this.crearGrafica();
        }
      }else {
        this.dark = res;
        if(this.chart){
          this.crearGrafica();
        } 
      }
    })
  }
  ngOnChanges(): void {
    if(this.labels.length && this.data.length){
      this.crearGrafica();
    }
  }

  crearGrafica():void{
    if(this.chart){
      this.chart.destroy();
    }


    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'radar' as ChartType,
      data: {
        labels: this.labels,
        datasets: [{
          label: this.tituloLabel,
          data: this.data,
          fill: true,
          backgroundColor: this.colorFondo,
          borderColor: this.borderColor,
          pointBackgroundColor: '#833AB4',
        }]
      },
      options: {
        scales: {
          r: {
            grid: {
              color: (this.dark) ? '#FFF3' : '#36415330'
            },
            angleLines: {
              color: (this.dark) ? '#FFF3' : '#36415330'
            },
            pointLabels: {
              color: (this.dark) ? '#FFF' : '#364153'
            },
            ticks: {
              callback: function(valor){
                return `$ ${valor.toLocaleString('es-CO')}`
              },
              color: (this.dark) ? '#DADAD9' : '#6a7282',
              backdropColor: 'transparent',
              font: {
                size: window.innerWidth < 500 ? 10 : 12
              }
            }
          }
          
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: this.tituloGrafica,
            color: (this.dark) ? '#FFFFFF' : '#364153'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const valor = context.raw as number;
                return `${context.dataset.label}: $ ${valor.toLocaleString('es-CO')}`
              },
              title: (context) => {
                return `Categoria gasto: ${context[0].label}`
              }
            }
          }
        },
        elements: {
          line: {
            borderWidth: 4,
            borderColor: '#833AB4'
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }

}
