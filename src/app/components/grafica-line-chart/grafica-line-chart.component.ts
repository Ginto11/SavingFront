import { Component, ElementRef, inject, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { EventosSidebarService } from '../../services/eventos-sidebar.service';
import { EventosService } from '../../services/eventos.service';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-line-grafica-chart',
  imports: [],
  templateUrl: './grafica-line-chart.component.html',
  styles: ``
})
export class GraficaLineChartComponent implements OnChanges, OnInit {

  private eventosService = inject(EventosService);
  private onDestroy: Subject<boolean> = new Subject();
  

  @ViewChild('canvasElement') canvas!: ElementRef;
  chart!: Chart;

  dark!:boolean;

  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() tituloGrafica: string = '';
  @Input() tituloLabel: string = '';
  @Input() textoLabelX: string = '';
  @Input() textoLabelY: string = '';
  @Input() colorFondo: string = '';
  @Input() bordeColor: string = '';
  @Input() alineacionVerticalLabelsX: boolean = false;

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

  ngOnChanges() {
    if (this.labels.length && this.data.length) {
      this.crearGrafica();
    }
  }

  crearGrafica(){

    if(this.chart){
      this.chart.destroy();
    }

    this.chart = new Chart(this.canvas.nativeElement, {
        type: 'line' as ChartType,
        data: {
          labels: this.labels,
          datasets: [{
            label: this.tituloLabel,
            data: this.data,
            borderColor: this.bordeColor,
            backgroundColor: this.colorFondo,
            tension: 0.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: this.tituloGrafica,
              color: (this.dark) ? '#FFFFFF' : '#364153'
            }
          },
          scales: {
            x: {
              grid: {
                color: (this.dark) ? '#FFF3' : '#36415330'
              },
              ticks: {
                color: (this.dark) ? '#DADAD9' : '#364153',
                minRotation: (this.alineacionVerticalLabelsX) ? 90 : 0,
                maxRotation: (this.alineacionVerticalLabelsX) ? 90 : 0,
                font: {
                }
              },
              title: {
                display: true,
                text: this.textoLabelX,
                color: (this.dark) ? '#FFF' : '#364153'
              }
            },
            y: {
              grid: {
                color: (this.dark) ? '#FFF3' : '#36415330'
              },
              title: {
                display: true,
                text: this.textoLabelY,
                color: (this.dark) ? '#FFF' : '#364153'
              },
              position: 'right',
              ticks: {
                callback: function(value) {
                  return '$ ' + Number(value).toLocaleString();
                },
                color: (this.dark) ? '#DADAD9' : '#6a7282'
              }
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
