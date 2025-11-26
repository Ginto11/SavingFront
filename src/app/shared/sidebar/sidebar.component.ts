import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkMenu } from '../../interfaces/link-menu.interface';
import { LinkMenuComponent } from '../../components/link-menu/link-menu.component';
import { ModalNormalComponent } from '../modal-normal/modal-normal.component';
import { LocalstorageService } from '../../services/localstorage.service';
import { Router } from '@angular/router';
import { EventosSidebarService } from '../../services/eventos-sidebar.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, LinkMenuComponent, ModalNormalComponent],
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent {

  private router = inject(Router);
  private localstorageService = inject(LocalstorageService);
  private eventosSidebarService = inject(EventosSidebarService);

  @Output() showMenuCerrar = new EventEmitter<boolean>();
  @ViewChild('modalRef') modalCerrarSesion!: ModalNormalComponent;



  linkDashboard: LinkMenu = {
    nombreIcon: 'pi-home',
    nombreRuta: '/dashboard',
    nombreLink: 'Dashboard'
  }

  linksSeccion1: LinkMenu[] = [
    {
      nombreIcon: 'pi-user',
      nombreRuta: 'info-usuario',
      nombreLink: 'Perfil'
    }
  ]

  linksSeccion2: LinkMenu[] = [
    {
      nombreIcon: 'pi-sparkles',
      nombreRuta: 'metas',
      nombreLink: 'Metas'
    },
    {
      nombreIcon: 'pi-align-left',
      nombreRuta: 'movimientos',
      nombreLink: 'Movimientos'
    }
  ]

  linksSeccion3: LinkMenu[] = [
    {
      nombreIcon: 'pi-unlock',
      nombreRuta: '/cambiar-contrasena',
      nombreLink: 'Cambiar Contraseña'
    }
  ]
  
  openMenu: number | null = null;

  cerrarMenu() {
    this.eventosSidebarService.emitir(false);
  }

  cerrarSesion = (): void => {
    this.localstorageService.removerItem();
    this.router.navigate(['inicio']);
  }


  toggleMenu(menu: number) {
    this.openMenu = this.openMenu === menu ? null : menu;
  }
}
