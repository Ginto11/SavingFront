import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CardMetaComponent } from '../../components/card-meta/card-meta.component';
import { AuthService } from '../../services/auth.service';
import { MetaAhorroService } from '../../services/meta-ahorro.service';
import { Meta } from '../../interfaces/meta.interface';
import { ModalNormalComponent } from '../../shared/modal-normal/modal-normal.component';

@Component({
  selector: 'app-metas',
  imports: [CardMetaComponent, ModalNormalComponent],
  templateUrl: './metas.component.html',
  styles: ``
})
export default class MetasComponent implements OnInit {

  private auhService = inject(AuthService);
  private metaAhorroService = inject(MetaAhorroService);

  @ViewChild("modalConfirmCancelar") modalConfirmCancelar = new ModalNormalComponent(); 
  @ViewChild('modalError') modalError = new ModalNormalComponent();

  mensajeDeExitoCancelacion = '';
  mensajeModalError = '';
  metas: Meta[] = [];

  ngOnInit():void {
    this.auhService.usuarioLogueado.subscribe(usuario => {
      if(usuario == null){
        return;
      }

      this.metaAhorroService.refrescarInformacion(usuario.id);
      this.metaAhorroService.todasLasMetasObservable.subscribe({
        next: (res) => {
          this.metas = res;
        },
        error: (err) => {
          console.log(err);
        }
      })
    })
  }
}
