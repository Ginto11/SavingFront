import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventosSidebarService } from '../../services/eventos-sidebar.service';

@Component({
  selector: 'app-link-menu',
  imports: [CommonModule, RouterLink],
  templateUrl: './link-menu.component.html',
  styles: ``
})
export class LinkMenuComponent {

  private eventosSidebarService = inject(EventosSidebarService);

  @Input() nombreLink: string = '';
  @Input() nombreIcon: string = '';
  @Input() nombreRuta: string = '';

      enviarDatoAlpadre(){
    this.eventosSidebarService.emitir(false);
  }

}
