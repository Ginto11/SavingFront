import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CardMetaComponent } from '../../components/card-meta/card-meta.component';
import { AuthService } from '../../services/auth.service';
import { MetaAhorroService } from '../../services/meta-ahorro.service';
import { Meta } from '../../interfaces/meta.interface';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-metas',
  imports: [CardMetaComponent, FormsModule],
  templateUrl: './metas.component.html',
  styles: ``
})
export default class MetasComponent implements OnInit, OnDestroy {

  private auhService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private onDestroy: Subject<boolean> = new Subject();
  private metaAhorroService = inject(MetaAhorroService);

  metas: Meta[] | null = null;
  metasBuscadas: string | null = null;

  ngOnInit():void {
    this.auhService.usuarioLogueado
    .pipe(takeUntil(this.onDestroy))
    .subscribe((usuario) => {
      this.usuarioService.buscarMetaPorNombreYEstado(usuario!.id, '', '')
      .pipe(takeUntil(this.onDestroy))
      .subscribe(res => {
        this.metas = res.data;
      })
    })
  }

  buscarMetaPorNombre():void {
    this.auhService.usuarioLogueado
    .pipe(takeUntil(this.onDestroy))
    .subscribe(usuario => {
      this.usuarioService.buscarMetaPorNombreYEstado(usuario!.id, (this.metasBuscadas)? this.metasBuscadas : '', '')
      .pipe(takeUntil(this.onDestroy))
      .subscribe({
        next: (res) => this.metas = res.data
      })
    })
  }

  buscarMetasPorEstado(estado: string):void {
    this.auhService.usuarioLogueado
    .pipe(takeUntil(this.onDestroy))
    .subscribe(usuario => {
      this.usuarioService.buscarMetaPorNombreYEstado(usuario!.id, '', estado)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(res => {
          this.metas = res.data;
        })
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }
}
