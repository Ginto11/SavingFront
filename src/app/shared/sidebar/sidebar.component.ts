import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkMenu } from '../../interfaces/link-menu.interface';
import { LinkMenuComponent } from '../../components/link-menu/link-menu.component';
import { EventosSidebarService } from '../../services/eventos-sidebar.service';
import { ModalesService } from '../../services/modales.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, LinkMenuComponent],
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent {

  modalesService = inject(ModalesService);
  private eventosSidebarService = inject(EventosSidebarService);

  @Output() showMenuCerrar = new EventEmitter<boolean>();



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
      nombreIcon: 'pi-chart-line',
      nombreLink: 'Movimientos Ahorros',
      nombreRuta: 'movimientos-ahorros'
    }
  ]

  linksSeccion3: LinkMenu[] = [
    {
      nombreIcon: 'pi-unlock',
      nombreRuta: 'cambiar-contrasena',
      nombreLink: 'Cambiar Contraseña'
    }
  ]

  linksSeccion4: LinkMenu[] = [
    {
      nombreIcon: 'pi-wallet',
      nombreRuta: 'ingresos-gastos',
      nombreLink: 'Ingresos y Gastos'
    }
  ]

  linksSeccion5: LinkMenu[] = [
    {
      nombreIcon: 'pi-chart-bar',
      nombreRuta: 'graficas',
      nombreLink: 'Graficas'
    }
  ]
  
  openMenu: number | null = null;

  cerrarMenu() {
    this.eventosSidebarService.emitir(false);
  }

  toggleMenu(menu: number) {
    this.openMenu = this.openMenu === menu ? null : menu;
  }
}
