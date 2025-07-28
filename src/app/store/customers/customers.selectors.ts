import { createFeatureSelector, createSelector } from '@ngrx/store';
import {CustomersState} from './customer.model';
export const selectCustomersState = createFeatureSelector<CustomersState>('customers');

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
  (state: CustomersState) => state.error as string
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

export const selectFormData = createSelector(
  selectCustomersState,
  (state) => state.formData
);

export const selectBasicInfo = createSelector(
  selectFormData,
  (formData) => ({
    first_name: formData.first_name,
    last_name: formData.last_name,
    phone: formData.phone
  })
);

export const selectInterests = createSelector(
  selectFormData,
  (formData) => formData.interests
);

export const selectIsFormInitialized = createSelector(
  selectCustomersState,
  (state) => state.isFormInitialized
);

export const selectIsBasicInfoComplete = createSelector(
  selectBasicInfo,
  (basicInfo) =>
    basicInfo.first_name.length >= 3 &&
    basicInfo.last_name.length >= 3 &&
    basicInfo.phone.length === 9 &&
    /^\+?[0-9\s]+$/.test(basicInfo.phone)
);

export const selectCompleteCustomerData = createSelector(
  selectFormData,
  (formData) => formData
);
