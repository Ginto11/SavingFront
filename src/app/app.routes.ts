import { Routes } from '@angular/router';
import PublicoComponent from './layouts/publico/publico.component';

export const routes: Routes = [
    {
        path: '',
        component: PublicoComponent,
        children: [
            {
                path: '',
                redirectTo: 'inicio',
                pathMatch: 'full'
            },
            {
                path: 'inicio',
                loadComponent: () => import('./pages/inicio/inicio.component')
            },
            {
                path: 'registrarse',
                loadComponent: () => import('./pages/registrarse/registrarse.component')
            },
            {
                path: 'ingresar',
                loadComponent: () => import('./pages/ingresar/ingresar.component')
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/dashboard/dashboard.component')
            }
        ]
    }
];
