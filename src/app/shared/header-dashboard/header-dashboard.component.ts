import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonThemeComponent } from "../button-theme/button-theme.component";

@Component({
  selector: 'app-header-dashboard',
  imports: [ButtonThemeComponent],
  templateUrl: './header-dashboard.component.html',
  styles: ``
})
export class HeaderDashboardComponent {

  @Output() showMenu = new EventEmitter<boolean>();

  enviarPropiedadShowMenu(){
    this.showMenu.emit(true);
  }

}
