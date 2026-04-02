import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CardMetaComponent } from '../../components/card-meta/card-meta.component';
import { AuthService } from '../../services/auth.service';
import { MetaAhorroService } from '../../services/meta-ahorro.service';
import { Meta } from '../../interfaces/meta.interface';
import { Subject, takeUntil } from 'rxjs';
import { ModalesService } from '../../services/modales.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-metas',
  imports: [CardMetaComponent, FormsModule],
  templateUrl: './metas.component.html',
  styles: ``
})
export default class MetasComponent implements OnInit, OnDestroy {

  private auhService = inject(AuthService);
  private modalesService = inject(ModalesService);
  private onDestroy: Subject<boolean> = new Subject();
  private metaAhorroService = inject(MetaAhorroService);

  metas: Meta[] | null = null;
  metasBuscadas: string | null = null;

  ngOnInit():void {
    this.auhService.usuarioLogueado
    .pipe(takeUntil(this.onDestroy))
    .subscribe((usuario) => {
      this.metaAhorroService.refrescarInformacion(usuario!.id);
      this.metaAhorroService.todasLasMetasObservable.subscribe(res => {
        this.metas = res;
      })
    })
  }

  buscarMetasPorEstado(estado: string):void {
    this.auhService.usuarioLogueado
    .pipe(takeUntil(this.onDestroy))
    .subscribe(usuario => {
      this.metaAhorroService.obtenerMetasPorEstadoPorUsuarioId(usuario!.id, estado);
        this.metaAhorroService.metasCumplidasObservable
        .subscribe({
          next: (res) => this.metas = res
        })
    })
  }

  buscarMetaPorNombre():void {
    this.auhService.usuarioLogueado
    .pipe(takeUntil(this.onDestroy))
    .subscribe(usuario => {
      this.metaAhorroService.obtenerMetasBuscadasPorNombre(usuario!.id, (this.metasBuscadas)? this.metasBuscadas : '')
      .pipe(takeUntil(this.onDestroy))
      .subscribe({
        next: (res) => this.metas = res.data
      })
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }
}
