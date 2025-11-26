import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderDashboardComponent } from '../../shared/header-dashboard/header-dashboard.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { EventosSidebarService } from '../../services/eventos-sidebar.service';

@Component({
  selector: 'app-privado',
  imports: [RouterOutlet, HeaderDashboardComponent, SidebarComponent],
  templateUrl: './privado.component.html',
  styles: ``
})
export class PrivadoComponent implements OnInit {
  
  private eventosSidebarService = inject(EventosSidebarService);
  
  showMenu = false;
  
  recibirPropiedadDelHijo(dato: boolean){
    this.showMenu = dato;
  }
  
  ngOnInit(): void {
    this.eventosSidebarService.escuchar().subscribe(valor => {
      this.showMenu = valor;
    })
  }
}
