import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CardMetaComponent } from '../../components/card-meta/card-meta.component';
import { AuthService } from '../../services/auth.service';
import { MetaAhorroService } from '../../services/meta-ahorro.service';
import { Meta } from '../../interfaces/meta.interface';
import { Subject, takeUntil } from 'rxjs';
import { ModalesService } from '../../services/modales.service';

@Component({
  selector: 'app-metas',
  imports: [CardMetaComponent],
  templateUrl: './metas.component.html',
  styles: ``
})
export default class MetasComponent implements OnInit, OnDestroy {

  private auhService = inject(AuthService);
  private modalesService = inject(ModalesService);
  private onDestroy: Subject<boolean> = new Subject();
  private metaAhorroService = inject(MetaAhorroService);

  metas: Meta[] | null = null;

  ngOnInit():void {
    this.auhService.validarToken()
      .pipe(takeUntil(this.onDestroy))
      .subscribe({
        next: () => {
          this.auhService.usuarioLogueado
          .pipe(takeUntil(this.onDestroy))
          .subscribe((usuario) => {
            this.metaAhorroService.refrescarInformacion(usuario!.id);
            this.metaAhorroService.todasLasMetasObservable.subscribe({
            next: (res) => { this.metas = res; console.log(res); },
            error: (err) => { this.modalesService.modalError(err) }
            })
          })
        },
        error: (err) => { this.modalesService.modalError(err) }})
  }

  buscarMetasCumplidas(estado: string):void {
    this.auhService.validarToken()
      .pipe(takeUntil(this.onDestroy))
      .subscribe({
        next: () => {
          this.auhService.usuarioLogueado
            .pipe(takeUntil(this.onDestroy))
            .subscribe(usuario => {
              this.metaAhorroService.obtenerMetasCumplidasPorUsuarioId(usuario!.id, estado);
                this.metaAhorroService.metasCumplidasObservable
                .subscribe({
                  next: (res) => this.metas = res,
                  error: (err) => this.modalesService.modalError(err) 
                })
            })
        }, 
        error: (err) => this.modalesService.modalError(err) 
      })
  }

  ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }
}
