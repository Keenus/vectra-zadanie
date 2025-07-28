import { createReducer, on } from '@ngrx/store';
import {
  clearFormData,
  createCustomer, createCustomerFailure,
  createCustomerSuccess, initializeFormData,
  loadCustomers,
  loadCustomersFailure,
  loadCustomersSuccess, saveBasicInfo, saveInterests, setSearchTerm, sortCustomers
} from './customers.actions';
import {CustomerInterface, CustomersState} from './customer.model';

export const initialState: CustomersState = {
  customers: [],
  searchTerm: '',
  loading: false,
  error: null,
  formData: {
    first_name: '',
    last_name: '',
    phone: '',
    interests: []
  },
  isFormInitialized: false
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
      loading: false,
      formData: {
        first_name: '',
        last_name: '',
        phone: '',
        interests: []
      },
      isFormInitialized: false
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
  ),
  on(
    saveBasicInfo,
    (state, { payload }) => ({
      ...state,
      formData: {
        ...state.formData,
        first_name: payload.first_name,
        last_name: payload.last_name,
        phone: payload.phone
      },
      isFormInitialized: true
    })
  ),
  on(
    saveInterests,
    (state, { payload }) => ({
      ...state,
      formData: {
        ...state.formData,
        interests: payload
      }
    })
  ),
  on(
    clearFormData,
    (state) => ({
      ...state,
      formData: {
        first_name: '',
        last_name: '',
        phone: '',
        interests: []
      },
      isFormInitialized: false
    })
  ),
  on(
    initializeFormData,
    (state, { payload }) => ({
      ...state,
      formData: {
        first_name: payload?.first_name || '',
        last_name: payload?.last_name || '',
        phone: payload?.phone || '',
        interests: payload?.interests || []
      },
      isFormInitialized: true
    })
  )
);
