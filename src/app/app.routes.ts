import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Ajusta la ruta

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'app',
    loadComponent: () => import('./pages/data-list/data-list.page').then( m => m.DataListPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
];
