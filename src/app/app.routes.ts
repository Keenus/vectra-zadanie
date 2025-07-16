import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'add-customer',
    loadComponent: () => import('./features/add-customer/add-customer.component').then(m => m.AddCustomerComponent)
  }
];
