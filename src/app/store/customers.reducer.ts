import { createReducer, on } from '@ngrx/store';
import {
  createCustomer, createCustomerFailure,
  createCustomerSuccess,
  loadCustomers,
  loadCustomersFailure,
  loadCustomersSuccess, setSearchTerm, sortCustomers
} from './customers.actions';
export interface CustomersState {
  customers: any[];
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
  // ładowanie danych
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
  // tworzenie nowego klienta
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
      customers: [...state.customers].sort((a, b) => {
        const valueA = a[payload.active];
        const valueB = b[payload.active];
        return payload.direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      })
    })
  )
);
