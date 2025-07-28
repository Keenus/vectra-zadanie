import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {of, tap} from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { CustomersService } from '../../core/service/customers.service';
import {
  clearFormData,
  createCustomer, createCustomerFailure,
  createCustomerSuccess,
  loadCustomers,
  loadCustomersFailure,
  loadCustomersSuccess, saveBasicInfo, saveInterests
} from './customers.actions';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class CustomersEffects {

  private customersService = inject(CustomersService)
  private _snackBar = inject(MatSnackBar)
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
      this._snackBar.open('Dodano klienta', 'OK')
    })
    ), { dispatch: false})

  saveBasicInfoToLocalStorage$ = createEffect(() => this.actions$.pipe(
    ofType(saveBasicInfo),
    tap((action) => {
      const currentData = JSON.parse(localStorage.getItem('customerFormData') || '{}');
      const updatedData = {
        ...currentData,
        ...action.payload,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('customerFormData', JSON.stringify(updatedData));
    })
  ), { dispatch: false });

  saveInterestsToLocalStorage$ = createEffect(() => this.actions$.pipe(
    ofType(saveInterests),
    tap((action) => {
      const currentData = JSON.parse(localStorage.getItem('customerFormData') || '{}');
      const updatedData = {
        ...currentData,
        interests: action.payload,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('customerFormData', JSON.stringify(updatedData));
    })
  ), { dispatch: false });

  clearFormDataFromLocalStorage$ = createEffect(() => this.actions$.pipe(
    ofType(clearFormData),
    tap(() => {
      localStorage.removeItem('customerFormData');
    })
  ), { dispatch: false });
}
