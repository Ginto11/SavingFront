import { AfterViewInit, Component, ElementRef, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { EventosService } from '../../services/eventos.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-grafica-barras-chart',
  imports: [],
  templateUrl: './grafica-barras-chart.component.html',
  styles: ``
})
export class GraficaBarrasChartComponent implements OnInit, OnChanges, OnDestroy {

  private eventosService = inject(EventosService);
  private onDestroy: Subject<boolean> = new Subject();


  @Input() labels: string[] = [];
  @Input() data1: number[] = [];
  @Input() data2: number[] = [];
  @Input() tituloLabel1: string = '';
  @Input() tituloLabel2: string = '';
  @Input() tituloGrafica: string = '';
  @Input() colorFondo1: string = '';
  @Input() colorFondo2: string = '';
  @Input() tituloLabelY: string = '';
  @Input() tituloLabelX: string = '';
  @Input() colorBorde1: string = '';
  @Input() colorBorde2: string = '';


  @ViewChild('canvasChartBarras') canvas!: ElementRef;
  dark: boolean = false;
  chart!: Chart;

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
    if(this.data1.length && this.data2.length && this.labels.length){
      this.crearGrafica();
    }
  }

  crearGrafica():void{

    if(this.chart){
      this.chart.destroy();
    }

    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'bar' as ChartType,
      data: {
        labels: this.labels,
        datasets: [
          {
            label: this.tituloLabel1,
            data: this.data1,
            backgroundColor: this.colorFondo1,
            borderColor: this.colorBorde1,
            borderWidth: 2
          },
          {
            label: this.tituloLabel2,
            data: this.data2,
            backgroundColor: this.colorFondo2,
            borderColor: this.colorBorde2,
            borderWidth: 2
          }
        ]
      },
      options: {
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
                return `${context.dataset.label}: $ ${valor.toLocaleString('es-CO')}`;
              },
              title: function(context){
                return `Meta: ${context[0].label}`
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: (this.dark) ? '#FFF3' : '#36415330'
            },
            ticks: {
              callback: function(value) {
                const valor = value as number;
                const label = this.getLabelForValue(valor);
                return label.length > 5 ? label.substring(0, 5) + '...' : label;
              },
              color: (this.dark) ? '#DADAD9' : '#6a7282',
              minRotation: window.innerWidth < 500 ? 90 : 0,
              maxRotation: window.innerWidth < 500 ? 90 : 0,
              font: {
                size: window.innerWidth < 500 ? 9 : 12
              }
            },
            title: {
              display: true,
              text: this.tituloLabelX,
              color: (this.dark) ? '#FFF' : '#364153'
            }
          },
          y: {
            position: 'right',
            grid: {
              color: (this.dark) ? '#FFF3' : '#36415330'
            },
            ticks: {
              callback: function(valor){
                return `$ ${valor.toLocaleString('es-CO')}`
              },
              color: (this.dark) ? '#DADAD9' : '#6a7282',
              font: {
                size: window.innerWidth < 500 ? 9 : 12
              }
            },
            title: {
              display: true,
              text: this.tituloLabelY,
              color: (this.dark) ? '#FFF' : '#364153'
            }
          }
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }
  
}
