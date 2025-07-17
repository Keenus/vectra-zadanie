import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {of, tap} from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { CustomersService } from '../core/service/customers.service';
import {
  createCustomer, createCustomerFailure,
  createCustomerSuccess,
  loadCustomers,
  loadCustomersFailure,
  loadCustomersSuccess
} from './customers.actions';
import {Router} from '@angular/router';

@Injectable()
export class CustomersEffects {

  private customersService = inject(CustomersService)
  private actions$ = inject(Actions)
  private router = inject(Router)

  loadCustomers$ = createEffect(() => this.actions$.pipe(
      ofType(loadCustomers),
      mergeMap(() =>
        this.customersService.getAllCustomers()
        .pipe(
          map(customers => {
            localStorage.setItem('customers', JSON.stringify(customers));
            return loadCustomersSuccess(customers)
          }),
          catchError((err) =>
            of(loadCustomersFailure(err.message)))
        ))
    ));

  createCustomer$ = createEffect(() => this.actions$.pipe(
    ofType(createCustomer),
    mergeMap((action) =>
      this.customersService.createCustomer(action.payload)
      .pipe(
        map(customer => (createCustomerSuccess(customer))),
        catchError((err) => of(createCustomerFailure(err.message)))
      ))
  ))

  changeRouteAfterCreate$ = createEffect(() => this.actions$.pipe(
    ofType(createCustomerSuccess),
    tap(() => {
      this.router.navigate(['/home'])
      alert('Dodano klienta');
    })
    ), { dispatch: false})
}
