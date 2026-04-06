import { Component, ElementRef, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { EventosService } from '../../services/eventos.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-line-two-grafica-chart',
  imports: [],
  templateUrl: './grafica-two-line-chart.component.html',
  styles: ``,
})
export class GraficaTwoLineChartComponent implements OnChanges, OnInit, OnDestroy {

  private eventosService = inject(EventosService);
  private onDestroy: Subject<boolean> = new Subject();

  @Input() labels: string[] = [];
  @Input() data1: number[] = [];
  @Input() data2: number[] = [];
  @Input() tituloGrafica: string = '';
  @Input() textoLabelX: string = '';
  @Input() textoLabelY: string = '';
  @Input() colorLabel1: string = '';
  @Input() colorLabel2: string = '';
  @Input() tituloLabel1: string = '';
  @Input() tituloLabel2: string = '';
  @Input() bordeColor1: string = '';
  @Input() bordeColor2: string = '';
  @Input() fondoColor1: string = '';
  @Input() fondoColor2: string = '';

  @ViewChild('canvasElements') canvas!: ElementRef;
  dark!:boolean;
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
    if(this.labels.length && this.data1.length && this.data2.length){
      this.crearGrafica();
    }
  }

  crearGrafica(): void {

    if(this.chart){
      this.chart.destroy();
    }

    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line' as ChartType,
      data: {
        labels: this.labels,
        datasets: [
          {
            label: this.tituloLabel1,
            data: this.data1,
            borderColor: this.bordeColor1,
            backgroundColor: this.fondoColor1,
            tension: 0.5
          },
          {
            label: this.tituloLabel2,
            borderColor: this.bordeColor2,
            data: this.data2,
            backgroundColor: this.fondoColor2,
            tension: 0.5
          }
        ],
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
          legend: {
            position: 'top',
          },
        },
        scales: {
          y: {
            grid: {
              color: (this.dark) ? '#FFF3' : '#36415330'
            },
            ticks: {
              callback: function(value) {
                  return '$ ' + Number(value).toLocaleString();
                },
              color: (this.dark) ? '#DADAD9' : '#6a7282'
            },
            position: 'right',
            title: {
              display: true,
              text: this.textoLabelY,
              color: (this.dark) ? '#FFF' : '#364153'
            }
          },
          x: {
            grid: {
              color: (this.dark) ? '#FFF3' : '#36415330'
            },
            title: {
              display: true,
              text: this.textoLabelX,
              color: (this.dark) ? '#FFF' : '#364153'
            },
            ticks: {
              color: (this.dark) ? '#DADAD9' : '#364153'
            }
          }
        }
      },
      
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }
}
