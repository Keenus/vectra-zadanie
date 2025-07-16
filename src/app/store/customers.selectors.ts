import { createFeatureSelector, createSelector } from '@ngrx/store';
import {CustomersState} from './customers.reducer';
export const selectCustomersState = createFeatureSelector<CustomersState >('customers');

export const selectAllCustomers = createSelector(
  selectCustomersState,
  (state: CustomersState) => state.customers
);

export const selectCustomersLoading = createSelector(
  selectCustomersState,
  (state: CustomersState) => state.loading
);

export const selectCustomersError = createSelector(
  selectCustomersState,
  (state: CustomersState) => state.error + ''
);

export const selectSearchTerm = createSelector(
  selectCustomersState,
  (state: CustomersState) => state.searchTerm
);

export const selectFilteredCustomers = createSelector(
  selectAllCustomers,
  selectSearchTerm,
  (customers, searchTerm) => {
    if (!searchTerm) {
      return customers;
    }
    return customers.filter(customer =>
      customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    );
  }
);
