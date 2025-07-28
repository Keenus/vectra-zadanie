import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {provideStore} from '@ngrx/store';
import {customersReducer} from './store/customers/customers.reducer';
import {provideEffects} from '@ngrx/effects';
import {CustomersEffects} from './store/customers/customers.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideEffects([CustomersEffects]),
    provideStore({
        customers: customersReducer
    })
  ]
};
