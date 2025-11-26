import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header-dashboard',
  imports: [],
  templateUrl: './header-dashboard.component.html',
  styles: ``
})
export class HeaderDashboardComponent {

  @Output() showMenu = new EventEmitter<boolean>();

  enviarPropiedadShowMenu(){
    this.showMenu.emit(true);
  }

}
