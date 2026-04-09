import { Component, inject, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioLogin } from '../../interfaces/usuario-login.interface';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ingresar',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './ingresar.component.html',
  styles: ``
})
export default class IngresarComponent implements OnDestroy {
  
  private authService = inject(AuthService);
  private onDestroy: Subject<boolean> = new Subject();

  isIngresando = false;

  usuario: UsuarioLogin = {
    usuario: '',
    contrasena: ''
  }

  ingresar(): void {
    this.isIngresando = true;
    this.authService.login(this.usuario)
    .pipe(takeUntil(this.onDestroy))
    .subscribe({
      next: () => this.isIngresando = true,
      error: (err) => {
        this.isIngresando = false;
      }
    })
  }
  
  ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }
}
