import { createAction } from '@ngrx/store';
import {CustomerInterface} from './customer.model';

export const loadCustomers = createAction('[Customers] Load Customers');

export const loadCustomersSuccess = createAction(
  '[Customers] Load Success',
  (customers: CustomerInterface[]) => ({ payload: customers })
);

export const loadCustomersFailure = createAction(
  '[Customers] Load Fail',
  (error: string) => ({ payload: error })
);

export const createCustomer = createAction(
  '[Customers] Create Customer',
  (customer: CustomerInterface) => ({ payload: customer })
);

export const createCustomerSuccess = createAction(
  '[Customers] Create Success',
  (customer: CustomerInterface) => ({ payload: customer })
);

export const createCustomerFailure = createAction(
  '[Customers] Create Fail',
  (error: string) => ({ payload: error })
);

export const sortCustomers = createAction(
  '[Customers] Sort Customers',
  (sort: { active: string; direction: 'asc' | 'desc' }) => ({ payload: sort })
);

export const setSearchTerm = createAction(
  '[Customers] Set Search Term',
  (searchTerm?: string ) => ({ payload: searchTerm })
);

export const saveBasicInfo = createAction(
  '[Customer Form] Save Basic Info',
  (basicInfo: { first_name: string; last_name: string; phone: string }) => ({ payload: basicInfo })
);

export const saveInterests = createAction(
  '[Customer Form] Save Interests',
  (interests: string[]) => ({ payload: interests })
);

export const clearFormData = createAction(
  '[Customer Form] Clear Form Data'
);

export const initializeFormData = createAction(
  '[Customer Form] Initialize Form Data',
  (formData?: Partial<CustomerInterface>) => ({ payload: formData })
);
