import { Routes } from '@angular/router';
import PublicoComponent from './layouts/publico/publico.component';
import { PrivadoComponent } from './layouts/privado/privado.component';

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
            }
        ]
    },
    {
        path: 'dashboard',
        component: PrivadoComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/dashboard/dashboard.component')
            },
            {
                path: 'info-usuario',
                loadComponent: () => import('./pages/info-usuario/info-usuario.component')
            },
            {
                path: 'metas',
                loadComponent: () => import('./pages/metas/metas.component')
            },
            {
                path: 'ingresos-gastos',
                loadComponent: () => import('./pages/ingresos-gastos/ingresos-gastos.component')
            },
            {
                path: 'graficas',
                loadComponent: () => import('./pages/comportamientos/comportamientos.component')
            },
            {
                path: 'movimientos-ahorros',
                loadComponent: () => import('./pages/movimientos-ahorros/movimientos-ahorros.component')
            }
        ]
    }
];
