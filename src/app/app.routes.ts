import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component') },
  {
    path: 'validation',
    loadComponent: () => import('./pages/validation/validation.component'),
  },
  {
    path: 'advanced-validation',
    loadComponent: () =>
      import('./pages/advanced-validation/advanced-validation.component'),
  },
];
