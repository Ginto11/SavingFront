import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { routes } from './app.routes';
import localeEs from '@angular/common/locales/es';
import { provideHttpClient, withFetch } from '@angular/common/http';


registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withFetch()),
    {
      provide: LOCALE_ID, useValue: 'es'
    }
  ]
};
