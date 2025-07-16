import { Injectable } from '@angular/core';
import {delay, of} from 'rxjs';
import {Customer} from '../../store/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  loadFromLocalStorage() {
    const customers = localStorage.getItem('customers');
    return customers ? JSON.parse(customers) : [];
  }

  getAllCustomers() {
    const data = this.loadFromLocalStorage();
    return of(data).pipe(delay(300));
  }

  createCustomer(customer: Customer) {
    const data = this.loadFromLocalStorage();
    const updated = [...data, customer];
    localStorage.setItem('customers', JSON.stringify(updated));
    return of(customer);
  }

}
