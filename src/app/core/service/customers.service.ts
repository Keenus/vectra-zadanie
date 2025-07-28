import { Injectable } from '@angular/core';
import {delay, Observable, of} from 'rxjs';
import {CustomerInterface} from '../../store/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  loadFromLocalStorage(): CustomerInterface[] {
    const customers: string = localStorage.getItem('customers') || ''
    return customers ? JSON.parse(customers) : []
  }

  getAllCustomers(): Observable<CustomerInterface[]> {
    const data = this.loadFromLocalStorage();
    return of(data).pipe(delay(300));
  }

  createCustomer(customer: CustomerInterface): Observable<CustomerInterface>  {
    const data = this.loadFromLocalStorage();
    const updated = [...data, customer];
    localStorage.setItem('customers', JSON.stringify(updated));
    return of(customer).pipe(delay(300));
  }

}
