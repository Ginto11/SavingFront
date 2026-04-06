import { Component, inject, OnInit } from '@angular/core';
import { EventosSidebarService } from '../../services/eventos-sidebar.service';
import { EventosService } from '../../services/eventos.service';

@Component({
  selector: 'app-button-theme',
  imports: [],
  templateUrl: './button-theme.component.html',
  styles: ``,
})
export class ButtonThemeComponent implements OnInit {

  private eventosService = inject(EventosService);

  ngOnInit(): void {

    var themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    var themeToggleLightIcon = document.getElementById(
      'theme-toggle-light-icon',
    );

    // Change the icons inside the button based on previous settings
    if (
      localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      themeToggleLightIcon?.classList.remove('hidden');
    } else {
      themeToggleDarkIcon?.classList.remove('hidden');
    }

    var themeToggleBtn = document.getElementById('theme-toggle');

    themeToggleBtn?.addEventListener('click', () => {
      // toggle icons inside button
      themeToggleDarkIcon?.classList.toggle('hidden');
      themeToggleLightIcon?.classList.toggle('hidden');

      // if set via local storage previously
      if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
          document.documentElement.classList.add('dark');
          localStorage.setItem('color-theme', 'dark');
          this.eventosService.emitir(true);
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('color-theme', 'light');
          this.eventosService.emitir(false);
        }

        // if NOT set via local storage previously
      } else {
        if (document.documentElement.classList.contains('dark')) {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('color-theme', 'light');
        } else {
          document.documentElement.classList.add('dark');
          localStorage.setItem('color-theme', 'dark');
        }
      }
    });
  }

}
