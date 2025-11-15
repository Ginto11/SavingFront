import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-publico',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './publico.component.html',
  styles: ``
})
export default class PublicoComponent {

}
