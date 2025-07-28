import { createReducer, on } from '@ngrx/store';
import {
  createCustomer, createCustomerFailure,
  createCustomerSuccess,
  loadCustomers,
  loadCustomersFailure,
  loadCustomersSuccess, setSearchTerm, sortCustomers
} from './customers.actions';
import {CustomerInterface} from './customer.model';
export interface CustomersState {
  customers: CustomerInterface[];
  searchTerm: string;
  loading: boolean;
  error: string | null;
}

export const initialState: CustomersState = {
  customers: [],
  searchTerm: '',
  loading: false,
  error: null
};

export const customersReducer = createReducer(
  initialState,
  on(
    loadCustomers,
    (state) => ({ ...state, loading: true, error: null })
  ),
  on(
    loadCustomersSuccess,
    (state, { payload }) => ({ ...state, customers: payload, loading: false })
  ),
  on(
    loadCustomersFailure,
    (state, { payload }) => ({ ...state, loading: false, error: payload })
  ),
  on(
    createCustomer,
    (state) => ({
      ...state,
      loading: true,
      error: null
      })),
  on(
    createCustomerSuccess,
    (state, { payload }) => ({
      ...state,
      customers: [...state.customers, payload],
      loading: false
    })
  ),
  on(
    createCustomerFailure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload
    })
  ),
  on(
    setSearchTerm,
    (state, { payload }) => ({
      ...state,
      searchTerm: payload ? payload.trim().toLowerCase() : ''
    })
  ),
  on(
    sortCustomers,
    (state, { payload }) => ({
      ...state,
      customers: [...state.customers].sort((a: CustomerInterface, b: CustomerInterface) => {
        const key = payload.active as keyof CustomerInterface
        const valueA = a[key].toString().toLowerCase();
        const valueB = b[key].toString().toLowerCase()
        return payload.direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      })
    })
  )
);
